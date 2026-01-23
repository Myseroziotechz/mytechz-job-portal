from rest_framework import permissions

class IsRecruiter(permissions.BasePermission):
    """
    Custom permission to only allow recruiters to access recruiter endpoints.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'recruiter'
        )

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins to access admin endpoints.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'admin' or request.user.is_superuser)
        )

class IsRecruiterOwner(permissions.BasePermission):
    """
    Custom permission to only allow recruiters to access their own company profile.
    """
    
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the company profile
        return obj.recruiter == request.user