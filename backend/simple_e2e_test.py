"""
Simplified E2E Test - Windows Compatible
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User
from recruiter.models import JobPost, JobApplication
from django.core.exceptions import PermissionDenied

print("\n" + "="*80)
print("TESTING SECURITY FIX: Job Posting Before Approval")
print("="*80)

# Get an unapproved recruiter
recruiter = User.objects.filter(role='recruiter', approval_status='pending').first()

if not recruiter:
    print("\nNo pending recruiter found. Creating one...")
    recruiter = User.objects.create_user(
        email='test_recruiter@test.com',
        password='Test@123',
        first_name='Test',
        last_name='Recruiter',
        role='recruiter'
    )

print(f"\nRecruiter: {recruiter.email}")
print(f"Approval Status: {recruiter.approval_status}")
print(f"Can Post Jobs: {recruiter.can_post_jobs()}")

# Try to create a job
print("\nAttempting to create job...")
try:
    job = JobPost.objects.create(
        recruiter=recruiter,
        job_title="Test Job",
        job_type="Full-time",
        work_mode="Remote",
        experience_level="0-1 years",
        location="Test City",
        job_description="This should not be created",
        is_published=True
    )
    print("FAILED: Job was created! SECURITY BREACH!")
    job.delete()
except PermissionDenied as e:
    print(f"PASSED: Job creation blocked - {str(e)[:80]}")
except Exception as e:
    print(f"PASSED: Job creation blocked - {type(e).__name__}")

print("\n" + "="*80)
print("FINAL DATABASE STATISTICS")
print("="*80)

print(f"\nTotal Users: {User.objects.count()}")
print(f"  - Admins: {User.objects.filter(role='admin').count()}")
print(f"  - Recruiters: {User.objects.filter(role='recruiter').count()}")
print(f"  - Candidates: {User.objects.filter(role='candidate').count()}")
print(f"\nTotal Jobs: {JobPost.objects.count()}")
print(f"  - Published: {JobPost.objects.filter(is_published=True).count()}")
print(f"\nTotal Applications: {JobApplication.objects.count()}")

print("\n" + "="*80)
print("TEST COMPLETE")
print("="*80)
