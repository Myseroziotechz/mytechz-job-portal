#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User
from recruiter.models import RecruiterCompanyProfile

print("=" * 60)
print("CHECKING COMPANY PROFILES")
print("=" * 60)

# Check all users with recruiter role
recruiters = User.objects.filter(role='recruiter')
print(f"\n📊 Total Recruiters: {recruiters.count()}")

for recruiter in recruiters:
    print(f"\n{'='*60}")
    print(f"👤 Recruiter: {recruiter.email} (ID: {recruiter.id})")
    print(f"   Name: {recruiter.full_name}")
    print(f"   Profile Completed: {recruiter.profile_completed}")
    print(f"   Approval Status: {recruiter.approval_status}")
    print(f"   Can Post Jobs: {recruiter.can_post_jobs}")
    
    # Check if company profile exists
    try:
        company_profile = RecruiterCompanyProfile.objects.get(recruiter_id=recruiter.id)
        print(f"   ✅ Company Profile EXISTS")
        print(f"      Company Name: {company_profile.company_name}")
        print(f"      Industry: {company_profile.industry}")
        print(f"      Verification Status: {company_profile.verification_status}")
        print(f"      Created: {company_profile.created_at}")
    except RecruiterCompanyProfile.DoesNotExist:
        print(f"   ❌ NO Company Profile")

# Check all company profiles
print(f"\n{'='*60}")
print("ALL COMPANY PROFILES IN DATABASE")
print("=" * 60)
all_profiles = RecruiterCompanyProfile.objects.all()
print(f"Total Company Profiles: {all_profiles.count()}")

for profile in all_profiles:
    print(f"\n📋 Company: {profile.company_name}")
    print(f"   Recruiter ID: {profile.recruiter_id}")
    print(f"   Industry: {profile.industry}")
    print(f"   Verification: {profile.verification_status}")
    print(f"   Created: {profile.created_at}")
