#!/usr/bin/env python
"""
Update existing recruiter with new approval workflow fields
"""
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User
from recruiter.models import RecruiterCompanyProfile

def update_existing_recruiter():
    """Update existing recruiter with approval workflow"""
    
    print("🔄 Updating Existing Recruiter")
    print("=" * 40)
    
    try:
        # Find the existing recruiter
        recruiter = User.objects.get(email="recruiter@demo.com")
        print(f"✅ Found recruiter: {recruiter.full_name}")
        
        # Check current status
        print(f"\nCurrent Status:")
        print(f"   - Role: {recruiter.role}")
        print(f"   - Profile Completed: {recruiter.profile_completed}")
        print(f"   - Approval Status: {recruiter.approval_status}")
        print(f"   - Approved At: {recruiter.approved_at}")
        print(f"   - Can Post Jobs: {recruiter.can_post_jobs()}")
        
        # Check if they have a company profile
        try:
            company_profile = recruiter.company_profile
            print(f"\n✅ Company Profile exists: {company_profile.company_name}")
            print(f"   - Verification Status: {company_profile.verification_status}")
            
            # Since they have a company profile, mark as completed
            if not recruiter.profile_completed:
                recruiter.profile_completed = True
                recruiter.save()
                print("✅ Marked profile as completed")
            
        except RecruiterCompanyProfile.DoesNotExist:
            print("❌ No company profile found")
            print("   Recruiter needs to complete their company profile")
        
        # For demo purposes, let's approve this recruiter
        if recruiter.approval_status == 'pending':
            recruiter.approve_recruiter()
            print("✅ Approved recruiter for demo purposes")
        
        # Final status
        print(f"\nFinal Status:")
        print(f"   - Profile Completed: {recruiter.profile_completed}")
        print(f"   - Approval Status: {recruiter.approval_status}")
        print(f"   - Approved At: {recruiter.approved_at}")
        print(f"   - Can Post Jobs: {recruiter.can_post_jobs()}")
        
        print("\n🎉 Existing recruiter updated successfully!")
        print(f"   Login: recruiter@demo.com / demo123")
        print(f"   Can now post jobs: {'Yes' if recruiter.can_post_jobs() else 'No'}")
        
    except User.DoesNotExist:
        print("❌ Recruiter not found: recruiter@demo.com")
        print("   Please create a recruiter first")

if __name__ == "__main__":
    update_existing_recruiter()