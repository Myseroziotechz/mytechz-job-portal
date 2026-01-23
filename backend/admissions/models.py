from django.db import models
from authentication.models import User
import json

class CollegeApplication(models.Model):
    """
    College Application model - Stores student applications to colleges
    """
    
    # Status choices
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('waitlisted', 'Waitlisted'),
    ]
    
    # Primary Key and Foreign Key
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='college_applications'
    )
    
    # College Information (stored as JSON since it's from static data)
    college_name = models.CharField(max_length=300)
    college_data = models.TextField(help_text="JSON data of college details")
    
    # Personal Information
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20)
    
    # Address Details
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    
    # Educational Details
    qualification = models.CharField(max_length=100)
    percentage = models.CharField(max_length=50)
    course = models.CharField(max_length=100)
    branch = models.CharField(max_length=100, blank=True, null=True)
    
    # Additional Information
    message = models.TextField(blank=True, null=True)
    
    # Application Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'college_applications'
        verbose_name = 'College Application'
        verbose_name_plural = 'College Applications'
        ordering = ['-applied_at']
        unique_together = ['user', 'college_name']  # Prevent duplicate applications
    
    def __str__(self):
        return f"{self.full_name} → {self.college_name}"
    
    def get_college_data(self):
        """Return college data as dict"""
        try:
            return json.loads(self.college_data)
        except json.JSONDecodeError:
            return {}
    
    def set_college_data(self, data):
        """Set college data from dict"""
        self.college_data = json.dumps(data)
    
    @property
    def is_pending(self):
        """Check if application is pending"""
        return self.status == 'pending'
    
    @property
    def is_approved(self):
        """Check if application is approved"""
        return self.status == 'approved'
