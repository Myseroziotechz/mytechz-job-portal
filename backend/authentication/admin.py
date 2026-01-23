from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model"""
    
    list_display = ['email', 'first_name', 'last_name', 'role', 'profile_completed', 'approval_status', 'is_active', 'created_at']
    list_filter = ['is_active', 'role', 'approval_status', 'profile_completed', 'gender', 'created_at', 'resume_uploaded_at']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone', 'date_of_birth', 'gender')
        }),
        ('Role & Approval', {
            'fields': ('role', 'profile_completed', 'approval_status', 'approved_at'),
            'description': 'Recruiter approval workflow fields'
        }),
        ('Address', {
            'fields': ('address', 'city', 'state', 'pincode'),
            'classes': ('collapse',)
        }),
        ('Professional Info', {
            'fields': ('bio', 'skills', 'experience', 'education'),
            'classes': ('collapse',)
        }),
        ('Social Links', {
            'fields': ('linkedin_url', 'github_url', 'portfolio_url'),
            'classes': ('collapse',)
        }),
        ('Resume', {
            'fields': ('resume_file_name', 'resume_file_path', 'resume_uploaded_at'),
            'classes': ('collapse',)
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important dates', {
            'fields': ('last_login', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login', 'approved_at']
    
    actions = ['approve_recruiters', 'reject_recruiters']
    
    def approve_recruiters(self, request, queryset):
        """Admin action to approve selected recruiters"""
        approved_count = 0
        for user in queryset.filter(role='recruiter'):
            user.approve_recruiter()
            approved_count += 1
        
        self.message_user(request, f'{approved_count} recruiters approved successfully.')
    approve_recruiters.short_description = "Approve selected recruiters"
    
    def reject_recruiters(self, request, queryset):
        """Admin action to reject selected recruiters"""
        rejected_count = 0
        for user in queryset.filter(role='recruiter'):
            user.reject_recruiter()
            rejected_count += 1
        
        self.message_user(request, f'{rejected_count} recruiters rejected.')
    reject_recruiters.short_description = "Reject selected recruiters"