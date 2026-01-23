from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('apply', views.apply_to_college, name='apply_to_college'),
    path('my-applications', views.my_applications, name='my_applications'),
    path('applications/<int:application_id>', views.application_detail, name='application_detail'),
    
    # Admin endpoints
    path('admin/applications', views.admin_all_applications, name='admin_all_applications'),
    path('admin/applications/<int:application_id>', views.admin_application_detail, name='admin_application_detail'),
    path('admin/applications/<int:application_id>/update-status', views.admin_update_application_status, name='admin_update_application_status'),
    path('admin/applications/<int:application_id>/delete', views.admin_delete_application, name='admin_delete_application'),
]
