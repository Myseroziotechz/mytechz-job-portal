#!/usr/bin/env python
"""
Create test credentials for candidate and recruiter
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

print("=" * 80)
print("CREATING TEST CREDENTIALS")
print("=" * 80)

# Create test candidate
candidate_email = "candidate@test.com"
candidate_password = "candidate123"

try:
    # Check if candidate exists
    candidate = User.objects.filter(email=candidate_email).first()
    
    if candidate:
        print(f"\n✅ Candidate already exists: {candidate_email}")
        # Update password
        candidate.set_password(candidate_password)
        candidate.save()
        print(f"   Password reset to: {candidate_password}")
    else:
        # Create new candidate
        candidate = User.objects.create_user(
            email=candidate_email,
            password=candidate_password,
            first_name="Test",
            last_name="Candidate",
            role="candidate"
        )
        print(f"\n✅ Created new candidate: {candidate_email}")
        print(f"   Password: {candidate_password}")
    
    print(f"   Name: {candidate.full_name}")
    print(f"   Role: {candidate.role}")
    
except Exception as e:
    print(f"\n❌ Error creating candidate: {e}")

# Create test recruiter
recruiter_email = "recruiter@test.com"
recruiter_password = "recruiter123"

try:
    # Check if recruiter exists
    recruiter = User.objects.filter(email=recruiter_email).first()
    
    if recruiter:
        print(f"\n✅ Recruiter already exists: {recruiter_email}")
        # Update password
        recruiter.set_password(recruiter_password)
        recruiter.approval_status = 'approved'  # Make sure approved
        recruiter.save()
        print(f"   Password reset to: {recruiter_password}")
    else:
        # Create new recruiter
        recruiter = User.objects.create_user(
            email=recruiter_email,
            password=recruiter_password,
            first_name="Test",
            last_name="Recruiter",
            role="recruiter"
        )
        # Approve the recruiter
        recruiter.approval_status = 'approved'
        recruiter.save()
        print(f"\n✅ Created new recruiter: {recruiter_email}")
        print(f"   Password: {recruiter_password}")
    
    print(f"   Name: {recruiter.full_name}")
    print(f"   Role: {recruiter.role}")
    print(f"   Approval Status: {recruiter.approval_status}")
    print(f"   Can Post Jobs: {recruiter.can_post_jobs()}")
    
except Exception as e:
    print(f"\n❌ Error creating recruiter: {e}")

# Also reset password for existing spark@gmail.com
try:
    spark = User.objects.get(email="spark@gmail.com")
    spark.set_password("spark123")
    spark.save()
    print(f"\n✅ Reset password for spark@gmail.com")
    print(f"   New password: spark123")
except:
    pass

print("\n" + "=" * 80)
print("TEST CREDENTIALS SUMMARY")
print("=" * 80)
print("\n🔐 CANDIDATE CREDENTIALS:")
print(f"   Email: {candidate_email}")
print(f"   Password: {candidate_password}")
print(f"   Role: Candidate (Job Seeker)")

print("\n🔐 RECRUITER CREDENTIALS:")
print(f"   Email: {recruiter_email}")
print(f"   Password: {recruiter_password}")
print(f"   Role: Recruiter (Can post jobs)")
print(f"   Status: Approved")

print("\n🔐 EXISTING RECRUITER (with 2 jobs):")
print(f"   Email: spark@gmail.com")
print(f"   Password: spark123")
print(f"   Role: Recruiter")
print(f"   Status: Approved")
print(f"   Jobs Posted: 2")

print("\n🔐 ADMIN CREDENTIALS:")
print(f"   Email: admin@jobportal.com")
print(f"   Password: admin123")
print(f"   Role: Admin")

print("\n" + "=" * 80)
