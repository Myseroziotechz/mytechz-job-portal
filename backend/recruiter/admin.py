from django.contrib import admin
from django.utils.html import format_html
from .models import RecruiterCompanyProfile

@admin.register(RecruiterCompanyProfile)
class RecruiterCompanyProfileAdmin(admin.ModelAdmin):
    list_display = [
        'company_name', 
        'recruiter_name', 
        'recruiter_approval_status',
        'industry', 
        'company_size', 
        'verification_status', 
        'can_post_jobs_display',
        'created_at'
    ]
    list_filter = [
        'verification_status', 
        'recruiter__approval_status',
        'industry', 
        'company_size', 
        'work_mode',
        'created_at'
    ]
    search_fields = [
        'company_name', 
        'recruiter__first_name', 
        'recruiter__last_name', 
        'recruiter__email',
        'industry'
    ]
    readonly_fields = ['created_at', 'updated_at']
    actions = ['verify_companies', 'reject_companies', 'approve_recruiters']
    
    fieldsets = (
        ('Recruiter Information', {
            'fields': (
                'recruiter',
                'recruiter_approval_info',
            )
        }),
        ('Company Information', {
            'fields': (
                'company_name',
                'website',
                'industry',
                'company_size',
                'founded_year',
                'head_office_location'
            )
        }),
        ('Legal & Verification', {
            'fields': (
                'gst_cin',
                'company_registration_document',
                'verification_status',
                'verification_notes'
            )
        }),
        ('About Company', {
            'fields': (
                'company_description',
                'mission_and_culture',
                'benefits_and_perks'
            )
        }),
        ('Office & Work Mode', {
            'fields': (
                'office_address',
                'work_mode',
                'office_photos'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def recruiter_name(self, obj):
        return obj.recruiter.full_name
    recruiter_name.short_description = 'Recruiter'
    
    def recruiter_approval_status(self, obj):
        status = obj.recruiter.approval_status
        colors = {
            'pending': 'orange',
            'approved': 'green',
            'rejected': 'red'
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(status, 'black'),
            status.title()
        )
    recruiter_approval_status.short_description = 'Recruiter Status'
    
    def can_post_jobs_display(self, obj):
        can_post = obj.recruiter.can_post_jobs()
        return format_html(
            '<span style="color: {};">{}</span>',
            'green' if can_post else 'red',
            'Yes' if can_post else 'No'
        )
    can_post_jobs_display.short_description = 'Can Post Jobs'
    
    def recruiter_approval_info(self, obj):
        """Display recruiter approval information"""
        if obj.recruiter:
            return format_html(
                '<strong>Status:</strong> {} <br>'
                '<strong>Profile Completed:</strong> {} <br>'
                '<strong>Approved At:</strong> {}',
                obj.recruiter.approval_status.title(),
                'Yes' if obj.recruiter.profile_completed else 'No',
                obj.recruiter.approved_at.strftime('%Y-%m-%d %H:%M') if obj.recruiter.approved_at else 'Not approved'
            )
        return 'No recruiter linked'
    recruiter_approval_info.short_description = 'Recruiter Approval Info'
    
    def verify_companies(self, request, queryset):
        """Admin action to verify selected company profiles"""
        updated = queryset.update(verification_status='verified')
        self.message_user(request, f'{updated} company profiles verified successfully.')
    verify_companies.short_description = "Verify selected company profiles"
    
    def reject_companies(self, request, queryset):
        """Admin action to reject selected company profiles"""
        updated = queryset.update(verification_status='rejected')
        self.message_user(request, f'{updated} company profiles rejected.')
    reject_companies.short_description = "Reject selected company profiles"
    
    def approve_recruiters(self, request, queryset):
        """Admin action to approve recruiters associated with selected company profiles"""
        approved_count = 0
        for profile in queryset:
            if profile.recruiter.profile_completed and profile.recruiter.approval_status == 'pending':
                profile.recruiter.approve_recruiter()
                profile.verification_status = 'verified'
                profile.save()
                approved_count += 1
        
        self.message_user(request, f'{approved_count} recruiters approved and company profiles verified.')
    approve_recruiters.short_description = "Approve recruiters and verify their company profiles"
    
    def has_add_permission(self, request):
        # Only allow adding through API
        return False
    
    def has_change_permission(self, request, obj=None):
        # Allow admin to change verification status
        return request.user.is_superuser or request.user.is_staff
    
    def has_delete_permission(self, request, obj=None):
        # Only superuser can delete
        return request.user.is_superuser