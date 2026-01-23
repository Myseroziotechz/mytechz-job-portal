#!/usr/bin/env python
"""
Verify jobs in database
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from recruiter.models import JobPost
from authentication.models import User

print("=" * 80)
print("DATABASE JOBS VERIFICATION")
print("=" * 80)

# Get all jobs
jobs = JobPost.objects.all()
print(f"\nTotal jobs in database: {jobs.count()}")

if jobs.count() == 0:
    print("\n❌ No jobs found in database!")
else:
    print("\n📋 Jobs List:")
    print("-" * 80)
    for job in jobs:
        print(f"\nJob ID: {job.id}")
        print(f"Title: {job.job_title}")
        print(f"Recruiter: {job.recruiter.email}")
        print(f"Department: {job.department}")
        print(f"Job Type: {job.job_type}")
        print(f"Work Mode: {job.work_mode}")
        print(f"Location: {job.location}")
        print(f"Published: {'Yes' if job.is_published else 'No (Draft)'}")
        print(f"Featured: {'Yes' if job.is_featured else 'No'}")
        print(f"Created: {job.created_at}")
        print("-" * 80)

# Get published jobs only
published_jobs = JobPost.objects.filter(is_published=True)
print(f"\n✅ Published jobs (visible to candidates): {published_jobs.count()}")

# Get draft jobs
draft_jobs = JobPost.objects.filter(is_published=False)
print(f"📝 Draft jobs: {draft_jobs.count()}")

# Get jobs by recruiter
print("\n👥 Jobs by Recruiter:")
print("-" * 80)
recruiters = User.objects.filter(role='recruiter')
for recruiter in recruiters:
    job_count = JobPost.objects.filter(recruiter=recruiter).count()
    if job_count > 0:
        print(f"{recruiter.email}: {job_count} jobs")
        print(f"  - Approved: {recruiter.approval_status == 'approved'}")
        print(f"  - Can post jobs: {recruiter.can_post_jobs()}")

print("\n" + "=" * 80)
print("VERIFICATION COMPLETE")
print("=" * 80)
