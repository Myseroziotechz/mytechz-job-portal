"""
Check published jobs in database
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from recruiter.models import JobPost

def check_published_jobs():
    print("=" * 80)
    print("CHECKING PUBLISHED JOBS")
    print("=" * 80)
    
    # Get all jobs
    all_jobs = JobPost.objects.all()
    print(f"\nTotal jobs in database: {all_jobs.count()}")
    
    # Get published jobs
    published_jobs = JobPost.objects.filter(is_published=True)
    print(f"Published jobs: {published_jobs.count()}")
    
    # Get draft jobs
    draft_jobs = JobPost.objects.filter(is_published=False)
    print(f"Draft jobs: {draft_jobs.count()}")
    
    print("\n" + "=" * 80)
    print("ALL JOBS DETAILS")
    print("=" * 80)
    
    for job in all_jobs:
        print(f"\nJob ID: {job.id}")
        print(f"Title: {job.job_title}")
        print(f"Recruiter: {job.recruiter.email}")
        print(f"Location: {job.location}")
        print(f"Type: {job.job_type}")
        print(f"Published: {'✅ YES' if job.is_published else '❌ NO (DRAFT)'}")
        print(f"Created: {job.created_at}")
        print("-" * 80)
    
    if published_jobs.count() == 0:
        print("\n⚠️  WARNING: No published jobs found!")
        print("   Jobs need to have is_published=True to appear on the frontend")
        print("\n   To publish jobs, you can:")
        print("   1. Update existing jobs to set is_published=True")
        print("   2. Create new jobs with is_published=True")
        
        if draft_jobs.count() > 0:
            print(f"\n   You have {draft_jobs.count()} draft jobs that can be published")
            print("\n   Publishing all draft jobs now...")
            
            for job in draft_jobs:
                job.is_published = True
                job.save()
                print(f"   ✅ Published: {job.job_title}")
            
            print(f"\n   ✅ Successfully published {draft_jobs.count()} jobs!")
    else:
        print(f"\n✅ Found {published_jobs.count()} published jobs")
        print("   These jobs should be visible on the frontend")

if __name__ == '__main__':
    check_published_jobs()
