from rest_framework import serializers
from django.core.validators import URLValidator
from .models import RecruiterCompanyProfile, JobPost, JobApplication
from authentication.models import User
from datetime import datetime
import json

class RecruiterCompanyProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Recruiter Company Profile (GET requests)
    """
    recruiter_name = serializers.CharField(source='recruiter.full_name', read_only=True)
    recruiter_email = serializers.CharField(source='recruiter.email', read_only=True)
    benefits_list = serializers.SerializerMethodField()
    office_photos_list = serializers.SerializerMethodField()
    can_post_jobs = serializers.SerializerMethodField()
    
    class Meta:
        model = RecruiterCompanyProfile
        fields = [
            'id', 'recruiter_name', 'recruiter_email',
            # Company Information
            'company_name', 'website', 'industry', 'company_size', 
            'founded_year', 'head_office_location',
            # Legal & Verification
            'gst_cin', 'company_registration_document', 'verification_status', 'verification_notes',
            # About Company
            'company_description', 'mission_and_culture', 'benefits_and_perks', 'benefits_list',
            # Office & Work Mode
            'office_address', 'work_mode', 'office_photos', 'office_photos_list',
            # Status
            'can_post_jobs',
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'recruiter_name', 'recruiter_email', 'created_at', 'updated_at', 'can_post_jobs']
    
    def get_benefits_list(self, obj):
        """Return benefits as array"""
        return obj.get_benefits_list()
    
    def get_office_photos_list(self, obj):
        """Return office photos as array"""
        return obj.get_office_photos_list()
    
    def get_can_post_jobs(self, obj):
        """Return whether recruiter can post jobs"""
        return obj.can_post_jobs()

class RecruiterCompanyProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for Recruiter Company Profile (POST/PUT requests)
    """
    benefits_list = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True
    )
    office_photos_list = serializers.ListField(
        child=serializers.CharField(max_length=500),
        required=False,
        allow_empty=True
    )
    
    class Meta:
        model = RecruiterCompanyProfile
        fields = [
            # Company Information
            'company_name', 'website', 'industry', 'company_size', 
            'founded_year', 'head_office_location',
            # Legal & Verification (recruiter can't change verification_status)
            'gst_cin', 'company_registration_document',
            # About Company
            'company_description', 'mission_and_culture', 'benefits_and_perks', 'benefits_list',
            # Office & Work Mode
            'office_address', 'work_mode', 'office_photos', 'office_photos_list',
        ]
    
    def validate_website(self, value):
        """Validate website URL"""
        if value:
            validator = URLValidator()
            try:
                validator(value)
            except serializers.ValidationError:
                raise serializers.ValidationError("Please enter a valid website URL.")
        return value
    
    def validate_founded_year(self, value):
        """Validate founded year"""
        if value:
            current_year = datetime.now().year
            if value < 1800 or value > current_year:
                raise serializers.ValidationError(f"Founded year must be between 1800 and {current_year}.")
        return value
    
    def validate_gst_cin(self, value):
        """Basic GST/CIN validation"""
        if value:
            value = value.upper().strip()
            # Basic format validation (can be enhanced)
            if len(value) < 10:
                raise serializers.ValidationError("GST/CIN must be at least 10 characters long.")
        return value
    
    def create(self, validated_data):
        """Create new company profile"""
        # Handle benefits list
        benefits_list = validated_data.pop('benefits_list', None)
        office_photos_list = validated_data.pop('office_photos_list', None)
        
        # SECURITY: Get recruiter from request context (JWT token)
        recruiter = self.context['request'].user
        
        # SECURITY: Verify recruiter role
        if recruiter.role != 'recruiter':
            raise serializers.ValidationError("Only recruiters can create company profiles.")
        
        # SECURITY: Check if profile already exists
        if RecruiterCompanyProfile.objects.filter(recruiter=recruiter).exists():
            raise serializers.ValidationError("Company profile already exists for this recruiter.")
        
        # SECURITY: Force recruiter to be the logged-in user
        validated_data['recruiter'] = recruiter
        
        # Create profile
        profile = RecruiterCompanyProfile.objects.create(**validated_data)
        
        # Set benefits and photos
        if benefits_list is not None:
            profile.set_benefits_list(benefits_list)
        if office_photos_list is not None:
            profile.set_office_photos_list(office_photos_list)
        
        profile.save()
        return profile
    
    def update(self, instance, validated_data):
        """Update existing company profile"""
        # SECURITY: Verify ownership
        recruiter = self.context['request'].user
        if instance.recruiter.id != recruiter.id:
            raise serializers.ValidationError("Cannot update another recruiter's profile.")
        
        # SECURITY: Remove recruiter from validated_data if present (prevent ownership change)
        validated_data.pop('recruiter', None)
        
        # Handle benefits list
        benefits_list = validated_data.pop('benefits_list', None)
        office_photos_list = validated_data.pop('office_photos_list', None)
        
        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Set benefits and photos
        if benefits_list is not None:
            instance.set_benefits_list(benefits_list)
        if office_photos_list is not None:
            instance.set_office_photos_list(office_photos_list)
        
        instance.save()
        return instance

class AdminCompanyProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Admin to view and verify company profiles
    """
    recruiter_name = serializers.CharField(source='recruiter.full_name', read_only=True)
    recruiter_email = serializers.CharField(source='recruiter.email', read_only=True)
    recruiter_phone = serializers.CharField(source='recruiter.phone', read_only=True)
    benefits_list = serializers.SerializerMethodField()
    office_photos_list = serializers.SerializerMethodField()
    
    class Meta:
        model = RecruiterCompanyProfile
        fields = '__all__'
        read_only_fields = ['id', 'recruiter', 'created_at', 'updated_at']
    
    def get_benefits_list(self, obj):
        """Return benefits as array"""
        return obj.get_benefits_list()
    
    def get_office_photos_list(self, obj):
        """Return office photos as array"""
        return obj.get_office_photos_list()

class CompanyVerificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Admin to update verification status
    """
    class Meta:
        model = RecruiterCompanyProfile
        fields = ['verification_status', 'verification_notes']
    
    def validate_verification_status(self, value):
        """Validate verification status"""
        if value not in ['pending', 'verified', 'rejected']:
            raise serializers.ValidationError("Invalid verification status.")
        return value

class RecruiterApprovalSerializer(serializers.ModelSerializer):
    """
    Serializer for Admin to approve/reject recruiters
    """
    recruiter_name = serializers.CharField(source='full_name', read_only=True)
    company_profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'recruiter_name', 'email', 'phone', 'role',
            'profile_completed', 'approval_status', 'approved_at',
            'company_profile', 'created_at'
        ]
        read_only_fields = ['id', 'recruiter_name', 'email', 'phone', 'role', 'created_at']
    
    def get_company_profile(self, obj):
        """Get company profile data if exists"""
        try:
            profile = obj.company_profile
            return {
                'id': profile.id,
                'company_name': profile.company_name,
                'industry': profile.industry,
                'verification_status': profile.verification_status,
                'created_at': profile.created_at
            }
        except RecruiterCompanyProfile.DoesNotExist:
            return None

class RecruiterListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing recruiters (admin view)
    """
    recruiter_name = serializers.CharField(source='full_name', read_only=True)
    company_name = serializers.SerializerMethodField()
    company_verification_status = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'recruiter_name', 'email', 'phone',
            'profile_completed', 'approval_status', 'approved_at',
            'company_name', 'company_verification_status', 'created_at'
        ]
    
    def get_company_name(self, obj):
        """Get company name if profile exists"""
        try:
            return obj.company_profile.company_name
        except RecruiterCompanyProfile.DoesNotExist:
            return None
    
    def get_company_verification_status(self, obj):
        """Get company verification status if profile exists"""
        try:
            return obj.company_profile.verification_status
        except RecruiterCompanyProfile.DoesNotExist:
            return None


class JobPostSerializer(serializers.ModelSerializer):
    """
    Serializer for Job Posts - Clean implementation matching new model
    """
    recruiter_name = serializers.CharField(source='recruiter.full_name', read_only=True)
    recruiter_email = serializers.CharField(source='recruiter.email', read_only=True)
    company_name = serializers.SerializerMethodField()
    
    # Handle frontend camelCase field names
    jobTitle = serializers.CharField(source='job_title', required=False)
    jobType = serializers.CharField(source='job_type', required=False)
    workMode = serializers.CharField(source='work_mode', required=False)
    experienceLevel = serializers.CharField(source='experience_level', required=False)
    minSalary = serializers.IntegerField(source='min_salary', required=False, allow_null=True)
    maxSalary = serializers.IntegerField(source='max_salary', required=False, allow_null=True)
    salaryPeriod = serializers.CharField(source='salary_period', required=False)
    jobDescription = serializers.CharField(source='job_description', required=False)
    keyResponsibilities = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    benefitsAndPerks = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    requiredSkills = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    applicationDeadline = serializers.DateField(source='application_deadline', required=False, allow_null=True)
    applyMethod = serializers.CharField(source='apply_method', required=False)
    isFeatured = serializers.BooleanField(source='is_featured', required=False)
    isPublished = serializers.BooleanField(source='is_published', required=False)
    
    class Meta:
        model = JobPost
        fields = [
            'id', 'recruiter_name', 'recruiter_email', 'company_name',
            # Basic Details (both camelCase and snake_case for compatibility)
            'jobTitle', 'job_title', 'department', 'jobType', 'job_type', 
            'workMode', 'work_mode', 'experienceLevel', 'experience_level', 'location',
            # Salary
            'minSalary', 'min_salary', 'maxSalary', 'max_salary', 'currency', 'salaryPeriod', 'salary_period',
            # Job Description
            'jobDescription', 'job_description', 'keyResponsibilities', 'key_responsibilities',
            'benefitsAndPerks', 'benefits_and_perks',
            # Requirements
            'requirements', 'requiredSkills', 'required_skills',
            # Application Settings
            'applicationDeadline', 'application_deadline', 'applyMethod', 'apply_method',
            # Status
            'isFeatured', 'is_featured', 'isPublished', 'is_published',
            # Timestamps
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'recruiter_name', 'recruiter_email', 'company_name', 'created_at', 'updated_at']
    
    def get_company_name(self, obj):
        """Get company name from recruiter's company profile if exists"""
        try:
            from recruiter.models import RecruiterCompanyProfile
            profile = RecruiterCompanyProfile.objects.get(recruiter=obj.recruiter)
            return profile.company_name
        except:
            # Fallback to recruiter's full name if no company profile
            return obj.recruiter.full_name + "'s Company"
    
    def to_internal_value(self, data):
        """Handle frontend data format"""
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        
        # Handle nested salary object
        if 'salary' in data and isinstance(data['salary'], dict):
            salary = data['salary']
            data['min_salary'] = salary.get('min', '')
            data['max_salary'] = salary.get('max', '')
            data['currency'] = salary.get('currency', 'INR')
            data['salary_period'] = salary.get('period', 'annually')
            del data['salary']
        
        # Map frontend camelCase to backend snake_case
        field_mapping = {
            'title': 'job_title',
            'jobType': 'job_type',
            'workMode': 'work_mode',
            'experience': 'experience_level',
            'description': 'job_description',
            'responsibilities': 'key_responsibilities',
            'benefits': 'benefits_and_perks',
            'skills': 'required_skills',
            'applicationMethod': 'apply_method',
            'applicationDeadline': 'application_deadline',
            'featuredJob': 'is_featured',
            'jobStatus': 'is_published',
        }
        
        for old_key, new_key in field_mapping.items():
            if old_key in data:
                data[new_key] = data[old_key]
                if old_key != new_key:  # Don't delete if same key
                    del data[old_key]
        
        # Map applicationMethod values: internal → platform
        if 'apply_method' in data:
            if data['apply_method'] == 'internal':
                data['apply_method'] = 'platform'
        
        # Convert arrays to JSON strings
        array_fields = ['key_responsibilities', 'benefits_and_perks', 'requirements', 'required_skills']
        for field in array_fields:
            if field in data and isinstance(data[field], list):
                data[field] = json.dumps(data[field])
        
        # Handle jobStatus -> is_published mapping
        if 'is_published' in data:
            if data['is_published'] == 'published':
                data['is_published'] = True
            elif data['is_published'] == 'draft':
                data['is_published'] = False
        
        return super().to_internal_value(data)
    
    def to_representation(self, instance):
        """Convert to frontend format"""
        data = super().to_representation(instance)
        
        # Convert JSON strings to arrays
        array_fields = {
            'key_responsibilities': 'keyResponsibilities',
            'benefits_and_perks': 'benefitsAndPerks',
            'requirements': 'requirements',
            'required_skills': 'requiredSkills'
        }
        
        for db_field, frontend_field in array_fields.items():
            value = getattr(instance, db_field, None)
            if value:
                try:
                    data[frontend_field] = json.loads(value) if isinstance(value, str) else value
                except (json.JSONDecodeError, TypeError):
                    data[frontend_field] = []
            else:
                data[frontend_field] = []
        
        return data
    
    def create(self, validated_data):
        """Create new job post"""
        recruiter = self.context['request'].user
        
        # Security checks
        if recruiter.role != 'recruiter':
            raise serializers.ValidationError("Only recruiters can post jobs.")
        
        if not recruiter.can_post_jobs():
            raise serializers.ValidationError("Your account is not approved to post jobs yet.")
        
        validated_data['recruiter'] = recruiter
        job_post = JobPost.objects.create(**validated_data)
        return job_post
    
    def update(self, instance, validated_data):
        """Update existing job post"""
        recruiter = self.context['request'].user
        
        if instance.recruiter.id != recruiter.id:
            raise serializers.ValidationError("Cannot update another recruiter's job posting.")
        
        validated_data.pop('recruiter', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance



class JobApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for Job Applications
    """
    # Job details
    job_title = serializers.CharField(source='job.job_title', read_only=True)
    company_name = serializers.SerializerMethodField()
    job_location = serializers.CharField(source='job.location', read_only=True)
    job_type = serializers.CharField(source='job.job_type', read_only=True)
    work_mode = serializers.CharField(source='job.work_mode', read_only=True)
    
    # Candidate details
    candidate_name = serializers.CharField(source='candidate.full_name', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)
    candidate_phone = serializers.CharField(source='candidate.phone', read_only=True)
    
    # Salary info
    min_salary = serializers.IntegerField(source='job.min_salary', read_only=True)
    max_salary = serializers.IntegerField(source='job.max_salary', read_only=True)
    currency = serializers.CharField(source='job.currency', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'candidate', 'status', 'cover_letter',
            'applied_at', 'updated_at', 'recruiter_notes',
            # Job details
            'job_title', 'company_name', 'job_location', 'job_type', 'work_mode',
            'min_salary', 'max_salary', 'currency',
            # Candidate details
            'candidate_name', 'candidate_email', 'candidate_phone'
        ]
        read_only_fields = ['id', 'applied_at', 'updated_at']
    
    def get_company_name(self, obj):
        """Get company name from job's recruiter"""
        try:
            from recruiter.models import RecruiterCompanyProfile
            profile = RecruiterCompanyProfile.objects.get(recruiter=obj.job.recruiter)
            return profile.company_name
        except:
            return obj.job.recruiter.full_name + "'s Company"


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating job applications
    """
    class Meta:
        model = JobApplication
        fields = ['job', 'cover_letter']
    
    def validate_job(self, value):
        """Validate job exists and is published"""
        if not value.is_published:
            raise serializers.ValidationError("This job is not available for applications.")
        return value
    
    def create(self, validated_data):
        """Create new job application"""
        candidate = self.context['request'].user
        
        # Security checks
        if candidate.role != 'candidate':
            raise serializers.ValidationError("Only candidates can apply for jobs.")
        
        # Check for duplicate application
        job = validated_data['job']
        from recruiter.models import JobApplication
        if JobApplication.objects.filter(job=job, candidate=candidate).exists():
            raise serializers.ValidationError("You have already applied for this job.")
        
        validated_data['candidate'] = candidate
        validated_data['status'] = 'applied'
        
        application = JobApplication.objects.create(**validated_data)
        return application
