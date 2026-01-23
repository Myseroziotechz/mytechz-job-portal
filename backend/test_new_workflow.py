#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

print("=" * 60)
print("TESTING NEW APPROVAL WORKFLOW")
print("=" * 60)

# Get all recruiters
recruiters = User.objects.filter(role='recruiter')
print(f"\n📊 Total Recruiters: {recruiters.count()}\n")

for recruiter in recruiters:
    print(f"{'='*60}")
    print(f"👤 {recruiter.email}")
    print(f"   Name: {recruiter.full_name}")
    print(f"   Profile Completed: {recruiter.profile_completed}")
    print(f"   Approval Status: {recruiter.approval_status}")
    print(f"   Can Post Jobs: {recruiter.can_post_jobs()}")
    print()

print("\n" + "=" * 60)
print("NEW WORKFLOW RULES:")
print("=" * 60)
print("✅ Recruiter registers → Visible in admin immediately")
print("✅ Admin can approve WITHOUT company profile")
print("✅ Once approved → Can post jobs (profile optional)")
print("✅ Company profile is now OPTIONAL for posting jobs")
print("=" * 60)
