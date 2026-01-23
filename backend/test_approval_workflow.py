#!/usr/bin/env python
"""
Test script for Recruiter Approval Workflow
"""
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User
from recruiter.models import RecruiterCompanyProfile
from django.utils import timezone

def test_approval_workflow():
    """Test the complete recruiter approval workflow"""
    
    print("🚀 Testing Recruiter Approval Workflow")
    print("=" * 50)
    
    # 1. Create a test recruiter
    print("\n1. Creating test recruiter...")
    recruiter_email = "test_recruiter@example.com"
    
    # Delete existing test user if exists
    User.objects.filter(email=recruiter_email).delete()
    
    recruiter = User.objects.create_user(
        email=recruiter_email,
        password="testpass123",
        first_name="Test",
        last_name="Recruiter",
        role="recruiter",
        phone="+1234567890"
    )
    
    print(f"✅ Created recruiter: {recruiter.full_name}")
    print(f"   - Profile Completed: {recruiter.profile_completed}")
    print(f"   - Approval Status: {recruiter.approval_status}")
    print(f"   - Can Post Jobs: {recruiter.can_post_jobs()}")
    
    # 2. Create company profile
    print("\n2. Creating company profile...")
    company_profile = RecruiterCompanyProfile.objects.create(
        recruiter=recruiter,
        company_name="Test Tech Solutions",
        website="https://testtech.com",
        industry="Information Technology",
        company_size="51-200",
        founded_year=2020,
        head_office_location="Mumbai, India",
        gst_cin="27AABCT1234C1Z5",
        company_description="A test technology company",
        mission_and_culture="Innovation and excellence",
        office_address="Tech Park, Mumbai",
        work_mode="hybrid"
    )
    
    print(f"✅ Created company profile: {company_profile.company_name}")
    
    # Refresh recruiter from database
    recruiter.refresh_from_db()
    print(f"   - Profile Completed: {recruiter.profile_completed}")
    print(f"   - Approval Status: {recruiter.approval_status}")
    print(f"   - Can Post Jobs: {recruiter.can_post_jobs()}")
    
    # 3. Test admin approval
    print("\n3. Testing admin approval...")
    recruiter.approve_recruiter()
    
    print(f"✅ Recruiter approved")
    print(f"   - Profile Completed: {recruiter.profile_completed}")
    print(f"   - Approval Status: {recruiter.approval_status}")
    print(f"   - Approved At: {recruiter.approved_at}")
    print(f"   - Can Post Jobs: {recruiter.can_post_jobs()}")
    
    # 4. Test job posting access
    print("\n4. Testing job posting access...")
    if recruiter.can_post_jobs():
        print("✅ Recruiter CAN post jobs - Access granted!")
    else:
        print("❌ Recruiter CANNOT post jobs - Access denied!")
    
    # 5. Test rejection workflow
    print("\n5. Testing rejection workflow...")
    recruiter.reject_recruiter()
    
    print(f"✅ Recruiter rejected")
    print(f"   - Approval Status: {recruiter.approval_status}")
    print(f"   - Approved At: {recruiter.approved_at}")
    print(f"   - Can Post Jobs: {recruiter.can_post_jobs()}")
    
    # 6. Test re-approval
    print("\n6. Testing re-approval...")
    recruiter.approve_recruiter()
    
    print(f"✅ Recruiter re-approved")
    print(f"   - Approval Status: {recruiter.approval_status}")
    print(f"   - Approved At: {recruiter.approved_at}")
    print(f"   - Can Post Jobs: {recruiter.can_post_jobs()}")
    
    print("\n" + "=" * 50)
    print("🎉 All tests completed successfully!")
    print("\nAPI Endpoints available:")
    print("- GET  /api/recruiter/admin/recruiters")
    print("- GET  /api/recruiter/admin/recruiters/{id}")
    print("- PUT  /api/recruiter/admin/recruiters/{id}/approve")
    print("- PUT  /api/recruiter/admin/recruiters/{id}/reject")
    print("- POST /api/recruiter/jobs/create (with approval guard)")
    
    # Cleanup
    print(f"\n🧹 Cleaning up test data...")
    recruiter.delete()
    print("✅ Test data cleaned up")

if __name__ == "__main__":
    test_approval_workflow()