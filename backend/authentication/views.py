from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    ResumeUploadSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new candidate or recruiter
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'success': True,
            'message': 'registered',  # Frontend expects this exact message
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'full_name': user.full_name,
                'role': user.role
            },
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh)
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'Registration failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def recruiter_register_view(request):
    """
    Register a new recruiter with company information
    """
    # Debug logging
    print("=" * 60)
    print("RECRUITER REGISTRATION REQUEST")
    print("=" * 60)
    print(f"Request data: {request.data}")
    print(f"Content-Type: {request.content_type}")
    
    # Validate required fields first
    required_fields = ['companyEmail', 'hrName', 'phone', 'password', 'confirmPassword']
    missing_fields = []
    
    for field in required_fields:
        if not request.data.get(field):
            missing_fields.append(field)
            print(f"Missing field: {field}")
    
    if missing_fields:
        error_response = {
            'success': False,
            'message': f'Missing required fields: {", ".join(missing_fields)}',
            'errors': {field: ['This field is required.'] for field in missing_fields}
        }
        print(f"Validation error: {error_response}")
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
    
    # Map frontend fields to backend fields
    hr_name = request.data.get('hrName', '').strip()
    name_parts = hr_name.split(' ') if hr_name else ['', '']
    
    # Handle single-word names
    first_name = name_parts[0] if len(name_parts) > 0 else ''
    last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else 'User'  # Default last name if not provided
    
    print(f"HR Name: '{hr_name}'")
    print(f"Split into - First: '{first_name}', Last: '{last_name}'")
    
    mapped_data = {
        'email': request.data.get('companyEmail', '').strip(),
        'firstName': first_name,
        'lastName': last_name,
        'phone': request.data.get('phone', '').strip(),
        'password': request.data.get('password'),
        'confirmPassword': request.data.get('confirmPassword'),
        'role': 'recruiter'
    }
    
    print(f"Mapped data: {mapped_data}")
    
    # Store company-specific data for later use
    company_data = {
        'company_name': request.data.get('companyName', '').strip(),
        'gst_cin': request.data.get('gstCin', '').strip(),
        'hr_role': request.data.get('hrRole', '').strip()
    }
    
    print(f"Company data: {company_data}")
    
    serializer = UserRegistrationSerializer(data=mapped_data)
    if serializer.is_valid():
        print("Serializer is valid, creating user...")
        user = serializer.save()
        
        # Store company data in user's bio temporarily (can be moved to company profile later)
        bio_parts = []
        if company_data.get('company_name'):
            bio_parts.append(f"Company: {company_data['company_name']}")
        if company_data.get('hr_role'):
            bio_parts.append(f"Role: {company_data['hr_role']}")
        if company_data.get('gst_cin'):
            bio_parts.append(f"GST/CIN: {company_data['gst_cin']}")
        
        user.bio = ', '.join(bio_parts) if bio_parts else 'Recruiter'
        user.save()
        
        print(f"User created successfully: {user.email}")
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'success': True,
            'message': 'registered',  # Frontend expects this exact message
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'full_name': user.full_name,
                'role': user.role,
                'company_name': company_data.get('company_name'),
                'hr_role': company_data.get('hr_role'),
                'approval_status': user.approval_status,
                'profile_completed': user.profile_completed
            },
            'tokens': {
                'access': str(access_token),
                'refresh': str(refresh)
            }
        }, status=status.HTTP_201_CREATED)
    
    # Return detailed error information
    print(f"Serializer errors: {serializer.errors}")
    error_response = {
        'success': False,
        'message': 'Registration failed. Please check the following errors:',
        'errors': serializer.errors
    }
    print(f"Returning error response: {error_response}")
    return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login candidate or recruiter
    """
    # Extract email, password, and role
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'candidate')  # Default to candidate
    
    login_data = {
        'email': email,
        'password': password
    }
    
    serializer = UserLoginSerializer(data=login_data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Check if user role matches requested role
        if user.role != role:
            return Response({
                'success': False,
                'message': f'Invalid credentials for {role} login',
                'errors': {'role': [f'User is not registered as a {role}']}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Format response based on role
        if role == 'recruiter':
            return Response({
                'success': True,
                'message': 'Login successful',
                'token': str(access_token),
                'user': {
                    'id': user.id,
                    'name': user.full_name,
                    'email': user.email,
                    'role': user.role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone': user.phone,
                    'company': getattr(user, 'company', 'Demo Company'),  # Placeholder
                    'profilePhoto': None
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_200_OK)
        else:
            # Candidate response (existing format)
            return Response({
                'success': True,
                'message': 'Login successful',
                'token': str(access_token),
                'user': {
                    'id': user.id,
                    'name': user.full_name,
                    'email': user.email,
                    'role': user.role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone': user.phone,
                    'profilePhoto': None
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Login failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout candidate (blacklist refresh token)
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'success': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Logout failed',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    Get or update candidate profile
    """
    if request.method == 'GET':
        serializer = UserProfileSerializer(request.user)
        # Return profile data directly (not wrapped in 'user' key)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = UserProfileUpdateSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        
        if serializer.is_valid():
            user = serializer.save()
            profile_serializer = UserProfileSerializer(user)
            
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'user': profile_serializer.data
            }, status=status.HTTP_200_OK)
        
        # Return detailed error information
        return Response({
            'success': False,
            'message': 'Profile update failed',
            'errors': serializer.errors,
            'details': 'Please check the form data and try again'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_update_view(request):
    """
    Update candidate profile
    """
    serializer = UserProfileUpdateSerializer(
        request.user, 
        data=request.data, 
        partial=request.method == 'PATCH'
    )
    
    if serializer.is_valid():
        user = serializer.save()
        profile_serializer = UserProfileSerializer(user)
        
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': profile_serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Profile update failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_resume_view(request):
    """
    Upload candidate resume
    """
    serializer = ResumeUploadSerializer(
        request.user,
        data=request.data,
        partial=True
    )
    
    if serializer.is_valid():
        user = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Resume uploaded successfully',
            'resume': {
                'file_name': user.resume_file_name,
                'file_url': request.build_absolute_uri(user.resume_file_path.url) if user.resume_file_path else None,
                'uploaded_at': user.resume_uploaded_at
            }
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Resume upload failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats_view(request):
    """
    Get user statistics (for dashboard)
    """
    user = request.user
    
    if user.role == 'recruiter':
        # Recruiter dashboard stats
        total_candidates = User.objects.filter(role='candidate').count()
        
        return Response({
            'success': True,
            'stats': {
                'total_candidates': total_candidates,
                'active_jobs': 0,  # Placeholder
                'applications_received': 0,  # Placeholder
                'interviews_scheduled': 0,  # Placeholder
                'member_since': user.created_at.strftime('%B %Y')
            }
        }, status=status.HTTP_200_OK)
    else:
        # Candidate dashboard stats (existing logic)
        profile_fields = [
            user.first_name, user.last_name, user.phone, user.email,
            user.date_of_birth, user.gender, user.address, user.city, 
            user.state, user.pincode, user.bio, user.skills, 
            user.experience, user.education, user.linkedin_url,
            user.github_url, user.portfolio_url, user.resume_file_path
        ]
        
        completed_fields = sum(1 for field in profile_fields if field)
        completion_percentage = (completed_fields / len(profile_fields)) * 100
        
        return Response({
            'success': True,
            'stats': {
                'profile_completion': round(completion_percentage, 1),
                'resume_uploaded': bool(user.resume_file_path),
                'skills_count': len(user.get_skills_list()),
                'social_links_added': sum([
                    bool(user.linkedin_url),
                    bool(user.github_url),
                    bool(user.portfolio_url)
                ]),
                'member_since': user.created_at.strftime('%B %Y')
            }
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def candidates_list_view(request):
    """
    Get list of candidates (for recruiters only)
    """
    if request.user.role != 'recruiter':
        return Response({
            'success': False,
            'message': 'Access denied. Recruiter role required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get all candidates
    candidates = User.objects.filter(role='candidate').values(
        'id', 'first_name', 'last_name', 'email', 'phone',
        'skills', 'experience', 'city', 'state',
        'linkedin_url', 'github_url', 'portfolio_url',
        'created_at'
    )
    
    # Format candidates data
    candidates_data = []
    for candidate in candidates:
        candidates_data.append({
            'id': candidate['id'],
            'name': f"{candidate['first_name']} {candidate['last_name']}",
            'email': candidate['email'],
            'phone': candidate['phone'],
            'location': f"{candidate['city']}, {candidate['state']}" if candidate['city'] and candidate['state'] else 'Not specified',
            'skills': candidate['skills'].split(',') if candidate['skills'] else [],
            'experience': candidate['experience'][:100] + '...' if candidate['experience'] and len(candidate['experience']) > 100 else candidate['experience'],
            'social_links': {
                'linkedin': candidate['linkedin_url'],
                'github': candidate['github_url'],
                'portfolio': candidate['portfolio_url']
            },
            'joined_date': candidate['created_at'].strftime('%Y-%m-%d')
        })
    
    return Response({
        'success': True,
        'candidates': candidates_data,
        'total': len(candidates_data)
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications_view(request):
    """
    Get user's job applications (placeholder for now)
    """
    return Response({
        'success': True,
        'applications': [],
        'total': 0,
        'message': 'No applications found'
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_photo_view(request):
    """
    Upload user profile photo (placeholder for now)
    """
    return Response({
        'success': True,
        'message': 'Photo upload feature coming soon',
        'photo_url': None
    }, status=status.HTTP_200_OK)