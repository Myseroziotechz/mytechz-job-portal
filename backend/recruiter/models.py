from django.db import models
from django.core.validators import URLValidator, MinValueValidator, MaxValueValidator
from authentication.models import User
import json

class RecruiterCompanyProfile(models.Model):
    """
    Company Profile model for Recruiters
    Each recruiter can have only one company profile
    """
    
    # Primary Key and Foreign Key
    id = models.AutoField(primary_key=True)
    recruiter = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 'recruiter'},
        related_name='company_profile'
    )
    
    # Company Information
    company_name = models.CharField(max_length=200)
    website = models.URLField(validators=[URLValidator()], blank=True, null=True)
    industry = models.CharField(max_length=100)
    
    COMPANY_SIZE_CHOICES = [
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('501-1000', '501-1000 employees'),
        ('1000+', '1000+ employees'),
    ]
    company_size = models.CharField(max_length=20, choices=COMPANY_SIZE_CHOICES)
    
    founded_year = models.IntegerField(
        validators=[MinValueValidator(1800), MaxValueValidator(2030)],
        blank=True, 
        null=True
    )
    head_office_location = models.CharField(max_length=200)
    
    # Legal & Verification
    gst_cin = models.CharField(max_length=50, blank=True, null=True, help_text="GST or CIN number")
    company_registration_document = models.FileField(
        upload_to='company_documents/', 
        blank=True, 
        null=True,
        help_text="Upload company registration certificate"
    )
    
    VERIFICATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    verification_status = models.CharField(
        max_length=20, 
        choices=VERIFICATION_STATUS_CHOICES, 
        default='pending'
    )
    verification_notes = models.TextField(blank=True, null=True, help_text="Admin notes for verification")
    
    # About Company
    company_description = models.TextField(help_text="Describe your company")
    mission_and_culture = models.TextField(blank=True, null=True)
    benefits_and_perks = models.TextField(
        blank=True, 
        null=True, 
        help_text="Comma-separated benefits and perks"
    )
    
    # Office & Work Mode
    office_address = models.TextField()
    
    WORK_MODE_CHOICES = [
        ('office', 'Office'),
        ('hybrid', 'Hybrid'),
        ('remote', 'Remote'),
    ]
    work_mode = models.CharField(max_length=20, choices=WORK_MODE_CHOICES)
    
    office_photos = models.TextField(
        blank=True, 
        null=True, 
        help_text="JSON array of office photo file paths"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recruiter_company_profile'
        verbose_name = 'Company Profile'
        verbose_name_plural = 'Company Profiles'
    
    def __str__(self):
        return f"{self.company_name} - {self.recruiter.full_name}"
    
    @property
    def is_verified(self):
        """Check if company is verified"""
        return self.verification_status == 'verified'
    
    def get_benefits_list(self):
        """Return benefits as a list"""
        if self.benefits_and_perks:
            return [benefit.strip() for benefit in self.benefits_and_perks.split(',')]
        return []
    
    def set_benefits_list(self, benefits_list):
        """Set benefits from a list"""
        if benefits_list:
            self.benefits_and_perks = ', '.join(benefits_list)
        else:
            self.benefits_and_perks = ''
    
    def get_office_photos_list(self):
        """Return office photos as a list"""
        if self.office_photos:
            try:
                return json.loads(self.office_photos)
            except json.JSONDecodeError:
                return []
        return []
    
    def set_office_photos_list(self, photos_list):
        """Set office photos from a list"""
        if photos_list:
            self.office_photos = json.dumps(photos_list)
        else:
            self.office_photos = ''
    
    def can_post_jobs(self):
        """Check if recruiter can post jobs (must be verified)"""
        return self.verification_status == 'verified'
    
    def save(self, *args, **kwargs):
        """Override save to mark recruiter profile as completed"""
        super().save(*args, **kwargs)
        # Mark recruiter profile as completed when company profile is saved
        if self.recruiter.role == 'recruiter':
            self.recruiter.mark_profile_completed()


class JobPost(models.Model):
    """
    Job Posting model - Fresh implementation
    """
    
    # Primary Key and Foreign Key
    id = models.AutoField(primary_key=True)
    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'recruiter'},
        related_name='job_posts'
    )
    
    # Basic Job Details
    job_title = models.CharField(max_length=200)
    department = models.CharField(max_length=100, blank=True, null=True)
    
    JOB_TYPE_CHOICES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
        ('Freelance', 'Freelance'),
        ('Internship', 'Internship'),
    ]
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    
    WORK_MODE_CHOICES = [
        ('Remote', 'Remote'),
        ('On-site', 'On-site'),
        ('Hybrid', 'Hybrid'),
    ]
    work_mode = models.CharField(max_length=20, choices=WORK_MODE_CHOICES)
    
    experience_level = models.CharField(max_length=50)
    location = models.CharField(max_length=200)
    
    # Salary
    min_salary = models.IntegerField(blank=True, null=True)
    max_salary = models.IntegerField(blank=True, null=True)
    currency = models.CharField(max_length=10, default='INR')
    salary_period = models.CharField(max_length=20, default='annually')
    
    # Job Description
    job_description = models.TextField()
    key_responsibilities = models.TextField(blank=True, null=True, help_text="JSON array")
    benefits_and_perks = models.TextField(blank=True, null=True, help_text="JSON array")
    
    # Requirements
    requirements = models.TextField(blank=True, null=True, help_text="JSON array")
    required_skills = models.TextField(blank=True, null=True, help_text="JSON array")
    
    # Application Settings
    application_deadline = models.DateField(blank=True, null=True)
    
    APPLY_METHOD_CHOICES = [
        ('platform', 'Platform'),
        ('external', 'External'),
        ('email', 'Email'),
    ]
    apply_method = models.CharField(max_length=20, choices=APPLY_METHOD_CHOICES, default='platform')
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'job_posts'
        verbose_name = 'Job Post'
        verbose_name_plural = 'Job Posts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.job_title} - {self.recruiter.full_name}"
    
    def get_key_responsibilities(self):
        """Return key responsibilities as list"""
        if self.key_responsibilities:
            try:
                return json.loads(self.key_responsibilities)
            except json.JSONDecodeError:
                return []
        return []
    
    def set_key_responsibilities(self, responsibilities_list):
        """Set key responsibilities from list"""
        if responsibilities_list:
            self.key_responsibilities = json.dumps(responsibilities_list)
        else:
            self.key_responsibilities = ''
    
    def get_benefits(self):
        """Return benefits as list"""
        if self.benefits_and_perks:
            try:
                return json.loads(self.benefits_and_perks)
            except json.JSONDecodeError:
                return []
        return []
    
    def set_benefits(self, benefits_list):
        """Set benefits from list"""
        if benefits_list:
            self.benefits_and_perks = json.dumps(benefits_list)
        else:
            self.benefits_and_perks = ''
    
    def get_requirements(self):
        """Return requirements as list"""
        if self.requirements:
            try:
                return json.loads(self.requirements)
            except json.JSONDecodeError:
                return []
        return []
    
    def set_requirements(self, requirements_list):
        """Set requirements from list"""
        if requirements_list:
            self.requirements = json.dumps(requirements_list)
        else:
            self.requirements = ''
    
    def get_required_skills(self):
        """Return required skills as list"""
        if self.required_skills:
            try:
                return json.loads(self.required_skills)
            except json.JSONDecodeError:
                return []
        return []
    
    def set_required_skills(self, skills_list):
        """Set required skills from list"""
        if skills_list:
            self.required_skills = json.dumps(skills_list)
        else:
            self.required_skills = ''
    
    def save(self, *args, **kwargs):
        """Override save to enforce company profile check"""
        # Security check: Only recruiters with company profile can create/update jobs
        if not self.recruiter.can_post_jobs():
            from django.core.exceptions import PermissionDenied
            raise PermissionDenied(
                f"Recruiter {self.recruiter.email} must complete company profile before posting jobs."
            )
        super().save(*args, **kwargs)


class JobApplication(models.Model):
    """
    Job Application model - Tracks candidate applications
    """
    
    # Primary Key and Foreign Keys
    id = models.AutoField(primary_key=True)
    job = models.ForeignKey(
        JobPost,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    candidate = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'candidate'},
        related_name='job_applications'
    )
    
    # Application Status
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
        ('withdrawn', 'Withdrawn'),
    ]
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='applied')
    
    # Cover Letter (optional)
    cover_letter = models.TextField(blank=True, null=True)
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Recruiter Notes
    recruiter_notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'job_applications'
        verbose_name = 'Job Application'
        verbose_name_plural = 'Job Applications'
        ordering = ['-applied_at']
        unique_together = ['job', 'candidate']  # Prevent duplicate applications
    
    def __str__(self):
        return f"{self.candidate.full_name} → {self.job.job_title}"
    
    @property
    def is_active(self):
        """Check if application is still active"""
        return self.status not in ['rejected', 'withdrawn', 'accepted']
