from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import models
from authentication.models import User
from .models import RecruiterCompanyProfile, JobPost
from .serializers import (
    RecruiterCompanyProfileSerializer,
    RecruiterCompanyProfileUpdateSerializer,
    AdminCompanyProfileSerializer,
    CompanyVerificationSerializer,
    RecruiterApprovalSerializer,
    RecruiterListSerializer,
    JobPostSerializer
)
from .permissions import IsRecruiter, IsAdmin, IsRecruiterOwner

@api_view(['GET', 'POST', 'PUT'])
@permission_classes([IsRecruiter])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def company_profile_view(request):
    """
    Recruiter Company Profile Management - STRICT DATA ISOLATION
    GET: Retrieve company profile (ONLY for logged-in recruiter)
    POST: Create company profile (ONLY for logged-in recruiter)
    PUT: Update company profile (ONLY for logged-in recruiter)
    """
    
    # SECURITY: Verify user is a recruiter
    if request.user.role != 'recruiter':
        return Response({
            'success': False,
            'message': 'Access denied. Only recruiters can access company profiles.',
            'errors': {'permission': ['User is not a recruiter']}
        }, status=status.HTTP_403_FORBIDDEN)
    
    # SECURITY: Get recruiter ID from JWT token (never from request data)
    recruiter_id = request.user.id
    
    # DEBUG LOGGING
    print("=" * 80)
    print(f"COMPANY PROFILE REQUEST - {request.method}")
    print(f"Recruiter ID from JWT: {recruiter_id}")
    print(f"Recruiter Email: {request.user.email}")
    print(f"Recruiter Role: {request.user.role}")
    print("=" * 80)
    
    if request.method == 'GET':
        try:
            # STRICT QUERY: Only get profile for THIS recruiter
            profile = RecruiterCompanyProfile.objects.get(recruiter_id=recruiter_id)
            
            # SECURITY CHECK: Double-verify ownership
            if profile.recruiter.id != recruiter_id:
                print(f"SECURITY ALERT: Profile recruiter_id mismatch!")
                return Response({
                    'success': False,
                    'message': 'Security error: Profile ownership mismatch',
                    'profile': None
                }, status=status.HTTP_403_FORBIDDEN)
            
            serializer = RecruiterCompanyProfileSerializer(profile)
            
            print(f"✅ GET: Returning profile for recruiter {recruiter_id}")
            print(f"   Company: {profile.company_name}")
            
            return Response({
                'success': True,
                'profile': serializer.data,
                'debug': {
                    'recruiter_id': recruiter_id,
                    'profile_id': profile.id,
                    'company_name': profile.company_name
                }
            }, status=status.HTTP_200_OK)
            
        except RecruiterCompanyProfile.DoesNotExist:
            print(f"ℹ️  GET: No profile found for recruiter {recruiter_id}")
            return Response({
                'success': False,
                'message': 'Company profile not found. Please create your company profile.',
                'profile': None,
                'debug': {
                    'recruiter_id': recruiter_id,
                    'has_profile': False
                }
            }, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'POST':
        # SECURITY: Check if profile already exists for THIS recruiter
        if RecruiterCompanyProfile.objects.filter(recruiter_id=recruiter_id).exists():
            existing_profile = RecruiterCompanyProfile.objects.get(recruiter_id=recruiter_id)
            print(f"❌ POST: Profile already exists for recruiter {recruiter_id}")
            return Response({
                'success': False,
                'message': 'Company profile already exists. Use PUT to update.',
                'errors': {'non_field_errors': ['Profile already exists']},
                'debug': {
                    'recruiter_id': recruiter_id,
                    'existing_profile_id': existing_profile.id
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RecruiterCompanyProfileUpdateSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # SECURITY: Force recruiter to be the logged-in user
            profile = serializer.save(recruiter=request.user)
            
            # SECURITY CHECK: Verify the profile was created for correct recruiter
            if profile.recruiter.id != recruiter_id:
                print(f"SECURITY ALERT: Profile created for wrong recruiter!")
                profile.delete()  # Delete the incorrectly created profile
                return Response({
                    'success': False,
                    'message': 'Security error: Profile creation failed',
                    'errors': {'security': ['Profile ownership error']}
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            response_serializer = RecruiterCompanyProfileSerializer(profile)
            
            print(f"✅ POST: Created profile for recruiter {recruiter_id}")
            print(f"   Company: {profile.company_name}")
            
            return Response({
                'success': True,
                'message': 'Company profile created successfully',
                'profile': response_serializer.data,
                'debug': {
                    'recruiter_id': recruiter_id,
                    'profile_id': profile.id
                }
            }, status=status.HTTP_201_CREATED)
        
        print(f"❌ POST: Validation errors: {serializer.errors}")
        return Response({
            'success': False,
            'message': 'Failed to create company profile',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        try:
            # STRICT QUERY: Only get profile for THIS recruiter
            profile = RecruiterCompanyProfile.objects.get(recruiter_id=recruiter_id)
            
            # SECURITY CHECK: Double-verify ownership
            if profile.recruiter.id != recruiter_id:
                print(f"SECURITY ALERT: Attempted to update another recruiter's profile!")
                return Response({
                    'success': False,
                    'message': 'Security error: Cannot update another recruiter\'s profile',
                    'errors': {'permission': ['Access denied']}
                }, status=status.HTTP_403_FORBIDDEN)
            
        except RecruiterCompanyProfile.DoesNotExist:
            print(f"❌ PUT: No profile found for recruiter {recruiter_id}")
            return Response({
                'success': False,
                'message': 'Company profile not found. Please create your profile first.',
                'errors': {'non_field_errors': ['Profile not found']},
                'debug': {
                    'recruiter_id': recruiter_id,
                    'has_profile': False
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = RecruiterCompanyProfileUpdateSerializer(
            profile,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # SECURITY: Ensure recruiter field cannot be changed
            profile = serializer.save()
            
            # SECURITY CHECK: Verify ownership wasn't changed
            if profile.recruiter.id != recruiter_id:
                print(f"SECURITY ALERT: Profile ownership was changed!")
                return Response({
                    'success': False,
                    'message': 'Security error: Profile ownership cannot be changed',
                    'errors': {'security': ['Ownership violation']}
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            response_serializer = RecruiterCompanyProfileSerializer(profile)
            
            print(f"✅ PUT: Updated profile for recruiter {recruiter_id}")
            print(f"   Company: {profile.company_name}")
            
            return Response({
                'success': True,
                'status': 'success',
                'message': 'Company profile updated successfully',
                'profile': response_serializer.data,
                'updated_fields': list(request.data.keys()),
                'debug': {
                    'recruiter_id': recruiter_id,
                    'profile_id': profile.id
                }
            }, status=status.HTTP_200_OK)
        
        print(f"❌ PUT: Validation errors: {serializer.errors}")
        return Response({
            'success': False,
            'message': 'Failed to update company profile',
            'errors': serializer.errors,
            'debug_data': {
                'received_data': dict(request.data),
                'content_type': request.content_type
            }
        }, status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            profile = serializer.save()
            response_serializer = RecruiterCompanyProfileSerializer(profile)
            
            return Response({
                'success': True,
                'status': 'success',
                'message': 'Company profile updated successfully',
                'profile': response_serializer.data,
                'updated_fields': list(request.data.keys())
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Failed to update company profile',
            'errors': serializer.errors,
            'debug_data': {
                'received_data': dict(request.data),
                'content_type': request.content_type
            }
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_company_profiles_view(request):
    """
    Admin view to get all company profiles
    """
    profiles = RecruiterCompanyProfile.objects.all().select_related('recruiter')
    
    # Filter by verification status if provided
    status_filter = request.GET.get('status')
    if status_filter and status_filter in ['pending', 'verified', 'rejected']:
        profiles = profiles.filter(verification_status=status_filter)
    
    # Search by company name
    search = request.GET.get('search')
    if search:
        profiles = profiles.filter(company_name__icontains=search)
    
    serializer = AdminCompanyProfileSerializer(profiles, many=True)
    
    return Response({
        'success': True,
        'profiles': serializer.data,
        'total': profiles.count(),
        'filters': {
            'status': status_filter,
            'search': search
        }
    }, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAdmin])
def admin_verify_company_view(request, profile_id):
    """
    Admin endpoint to verify/reject company profiles
    """
    profile = get_object_or_404(RecruiterCompanyProfile, id=profile_id)
    
    serializer = CompanyVerificationSerializer(
        profile,
        data=request.data,
        partial=True
    )
    
    if serializer.is_valid():
        profile = serializer.save()
        response_serializer = AdminCompanyProfileSerializer(profile)
        
        # Send notification to recruiter (can be implemented later)
        verification_status = profile.verification_status
        status_message = {
            'verified': 'Company profile has been verified! You can now post jobs.',
            'rejected': 'Company profile has been rejected. Please check the notes and resubmit.',
            'pending': 'Company profile is under review.'
        }
        
        return Response({
            'success': True,
            'message': f'Company profile {verification_status} successfully',
            'profile': response_serializer.data,
            'notification_message': status_message.get(verification_status, '')
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Failed to update verification status',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsRecruiter])
@parser_classes([MultiPartParser, FormParser])
def upload_company_document_view(request):
    """
    Upload company registration document
    """
    try:
        profile = RecruiterCompanyProfile.objects.get(recruiter=request.user)
    except RecruiterCompanyProfile.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Company profile not found. Please create your profile first.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if 'document' not in request.FILES:
        return Response({
            'success': False,
            'message': 'No document file provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    document = request.FILES['document']
    
    # Validate file type (PDF, DOC, DOCX)
    allowed_extensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
    file_extension = document.name.lower().split('.')[-1]
    if f'.{file_extension}' not in allowed_extensions:
        return Response({
            'success': False,
            'message': 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate file size (max 10MB)
    if document.size > 10 * 1024 * 1024:
        return Response({
            'success': False,
            'message': 'File size too large. Maximum size is 10MB.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Save document
    profile.company_registration_document = document
    profile.save()
    
    return Response({
        'success': True,
        'message': 'Company document uploaded successfully',
        'document_url': profile.company_registration_document.url if profile.company_registration_document else None
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsRecruiter])
@parser_classes([MultiPartParser, FormParser])
def upload_office_photos_view(request):
    """
    Upload office photos
    """
    try:
        profile = RecruiterCompanyProfile.objects.get(recruiter=request.user)
    except RecruiterCompanyProfile.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Company profile not found. Please create your profile first.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if 'photos' not in request.FILES:
        return Response({
            'success': False,
            'message': 'No photo files provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    photos = request.FILES.getlist('photos')
    uploaded_photos = []
    
    for photo in photos:
        # Validate file type
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif']
        file_extension = photo.name.lower().split('.')[-1]
        if f'.{file_extension}' not in allowed_extensions:
            continue
        
        # Validate file size (max 5MB per photo)
        if photo.size > 5 * 1024 * 1024:
            continue
        
        # Save photo (implement file saving logic)
        # For now, just add to list
        uploaded_photos.append(photo.name)
    
    # Update office photos list
    current_photos = profile.get_office_photos_list()
    current_photos.extend(uploaded_photos)
    profile.set_office_photos_list(current_photos)
    profile.save()
    
    return Response({
        'success': True,
        'message': f'{len(uploaded_photos)} office photos uploaded successfully',
        'photos': current_photos
    }, status=status.HTTP_200_OK)

# ============================================================================
# ADMIN VIEWS FOR RECRUITER APPROVAL WORKFLOW
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_recruiters_list_view(request):
    """
    Admin view to get all recruiters with their approval status
    """
    # Get all recruiters
    recruiters = User.objects.filter(role='recruiter').order_by('-created_at')
    
    # Filter by approval status if provided
    status_filter = request.GET.get('status')
    if status_filter and status_filter in ['pending', 'approved', 'rejected']:
        recruiters = recruiters.filter(approval_status=status_filter)
    
    # Filter by profile completion
    profile_filter = request.GET.get('profile_completed')
    if profile_filter in ['true', 'false']:
        recruiters = recruiters.filter(profile_completed=profile_filter.lower() == 'true')
    
    # Search by name or email
    search = request.GET.get('search')
    if search:
        recruiters = recruiters.filter(
            models.Q(first_name__icontains=search) |
            models.Q(last_name__icontains=search) |
            models.Q(email__icontains=search)
        )
    
    serializer = RecruiterListSerializer(recruiters, many=True)
    
    return Response({
        'success': True,
        'recruiters': serializer.data,
        'total': recruiters.count(),
        'filters': {
            'status': status_filter,
            'profile_completed': profile_filter,
            'search': search
        }
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_recruiter_detail_view(request, recruiter_id):
    """
    Admin view to get detailed recruiter information
    """
    recruiter = get_object_or_404(User, id=recruiter_id, role='recruiter')
    serializer = RecruiterApprovalSerializer(recruiter)
    
    return Response({
        'success': True,
        'recruiter': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAdmin])
def admin_approve_recruiter_view(request, recruiter_id):
    """
    Admin endpoint to approve recruiter
    """
    recruiter = get_object_or_404(User, id=recruiter_id, role='recruiter')
    
    # Check if recruiter has completed profile
    if not recruiter.profile_completed:
        return Response({
            'success': False,
            'message': 'Cannot approve recruiter. Profile not completed.',
            'errors': {'profile': ['Recruiter must complete their company profile first']}
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Approve the recruiter
    recruiter.approve_recruiter()
    
    # Also verify company profile if exists
    try:
        company_profile = recruiter.company_profile
        if company_profile.verification_status == 'pending':
            company_profile.verification_status = 'verified'
            company_profile.save()
    except RecruiterCompanyProfile.DoesNotExist:
        pass
    
    serializer = RecruiterApprovalSerializer(recruiter)
    
    return Response({
        'success': True,
        'message': 'Recruiter approved successfully. They can now post jobs.',
        'recruiter': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAdmin])
def admin_reject_recruiter_view(request, recruiter_id):
    """
    Admin endpoint to reject recruiter
    """
    recruiter = get_object_or_404(User, id=recruiter_id, role='recruiter')
    
    # Get rejection reason from request
    rejection_reason = request.data.get('reason', '')
    
    # Reject the recruiter
    recruiter.reject_recruiter()
    
    # Also reject company profile if exists
    try:
        company_profile = recruiter.company_profile
        company_profile.verification_status = 'rejected'
        company_profile.verification_notes = rejection_reason
        company_profile.save()
    except RecruiterCompanyProfile.DoesNotExist:
        pass
    
    serializer = RecruiterApprovalSerializer(recruiter)
    
    return Response({
        'success': True,
        'message': 'Recruiter rejected successfully.',
        'recruiter': serializer.data,
        'rejection_reason': rejection_reason
    }, status=status.HTTP_200_OK)

# ============================================================================
# JOB POSTING ACCESS GUARD
# ============================================================================

@api_view(['POST'])
@permission_classes([IsRecruiter])
def create_job_view(request):
    """
    Create job posting (only for approved recruiters)
    """
    print("=" * 80)
    print("JOB POSTING REQUEST")
    print("=" * 80)
    print(f"User: {request.user.email}")
    print(f"Can post jobs: {request.user.can_post_jobs()}")
    print(f"Request data: {request.data}")
    
    # Check if recruiter can post jobs (has company profile)
    if not request.user.can_post_jobs():
        return Response({
            'success': False,
            'message': 'Please complete your company profile before posting jobs.',
            'errors': {
                'company_profile': ['You must fill out your company information before posting jobs.'],
                'redirect_to': '/recruiter/company-profile'
            }
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Create job using serializer
    serializer = JobPostSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        job = serializer.save()
        print(f"✅ Job created successfully: {job.id}")
        return Response({
            'success': True,
            'message': f'Job {"published" if job.is_published else "saved as draft"} successfully!',
            'job': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    print(f"❌ Validation errors: {serializer.errors}")
    return Response({
        'success': False,
        'message': 'Failed to create job posting',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsRecruiter])
def my_jobs_view(request):
    """
    Get all jobs posted by the logged-in recruiter
    """
    recruiter = request.user
    jobs = JobPost.objects.filter(recruiter=recruiter).order_by('-created_at')
    serializer = JobPostSerializer(jobs, many=True)
    
    return Response({
        'success': True,
        'count': jobs.count(),
        'jobs': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsRecruiter])
def job_detail_view(request, job_id):
    """
    Get single job detail (only if owned by recruiter)
    """
    try:
        job = JobPost.objects.get(id=job_id, recruiter=request.user)
        serializer = JobPostSerializer(job)
        return Response({
            'success': True,
            'job': serializer.data
        }, status=status.HTTP_200_OK)
    except JobPost.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Job not found or access denied'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsRecruiter])
def update_job_view(request, job_id):
    """
    Update job posting (only if owned by recruiter)
    """
    try:
        job = JobPost.objects.get(id=job_id, recruiter=request.user)
        serializer = JobPostSerializer(job, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Job updated successfully',
                'job': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except JobPost.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Job not found or access denied'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([])  # No authentication required for public jobs
def public_jobs_view(request):
    """
    Get all published jobs for candidates (public endpoint)
    """
    # Only show published jobs
    jobs = JobPost.objects.filter(is_published=True).select_related('recruiter').order_by('-created_at')
    
    # Optional filters
    job_type = request.GET.get('job_type')
    work_mode = request.GET.get('work_mode')
    location = request.GET.get('location')
    
    if job_type:
        jobs = jobs.filter(job_type=job_type)
    if work_mode:
        jobs = jobs.filter(work_mode=work_mode)
    if location:
        jobs = jobs.filter(location__icontains=location)
    
    serializer = JobPostSerializer(jobs, many=True)
    
    return Response({
        'success': True,
        'count': jobs.count(),
        'jobs': serializer.data
    }, status=status.HTTP_200_OK)



# ============================================================================
# JOB APPLICATION VIEWS - LinkedIn-style Flow
# ============================================================================

from rest_framework.permissions import IsAuthenticated
from .models import JobApplication
from .serializers import JobApplicationSerializer, JobApplicationCreateSerializer


@api_view(['GET'])
@permission_classes([])  # Public endpoint
def job_detail_public_view(request, job_id):
    """
    Get single job detail for job apply page (public)
    """
    try:
        job = JobPost.objects.get(id=job_id, is_published=True)
        serializer = JobPostSerializer(job)
        
        # Check if user is authenticated and has applied
        has_applied = False
        if request.user.is_authenticated and request.user.role == 'candidate':
            has_applied = JobApplication.objects.filter(
                job=job,
                candidate=request.user
            ).exists()
        
        return Response({
            'success': True,
            'job': serializer.data,
            'has_applied': has_applied
        }, status=status.HTTP_200_OK)
    except JobPost.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Job not found or not available'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job_view(request, job_id):
    """
    Apply for a job (candidates only)
    """
    # Security check: Only candidates can apply
    if request.user.role != 'candidate':
        return Response({
            'success': False,
            'message': 'Only candidates can apply for jobs'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get the job
    try:
        job = JobPost.objects.get(id=job_id, is_published=True)
    except JobPost.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Job not found or not available'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if already applied
    if JobApplication.objects.filter(job=job, candidate=request.user).exists():
        return Response({
            'success': False,
            'message': 'You have already applied for this job'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create application
    data = {
        'job': job_id,
        'cover_letter': request.data.get('cover_letter', '')
    }
    
    serializer = JobApplicationCreateSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        application = serializer.save()
        response_serializer = JobApplicationSerializer(application)
        
        return Response({
            'success': True,
            'message': 'Application submitted successfully!',
            'application': response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'Failed to submit application',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications_view(request):
    """
    Get all applications for the logged-in candidate
    """
    # Security check: Only candidates can view their applications
    if request.user.role != 'candidate':
        return Response({
            'success': False,
            'message': 'Only candidates can view applications'
        }, status=status.HTTP_403_FORBIDDEN)
    
    applications = JobApplication.objects.filter(
        candidate=request.user
    ).select_related('job', 'job__recruiter').order_by('-applied_at')
    
    serializer = JobApplicationSerializer(applications, many=True)
    
    return Response({
        'success': True,
        'count': applications.count(),
        'applications': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_application_status_view(request, job_id):
    """
    Check if candidate has applied for a specific job
    """
    if request.user.role != 'candidate':
        return Response({
            'success': False,
            'has_applied': False
        }, status=status.HTTP_200_OK)
    
    has_applied = JobApplication.objects.filter(
        job_id=job_id,
        candidate=request.user
    ).exists()
    
    application_data = None
    if has_applied:
        application = JobApplication.objects.get(job_id=job_id, candidate=request.user)
        application_data = {
            'status': application.status,
            'applied_at': application.applied_at
        }
    
    return Response({
        'success': True,
        'has_applied': has_applied,
        'application': application_data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsRecruiter])
def recruiter_applications_view(request):
    """
    Get all applications for recruiter's jobs
    """
    # Get all jobs posted by this recruiter
    recruiter_jobs = JobPost.objects.filter(recruiter=request.user)
    
    # Get all applications for these jobs
    applications = JobApplication.objects.filter(
        job__in=recruiter_jobs
    ).select_related('job', 'candidate').order_by('-applied_at')
    
    # Optional filters
    status_filter = request.GET.get('status')
    job_id = request.GET.get('job_id')
    
    if status_filter:
        applications = applications.filter(status=status_filter)
    if job_id:
        applications = applications.filter(job_id=job_id)
    
    serializer = JobApplicationSerializer(applications, many=True)
    
    return Response({
        'success': True,
        'count': applications.count(),
        'applications': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsRecruiter])
def update_application_status_view(request, application_id):
    """
    Update application status (recruiter only)
    """
    try:
        application = JobApplication.objects.get(id=application_id)
        
        # Security check: Only job owner can update application
        if application.job.recruiter.id != request.user.id:
            return Response({
                'success': False,
                'message': 'Access denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        recruiter_notes = request.data.get('recruiter_notes', '')
        
        if new_status not in dict(JobApplication.STATUS_CHOICES):
            return Response({
                'success': False,
                'message': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        application.status = new_status
        if recruiter_notes:
            application.recruiter_notes = recruiter_notes
        application.save()
        
        serializer = JobApplicationSerializer(application)
        
        return Response({
            'success': True,
            'message': 'Application status updated successfully',
            'application': serializer.data
        }, status=status.HTTP_200_OK)
        
    except JobApplication.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Application not found'
        }, status=status.HTTP_404_NOT_FOUND)


# ============================================================================
# CANDIDATE SEARCH & SAVED PROFILES - REAL DATA ONLY
# ============================================================================

from .models import SavedCandidate
from authentication.serializers import UserProfileSerializer


@api_view(['GET'])
@permission_classes([IsRecruiter])
def search_candidates_view(request):
    """
    Search real candidate users - NO DUMMY DATA
    STRICT DATA ISOLATION: Returns only real registered candidates
    """
    # Get all candidates (role='candidate')
    candidates = User.objects.filter(role='candidate', is_active=True)
    
    # Apply filters from query params
    keyword = request.GET.get('keyword', '').strip()
    location = request.GET.get('location', '').strip()
    experience = request.GET.get('experience', '').strip()
    skills = request.GET.get('skills', '').strip()
    
    # Keyword search (name, email, skills)
    if keyword:
        candidates = candidates.filter(
            models.Q(first_name__icontains=keyword) |
            models.Q(last_name__icontains=keyword) |
            models.Q(email__icontains=keyword)
        )
    
    # Location filter
    if location:
        candidates = candidates.filter(
            models.Q(city__icontains=location) |
            models.Q(state__icontains=location)
        )
    
    # Experience filter (if profile has experience field)
    if experience:
        # This would need to be implemented based on your User model fields
        pass
    
    # Skills filter (if profile has skills field)
    if skills:
        # This would need to be implemented based on your User model fields
        pass
    
    # Get saved candidate IDs for this recruiter
    saved_candidate_ids = SavedCandidate.objects.filter(
        recruiter=request.user
    ).values_list('candidate_id', flat=True)
    
    # Serialize candidates
    serializer = UserProfileSerializer(candidates, many=True)
    
    # Add is_saved flag to each candidate
    candidates_data = serializer.data
    for candidate in candidates_data:
        candidate['is_saved'] = candidate['id'] in saved_candidate_ids
    
    return Response({
        'success': True,
        'count': len(candidates_data),
        'candidates': candidates_data,
        'filters': {
            'keyword': keyword,
            'location': location,
            'experience': experience,
            'skills': skills
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsRecruiter])
def save_candidate_view(request):
    """
    Save a candidate profile
    STRICT DATA ISOLATION: Only saves for logged-in recruiter
    """
    candidate_id = request.data.get('candidate_id')
    
    if not candidate_id:
        return Response({
            'success': False,
            'message': 'Candidate ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Verify candidate exists and is a candidate
    try:
        candidate = User.objects.get(id=candidate_id, role='candidate')
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Candidate not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if already saved
    if SavedCandidate.objects.filter(recruiter=request.user, candidate=candidate).exists():
        return Response({
            'success': False,
            'message': 'Candidate already saved'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Save candidate
    saved_candidate = SavedCandidate.objects.create(
        recruiter=request.user,
        candidate=candidate
    )
    
    return Response({
        'success': True,
        'message': 'Candidate saved successfully',
        'saved_at': saved_candidate.saved_at
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsRecruiter])
def unsave_candidate_view(request, candidate_id):
    """
    Remove a saved candidate
    STRICT DATA ISOLATION: Only removes for logged-in recruiter
    """
    try:
        saved_candidate = SavedCandidate.objects.get(
            recruiter=request.user,
            candidate_id=candidate_id
        )
        saved_candidate.delete()
        
        return Response({
            'success': True,
            'message': 'Candidate removed from saved list'
        }, status=status.HTTP_200_OK)
        
    except SavedCandidate.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Saved candidate not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsRecruiter])
def saved_profiles_view(request):
    """
    Get all saved candidates for logged-in recruiter
    STRICT DATA ISOLATION: Only returns candidates saved by THIS recruiter
    """
    # Get saved candidates for this recruiter only
    saved_candidates = SavedCandidate.objects.filter(
        recruiter=request.user
    ).select_related('candidate').order_by('-saved_at')
    
    # Build response data
    profiles = []
    for saved in saved_candidates:
        candidate = saved.candidate
        profile_data = {
            'id': candidate.id,
            'name': candidate.full_name,
            'email': candidate.email,
            'phone': candidate.phone_number,
            'location': f"{candidate.city}, {candidate.state}" if candidate.city and candidate.state else '',
            'skills': [],  # Add from profile if available
            'experience': '',  # Add from profile if available
            'education': '',  # Add from profile if available
            'saved_at': saved.saved_at,
            'notes': saved.notes or '',
            'profile_photo': candidate.profile_photo.url if candidate.profile_photo else None
        }
        profiles.append(profile_data)
    
    return Response({
        'success': True,
        'count': len(profiles),
        'profiles': profiles
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsRecruiter])
def update_candidate_notes_view(request, candidate_id):
    """
    Update notes for a saved candidate
    STRICT DATA ISOLATION: Only updates for logged-in recruiter
    """
    notes = request.data.get('notes', '')
    
    try:
        saved_candidate = SavedCandidate.objects.get(
            recruiter=request.user,
            candidate_id=candidate_id
        )
        saved_candidate.notes = notes
        saved_candidate.save()
        
        return Response({
            'success': True,
            'message': 'Notes updated successfully'
        }, status=status.HTTP_200_OK)
        
    except SavedCandidate.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Saved candidate not found'
        }, status=status.HTTP_404_NOT_FOUND)
