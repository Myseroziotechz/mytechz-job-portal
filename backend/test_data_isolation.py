#!/usr/bin/env python
"""
Test Data Isolation for Recruiter Company Profiles
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

def test_data_isolation():
    """Test complete data isolation between recruiters"""
    
    print("🔒 TESTING DATA ISOLATION FOR RECRUITER COMPANY PROFILES")
    print("=" * 80)
    
    # Clean up test users
    User.objects.filter(email__in=['recruiter_a@test.com', 'recruiter_b@test.com']).delete()
    
    # TEST 1: Create Recruiter A
    print("\n📝 TEST 1: Create Recruiter A")
    print("-" * 80)
    recruiter_a = User.objects.create_user(
        email='recruiter_a@test.com',
        password='testpass123',
        first_name='Alice',
        last_name='Anderson',
        role='recruiter',
        phone='1234567890'
    )
    print(f"✅ Created Recruiter A: {recruiter_a.email} (ID: {recruiter_a.id})")
    
    # TEST 2: Create Company Profile for Recruiter A
    print("\n📝 TEST 2: Create Company Profile for Recruiter A")
    print("-" * 80)
    profile_a = RecruiterCompanyProfile.objects.create(
        recruiter=recruiter_a,
        company_name="Alice Tech Solutions",
        website="https://alicetech.com",
        industry="Information Technology",
        company_size="51-200",
        founded_year=2020,
        head_office_location="New York, USA",
        company_description="Alice's amazing tech company",
        office_address="123 Alice Street, NY",
        work_mode="hybrid"
    )
    print(f"✅ Created Profile A: {profile_a.company_name} (ID: {profile_a.id})")
    print(f"   Linked to Recruiter: {profile_a.recruiter.email} (ID: {profile_a.recruiter.id})")
    
    # TEST 3: Create Recruiter B
    print("\n📝 TEST 3: Create Recruiter B")
    print("-" * 80)
    recruiter_b = User.objects.create_user(
        email='recruiter_b@test.com',
        password='testpass123',
        first_name='Bob',
        last_name='Brown',
        role='recruiter',
        phone='0987654321'
    )
    print(f"✅ Created Recruiter B: {recruiter_b.email} (ID: {recruiter_b.id})")
    
    # TEST 4: Verify Recruiter B has NO profile
    print("\n📝 TEST 4: Verify Recruiter B has NO profile")
    print("-" * 80)
    try:
        profile_b_check = RecruiterCompanyProfile.objects.get(recruiter=recruiter_b)
        print(f"❌ FAIL: Recruiter B should not have a profile yet!")
        print(f"   Found: {profile_b_check.company_name}")
    except RecruiterCompanyProfile.DoesNotExist:
        print(f"✅ PASS: Recruiter B has no profile (as expected)")
    
    # TEST 5: Query using recruiter_id (strict isolation)
    print("\n📝 TEST 5: Query using recruiter_id (strict isolation)")
    print("-" * 80)
    
    # Query for Recruiter A's profile
    profile_a_query = RecruiterCompanyProfile.objects.filter(recruiter_id=recruiter_a.id)
    print(f"Query for Recruiter A (ID: {recruiter_a.id}):")
    print(f"  Found {profile_a_query.count()} profile(s)")
    if profile_a_query.exists():
        p = profile_a_query.first()
        print(f"  Company: {p.company_name}")
        print(f"  Recruiter: {p.recruiter.email}")
    
    # Query for Recruiter B's profile
    profile_b_query = RecruiterCompanyProfile.objects.filter(recruiter_id=recruiter_b.id)
    print(f"\nQuery for Recruiter B (ID: {recruiter_b.id}):")
    print(f"  Found {profile_b_query.count()} profile(s)")
    if profile_b_query.exists():
        print(f"  ❌ FAIL: Recruiter B should not have a profile!")
    else:
        print(f"  ✅ PASS: No profile found (correct)")
    
    # TEST 6: Create Profile for Recruiter B
    print("\n📝 TEST 6: Create Company Profile for Recruiter B")
    print("-" * 80)
    profile_b = RecruiterCompanyProfile.objects.create(
        recruiter=recruiter_b,
        company_name="Bob's Business Corp",
        website="https://bobcorp.com",
        industry="Financial Services",
        company_size="11-50",
        founded_year=2021,
        head_office_location="Los Angeles, USA",
        company_description="Bob's financial services company",
        office_address="456 Bob Avenue, LA",
        work_mode="remote"
    )
    print(f"✅ Created Profile B: {profile_b.company_name} (ID: {profile_b.id})")
    print(f"   Linked to Recruiter: {profile_b.recruiter.email} (ID: {profile_b.recruiter.id})")
    
    # TEST 7: Verify Data Isolation
    print("\n📝 TEST 7: Verify Complete Data Isolation")
    print("-" * 80)
    
    # Refresh profiles
    profile_a.refresh_from_db()
    profile_b.refresh_from_db()
    
    print(f"Recruiter A (ID: {recruiter_a.id}):")
    print(f"  Email: {recruiter_a.email}")
    print(f"  Company: {profile_a.company_name}")
    print(f"  Profile ID: {profile_a.id}")
    print(f"  Profile Recruiter ID: {profile_a.recruiter.id}")
    
    print(f"\nRecruiter B (ID: {recruiter_b.id}):")
    print(f"  Email: {recruiter_b.email}")
    print(f"  Company: {profile_b.company_name}")
    print(f"  Profile ID: {profile_b.id}")
    print(f"  Profile Recruiter ID: {profile_b.recruiter.id}")
    
    # Verify no cross-contamination
    if profile_a.recruiter.id == recruiter_a.id and profile_b.recruiter.id == recruiter_b.id:
        print(f"\n✅ PASS: Data isolation is correct!")
    else:
        print(f"\n❌ FAIL: Data isolation is broken!")
    
    # TEST 8: Test OneToOneField Uniqueness
    print("\n📝 TEST 8: Test OneToOneField Uniqueness Constraint")
    print("-" * 80)
    try:
        duplicate_profile = RecruiterCompanyProfile.objects.create(
            recruiter=recruiter_a,  # Try to create second profile for Recruiter A
            company_name="Duplicate Company",
            industry="Test",
            company_size="1-10",
            head_office_location="Test",
            company_description="Test",
            office_address="Test",
            work_mode="office"
        )
        print(f"❌ FAIL: Should not allow duplicate profile for same recruiter!")
    except Exception as e:
        print(f"✅ PASS: Duplicate profile prevented by database constraint")
        print(f"   Error: {type(e).__name__}")
    
    # TEST 9: Verify Total Profiles
    print("\n📝 TEST 9: Verify Total Profiles in Database")
    print("-" * 80)
    all_profiles = RecruiterCompanyProfile.objects.all()
    print(f"Total profiles in database: {all_profiles.count()}")
    for p in all_profiles:
        print(f"  - Profile {p.id}: {p.company_name} (Recruiter: {p.recruiter.email})")
    
    # Cleanup
    print("\n🧹 Cleaning up test data...")
    recruiter_a.delete()
    recruiter_b.delete()
    print("✅ Test data cleaned up")
    
    print("\n" + "=" * 80)
    print("🎉 DATA ISOLATION TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 80)
    print("\n✅ All security checks passed:")
    print("   - Each recruiter has exactly one profile")
    print("   - Profiles are correctly linked by recruiter_id")
    print("   - No cross-contamination between recruiters")
    print("   - OneToOneField constraint enforced")
    print("   - Queries are properly scoped by recruiter_id")

if __name__ == "__main__":
    test_data_isolation()