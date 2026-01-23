from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
import json
from .models import CollegeApplication

@admin.register(CollegeApplication)
class CollegeApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'full_name', 
        'email', 
        'phone', 
        'college_name', 
        'course', 
        'colored_status', 
        'applied_at'
    ]
    list_filter = ['status', 'course', 'qualification', 'gender', 'applied_at']
    search_fields = ['full_name', 'email', 'college_name', 'phone', 'city', 'state']
    readonly_fields = [
        'applied_at', 
        'updated_at', 
        'user', 
        'formatted_college_data',
        'application_summary'
    ]
    list_per_page = 20
    date_hierarchy = 'applied_at'
    
    fieldsets = (
        ('📊 Application Summary', {
            'fields': ('application_summary',),
            'classes': ('wide',),
            'description': 'Quick overview of the application'
        }),
        ('✅ Application Status', {
            'fields': ('status', 'admin_notes'),
            'classes': ('wide',)
        }),
        ('👤 User Account', {
            'fields': ('user',),
            'classes': ('collapse',)
        }),
        ('🎓 College Information', {
            'fields': ('college_name', 'course', 'branch', 'formatted_college_data'),
            'classes': ('wide',)
        }),
        ('📝 Personal Information', {
            'fields': ('full_name', 'email', 'phone', 'date_of_birth', 'gender'),
            'classes': ('wide',)
        }),
        ('📍 Address Details', {
            'fields': ('address', 'city', 'state', 'pincode'),
            'classes': ('wide',)
        }),
        ('📚 Educational Details', {
            'fields': ('qualification', 'percentage'),
            'classes': ('wide',)
        }),
        ('💬 Additional Information', {
            'fields': ('message',),
            'classes': ('wide',)
        }),
        ('🕐 Timestamps', {
            'fields': ('applied_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')
    
    def colored_status(self, obj):
        """Display status with color coding"""
        colors = {
            'pending': '#FFA500',      # Orange
            'under_review': '#2196F3', # Blue
            'approved': '#4CAF50',     # Green
            'rejected': '#F44336',     # Red
            'waitlisted': '#9C27B0',   # Purple
        }
        color = colors.get(obj.status, '#666666')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    colored_status.short_description = 'Status'
    colored_status.admin_order_field = 'status'
    
    def application_summary(self, obj):
        """Display a formatted summary of the application"""
        html = f"""
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; font-family: Arial, sans-serif;">
            <h2 style="margin-top: 0; color: #333;">📋 Application Summary</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                <div>
                    <h3 style="color: #2196F3; margin-bottom: 10px;">👤 Personal Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 5px; font-weight: bold;">Name:</td><td style="padding: 5px;">{obj.full_name}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Email:</td><td style="padding: 5px;">{obj.email}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Phone:</td><td style="padding: 5px;">{obj.phone}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">DOB:</td><td style="padding: 5px;">{obj.date_of_birth}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Gender:</td><td style="padding: 5px;">{obj.gender}</td></tr>
                    </table>
                </div>
                
                <div>
                    <h3 style="color: #4CAF50; margin-bottom: 10px;">🎓 College & Course</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 5px; font-weight: bold;">College:</td><td style="padding: 5px;">{obj.college_name}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Course:</td><td style="padding: 5px;">{obj.course}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Branch:</td><td style="padding: 5px;">{obj.branch or 'N/A'}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Qualification:</td><td style="padding: 5px;">{obj.qualification}</td></tr>
                        <tr><td style="padding: 5px; font-weight: bold;">Percentage:</td><td style="padding: 5px;">{obj.percentage}</td></tr>
                    </table>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <h3 style="color: #FF9800; margin-bottom: 10px;">📍 Address</h3>
                <p style="margin: 5px 0;"><strong>Full Address:</strong> {obj.address}</p>
                <p style="margin: 5px 0;"><strong>City:</strong> {obj.city}, <strong>State:</strong> {obj.state}, <strong>Pincode:</strong> {obj.pincode}</p>
            </div>
            
            {f'<div style="margin-top: 20px;"><h3 style="color: #9C27B0; margin-bottom: 10px;">💬 Message</h3><p style="background: white; padding: 10px; border-radius: 3px;">{obj.message}</p></div>' if obj.message else ''}
            
            <div style="margin-top: 20px;">
                <h3 style="color: #666; margin-bottom: 10px;">🕐 Timeline</h3>
                <p style="margin: 5px 0;"><strong>Applied:</strong> {obj.applied_at.strftime('%B %d, %Y at %I:%M %p')}</p>
                <p style="margin: 5px 0;"><strong>Last Updated:</strong> {obj.updated_at.strftime('%B %d, %Y at %I:%M %p')}</p>
            </div>
        </div>
        """
        return mark_safe(html)
    application_summary.short_description = 'Application Summary'
    
    def formatted_college_data(self, obj):
        """Display formatted college data from JSON"""
        try:
            data = json.loads(obj.college_data)
            html = '<div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace;">'
            html += '<h4 style="margin-top: 0;">College Details:</h4>'
            html += '<table style="width: 100%; border-collapse: collapse;">'
            
            for key, value in data.items():
                if isinstance(value, list):
                    value = ', '.join(str(v) for v in value)
                html += f'<tr><td style="padding: 5px; font-weight: bold; vertical-align: top;">{key}:</td><td style="padding: 5px;">{value}</td></tr>'
            
            html += '</table></div>'
            return mark_safe(html)
        except (json.JSONDecodeError, Exception) as e:
            return f"Error parsing college data: {str(e)}"
    formatted_college_data.short_description = 'College Details (Formatted)'
    
    # Add actions for bulk status updates
    actions = ['mark_as_approved', 'mark_as_rejected', 'mark_as_under_review']
    
    def mark_as_approved(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'✅ {updated} application(s) marked as approved.')
    mark_as_approved.short_description = '✅ Mark selected as Approved'
    
    def mark_as_rejected(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'❌ {updated} application(s) marked as rejected.')
    mark_as_rejected.short_description = '❌ Mark selected as Rejected'
    
    def mark_as_under_review(self, request, queryset):
        updated = queryset.update(status='under_review')
        self.message_user(request, f'🔍 {updated} application(s) marked as under review.')
    mark_as_under_review.short_description = '🔍 Mark selected as Under Review'
