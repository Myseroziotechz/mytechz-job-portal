#!/usr/bin/env python
"""
Quick script to approve a recruiter
"""
import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User
from recruiter.models import RecruiterCompanyProfile

def approve_recruiter(email):
    """Approve a recruiter by email"""
    
    print(f"🔍 Looking for recruiter: {email}")
    print("=" * 60)
    
    try:
        # Find the recruiter
        recruiter = User.objects.get(email=email, role='recruiter')
        
        print(f"✅ Found recruiter:")
        print(f"   Name: {recruiter.full_name}")
        print(f"   Email: {recruiter.email}")
        print(f"   ID: {recruiter.id}")
        print(f"\n📊 Current Status:")
        print(f"   Profile Completed: {recruiter.profile_completed}")
        print(f"   Approval Status: {recruiter.approval_status}")
        print(f"   Can Post Jobs: {recruiter.can_post_jobs()}")
        
        # Check if they have a company profile
        try:
            company_profile = recruiter.company_profile
            print(f"\n🏢 Company Profile:")
            print(f"   Company Name: {company_profile.company_name}")
            print(f"   Verification Status: {company_profile.verification_status}")
        except RecruiterCompanyProfile.DoesNotExist:
            print(f"\n⚠️  No company profile found")
            print(f"   Recruiter needs to create their company profile first")
            return
        
        # Approve the recruiter
        print(f"\n🔄 Approving recruiter...")
        recruiter.approve_recruiter()
        
        # Also verify the company profile
        if company_profile.verification_status != 'verified':
            company_profile.verification_status = 'verified'
            company_profile.save()
            print(f"✅ Company profile verified")
        
        print(f"\n✅ APPROVAL SUCCESSFUL!")
        print(f"\n📊 New Status:")
        print(f"   Profile Completed: {recruiter.profile_completed}")
        print(f"   Approval Status: {recruiter.approval_status}")
        print(f"   Approved At: {recruiter.approved_at}")
        print(f"   Can Post Jobs: {recruiter.can_post_jobs()}")
        
        print(f"\n🎉 {recruiter.full_name} can now post jobs!")
        
    except User.DoesNotExist:
        print(f"❌ Recruiter not found: {email}")
        print(f"   Make sure the email is correct and the user has role='recruiter'")

def list_pending_recruiters():
    """List all pending recruiters"""
    
    print("📋 PENDING RECRUITERS")
    print("=" * 60)
    
    pending_recruiters = User.objects.filter(
        role='recruiter',
        approval_status='pending'
    )
    
    if not pending_recruiters.exists():
        print("✅ No pending recruiters")
        return
    
    print(f"Found {pending_recruiters.count()} pending recruiter(s):\n")
    
    for recruiter in pending_recruiters:
        print(f"📧 {recruiter.email}")
        print(f"   Name: {recruiter.full_name}")
        print(f"   ID: {recruiter.id}")
        print(f"   Profile Completed: {recruiter.profile_completed}")
        
        try:
            company = recruiter.company_profile
            print(f"   Company: {company.company_name}")
        except RecruiterCompanyProfile.DoesNotExist:
            print(f"   Company: No profile yet")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Approve specific recruiter
        email = sys.argv[1]
        approve_recruiter(email)
    else:
        # List all pending recruiters
        list_pending_recruiters()
        print("\nTo approve a recruiter, run:")
        print("python approve_recruiter.py <email>")
        print("\nExample:")
        print("python approve_recruiter.py testcandr@gmail.com")
