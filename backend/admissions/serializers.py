from rest_framework import serializers
from .models import CollegeApplication
from authentication.models import User

class CollegeApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for College Applications
    """
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    college_details = serializers.SerializerMethodField()
    
    class Meta:
        model = CollegeApplication
        fields = [
            'id', 'user', 'user_name', 'user_email',
            'college_name', 'college_details',
            'full_name', 'email', 'phone', 'date_of_birth', 'gender',
            'address', 'city', 'state', 'pincode',
            'qualification', 'percentage', 'course', 'branch',
            'message', 'status', 'admin_notes',
            'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'user_name', 'user_email', 'applied_at', 'updated_at']
    
    def get_college_details(self, obj):
        """Return college data as dict"""
        return obj.get_college_data()


class CollegeApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating college applications
    """
    college_data = serializers.JSONField(write_only=True)
    
    class Meta:
        model = CollegeApplication
        fields = [
            'college_name', 'college_data',
            'full_name', 'email', 'phone', 'date_of_birth', 'gender',
            'address', 'city', 'state', 'pincode',
            'qualification', 'percentage', 'course', 'branch',
            'message'
        ]
    
    def validate_email(self, value):
        """Validate email format"""
        if not value or '@' not in value:
            raise serializers.ValidationError("Please enter a valid email address.")
        return value
    
    def validate_phone(self, value):
        """Validate phone number"""
        if not value:
            raise serializers.ValidationError("Phone number is required.")
        # Remove spaces and special characters for validation
        cleaned = ''.join(filter(str.isdigit, value))
        if len(cleaned) < 10:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value
    
    def validate_pincode(self, value):
        """Validate pincode"""
        if not value or len(value) != 6 or not value.isdigit():
            raise serializers.ValidationError("Please enter a valid 6-digit pincode.")
        return value
    
    def create(self, validated_data):
        """Create new college application"""
        user = self.context['request'].user
        
        # Extract college data
        college_data = validated_data.pop('college_data')
        
        # Check for duplicate application
        if CollegeApplication.objects.filter(
            user=user,
            college_name=validated_data['college_name']
        ).exists():
            raise serializers.ValidationError(
                "You have already applied to this college."
            )
        
        # Create application
        application = CollegeApplication.objects.create(
            user=user,
            **validated_data
        )
        
        # Set college data
        application.set_college_data(college_data)
        application.save()
        
        return application


class CollegeApplicationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for admin to update application status
    """
    class Meta:
        model = CollegeApplication
        fields = ['status', 'admin_notes']
    
    def validate_status(self, value):
        """Validate status"""
        valid_statuses = ['pending', 'under_review', 'approved', 'rejected', 'waitlisted']
        if value not in valid_statuses:
            raise serializers.ValidationError("Invalid status.")
        return value
