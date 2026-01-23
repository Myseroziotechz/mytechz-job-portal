from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CollegeApplication
from .serializers import (
    CollegeApplicationSerializer,
    CollegeApplicationCreateSerializer,
    CollegeApplicationUpdateSerializer
)
from authentication.models import User


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_to_college(request):
    """
    Submit college application
    """
    print("=" * 80)
    print("COLLEGE APPLICATION REQUEST")
    print("=" * 80)
    print(f"User: {request.user.email}")
    print(f"Request data: {request.data}")
    
    # Get college and application data from request
    college_data = request.data.get('college', {})
    application_data = request.data.get('applicationData', {})
    
    print(f"College data: {college_data}")
    print(f"Application data: {application_data}")
    
    if not college_data or not application_data:
        return Response({
            'success': False,
            'message': 'Missing college or application data'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Convert camelCase to snake_case
    field_mapping = {
        'fullName': 'full_name',
        'dateOfBirth': 'date_of_birth',
    }
    
    converted_data = {}
    for key, value in application_data.items():
        # Convert camelCase to snake_case
        snake_case_key = field_mapping.get(key, key)
        converted_data[snake_case_key] = value
    
    # Prepare data for serializer
    data = {
        **converted_data,
        'college_name': college_data.get('name', ''),
        'college_data': college_data
    }
    
    print(f"Prepared data for serializer: {data}")
    
    serializer = CollegeApplicationCreateSerializer(
        data=data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        application = serializer.save()
        response_serializer = CollegeApplicationSerializer(application)
        
        print(f"✅ Application created successfully: {application.id}")
        
        return Response({
            'success': True,
            'message': 'Application submitted successfully! Admin will review your application.',
            'application': response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    print(f"❌ Validation errors: {serializer.errors}")
    
    return Response({
        'success': False,
        'message': 'Failed to submit application',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    """
    Get all applications for the logged-in user
    """
    applications = CollegeApplication.objects.filter(
        user=request.user
    ).order_by('-applied_at')
    
    serializer = CollegeApplicationSerializer(applications, many=True)
    
    return Response({
        'success': True,
        'count': applications.count(),
        'applications': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_detail(request, application_id):
    """
    Get single application detail
    """
    try:
        application = CollegeApplication.objects.get(
            id=application_id,
            user=request.user
        )
        serializer = CollegeApplicationSerializer(application)
        
        return Response({
            'success': True,
            'application': serializer.data
        }, status=status.HTTP_200_OK)
    except CollegeApplication.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Application not found'
        }, status=status.HTTP_404_NOT_FOUND)


# ============================================================================
# ADMIN VIEWS
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_applications(request):
    """
    Admin view to get all college applications
    """
    # Check if user is admin
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'message': 'Access denied. Admin only.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get all applications
    applications = CollegeApplication.objects.all().select_related('user').order_by('-applied_at')
    
    # Optional filters
    status_filter = request.GET.get('status')
    college_filter = request.GET.get('college')
    
    if status_filter:
        applications = applications.filter(status=status_filter)
    if college_filter:
        applications = applications.filter(college_name__icontains=college_filter)
    
    serializer = CollegeApplicationSerializer(applications, many=True)
    
    return Response({
        'success': True,
        'count': applications.count(),
        'applications': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_application_detail(request, application_id):
    """
    Admin view to get single application detail
    """
    # Check if user is admin
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'message': 'Access denied. Admin only.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    application = get_object_or_404(CollegeApplication, id=application_id)
    serializer = CollegeApplicationSerializer(application)
    
    return Response({
        'success': True,
        'application': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_application_status(request, application_id):
    """
    Admin endpoint to update application status
    """
    # Check if user is admin
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'message': 'Access denied. Admin only.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    application = get_object_or_404(CollegeApplication, id=application_id)
    
    serializer = CollegeApplicationUpdateSerializer(
        application,
        data=request.data,
        partial=True
    )
    
    if serializer.is_valid():
        serializer.save()
        response_serializer = CollegeApplicationSerializer(application)
        
        return Response({
            'success': True,
            'message': 'Application status updated successfully',
            'application': response_serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Failed to update application status',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_application(request, application_id):
    """
    Admin endpoint to delete application
    """
    # Check if user is admin
    if request.user.role != 'admin':
        return Response({
            'success': False,
            'message': 'Access denied. Admin only.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    application = get_object_or_404(CollegeApplication, id=application_id)
    application_name = f"{application.full_name} → {application.college_name}"
    application.delete()
    
    return Response({
        'success': True,
        'message': f'Application "{application_name}" deleted successfully'
    }, status=status.HTTP_200_OK)
