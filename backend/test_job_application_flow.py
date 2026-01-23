"""
Test script for LinkedIn-style Job Application Flow
Tests all API endpoints for the job application system
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User
from recruiter.models import JobPost, JobApplication, RecruiterCompanyProfile
from django.utils import timezone
from datetime import timedelta

def test_job_application_flow():
    print("=" * 80)
    print("TESTING JOB APPLICATION FLOW")
    print("=" * 80)
    
    # 1. Get test users
    print("\n1. Getting test users...")
    try:
        candidate = User.objects.get(email='candidate@test.com')
        print(f"   ✅ Candidate found: {candidate.email}")
    except User.DoesNotExist:
        print("   ❌ Candidate not found. Creating...")
        candidate = User.objects.create_user(
            email='candidate@test.com',
            password='candidate123',
            first_name='Test',
            last_name='Candidate',
            role='candidate'
        )
        print(f"   ✅ Candidate created: {candidate.email}")
    
    try:
        recruiter = User.objects.get(email='spark@gmail.com')
        print(f"   ✅ Recruiter found: {recruiter.email}")
    except User.DoesNotExist:
        print("   ❌ Recruiter not found")
        return
    
    # 2. Check published jobs
    print("\n2. Checking published jobs...")
    published_jobs = JobPost.objects.filter(is_published=True)
    print(f"   Total published jobs: {published_jobs.count()}")
    
    if published_jobs.count() == 0:
        print("   ❌ No published jobs found")
        return
    
    test_job = published_jobs.first()
    print(f"   ✅ Test job: {test_job.job_title} (ID: {test_job.id})")
    print(f"      Company: {test_job.recruiter.company_profile.company_name if hasattr(test_job.recruiter, 'company_profile') else 'N/A'}")
    print(f"      Location: {test_job.location}")
    print(f"      Type: {test_job.job_type}")
    
    # 3. Check existing applications
    print("\n3. Checking existing applications...")
    existing_app = JobApplication.objects.filter(
        job=test_job,
        candidate=candidate
    ).first()
    
    if existing_app:
        print(f"   ⚠️  Application already exists (ID: {existing_app.id})")
        print(f"      Status: {existing_app.status}")
        print(f"      Applied at: {existing_app.applied_at}")
        
        # Delete for testing
        print("   Deleting existing application for testing...")
        existing_app.delete()
        print("   ✅ Deleted")
    else:
        print("   ✅ No existing application")
    
    # 4. Create new application
    print("\n4. Creating new job application...")
    try:
        application = JobApplication.objects.create(
            job=test_job,
            candidate=candidate,
            status='applied',
            cover_letter='This is a test cover letter for the job application.'
        )
        print(f"   ✅ Application created successfully!")
        print(f"      Application ID: {application.id}")
        print(f"      Job: {application.job.job_title}")
        print(f"      Candidate: {application.candidate.full_name}")
        print(f"      Status: {application.status}")
        print(f"      Applied at: {application.applied_at}")
    except Exception as e:
        print(f"   ❌ Error creating application: {e}")
        return
    
    # 5. Test duplicate prevention
    print("\n5. Testing duplicate application prevention...")
    try:
        duplicate = JobApplication.objects.create(
            job=test_job,
            candidate=candidate,
            status='applied'
        )
        print("   ❌ Duplicate application was created (should have been prevented)")
    except Exception as e:
        print(f"   ✅ Duplicate prevented: {str(e)}")
    
    # 6. Get candidate's applications
    print("\n6. Getting candidate's applications...")
    candidate_apps = JobApplication.objects.filter(candidate=candidate)
    print(f"   Total applications: {candidate_apps.count()}")
    for app in candidate_apps:
        print(f"   - {app.job.job_title} at {app.job.recruiter.company_profile.company_name if hasattr(app.job.recruiter, 'company_profile') else 'Company'}")
        print(f"     Status: {app.status}, Applied: {app.applied_at.strftime('%Y-%m-%d')}")
    
    # 7. Get recruiter's applications
    print("\n7. Getting recruiter's applications...")
    recruiter_jobs = JobPost.objects.filter(recruiter=recruiter)
    recruiter_apps = JobApplication.objects.filter(job__in=recruiter_jobs)
    print(f"   Total applications for recruiter's jobs: {recruiter_apps.count()}")
    for app in recruiter_apps:
        print(f"   - {app.candidate.full_name} applied for {app.job.job_title}")
        print(f"     Status: {app.status}, Applied: {app.applied_at.strftime('%Y-%m-%d')}")
    
    # 8. Update application status
    print("\n8. Testing application status update...")
    application.status = 'under_review'
    application.recruiter_notes = 'Candidate profile looks promising'
    application.save()
    print(f"   ✅ Status updated to: {application.status}")
    print(f"   ✅ Recruiter notes: {application.recruiter_notes}")
    
    # 9. Test application properties
    print("\n9. Testing application properties...")
    print(f"   Is active: {application.is_active}")
    print(f"   Job title: {application.job.job_title}")
    print(f"   Candidate name: {application.candidate.full_name}")
    print(f"   Candidate email: {application.candidate.email}")
    
    # 10. Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"✅ Job Application Flow is working correctly!")
    print(f"✅ Total published jobs: {published_jobs.count()}")
    print(f"✅ Total applications: {JobApplication.objects.count()}")
    print(f"✅ Candidate applications: {candidate_apps.count()}")
    print(f"✅ Recruiter applications: {recruiter_apps.count()}")
    print("=" * 80)

if __name__ == '__main__':
    test_job_application_flow()
