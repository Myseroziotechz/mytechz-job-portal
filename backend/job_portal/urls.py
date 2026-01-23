"""
URL configuration for job_portal project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from recruiter import views as recruiter_views

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resume_info_view(request):
    """Resume upload info endpoint"""
    user = request.user
    return Response({
        'success': True,
        'resume': {
            'file_name': user.resume_file_name,
            'file_url': request.build_absolute_uri(user.resume_file_path.url) if user.resume_file_path else None,
            'uploaded_at': user.resume_uploaded_at
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/recruiter/', include('recruiter.urls')),
    path('api/admissions/', include('admissions.urls')),
    
    # Public job endpoints
    path('api/jobs/public', recruiter_views.public_jobs_view, name='public_jobs'),
    path('api/jobs/<int:job_id>', recruiter_views.job_detail_public_view, name='job_detail_public'),
    path('api/jobs/<int:job_id>/apply', recruiter_views.apply_job_view, name='apply_job'),
    path('api/jobs/<int:job_id>/check-status', recruiter_views.check_application_status_view, name='check_application_status'),
    
    path('api/resume-upload/info', resume_info_view, name='resume_info'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)