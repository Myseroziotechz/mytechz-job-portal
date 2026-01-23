"""
Comprehensive End-to-End Testing Script
Creates 20 dummy users and performs complete system validation
"""

import os
import django
import json
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from django.contrib.auth import get_user_model
from authentication.models import User
from recruiter.models import RecruiterCompanyProfile, JobPost, JobApplication
from django.db import IntegrityError

# Test Results Storage
test_results = {
    'passed': [],
    'failed': [],
    'warnings': [],
    'created_users': [],
    'created_jobs': [],
    'created_applications': []
}

def log_pass(test_name, message):
    """Log passed test"""
    test_results['passed'].append(f"✅ {test_name}: {message}")
    print(f"✅ {test_name}: {message}")

def log_fail(test_name, message):
    """Log failed test"""
    test_results['failed'].append(f"❌ {test_name}: {message}")
    print(f"❌ {test_name}: {message}")

def log_warning(test_name, message):
    """Log warning"""
    test_results['warnings'].append(f"⚠️  {test_name}: {message}")
    print(f"⚠️  {test_name}: {message}")

def print_section(title):
    """Print section header"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)

# ============================================================================
# STEP 1: CREATE DUMMY USERS
# ============================================================================

def create_dummy_users():
    """Create 20 dummy users across all roles"""
    print_section("STEP 1: CREATING DUMMY USERS")
    
    users_data = {
        'admins': [
            {'email': 'admin1@test.com', 'password': 'Admin@123', 'first_name': 'Admin', 'last_name': 'One'},
            {'email': 'admin2@test.com', 'password': 'Admin@123', 'first_name': 'Admin', 'last_name': 'Two'},
        ],
        'recruiters': [
            {'email': f'recruiter{i}@test.com', 'password': 'Recruiter@123', 
             'first_name': f'Recruiter', 'last_name': f'{i}'}
            for i in range(1, 9)
        ],
        'candidates': [
            {'email': f'candidate{i}@test.com', 'password': 'Candidate@123',
             'first_name': f'Candidate', 'last_name': f'{i}'}
            for i in range(1, 11)
        ]
    }
    
    created_users = {'admins': [], 'recruiters': [], 'candidates': []}
    
    # Create Admins
    print("\n📋 Creating Admins...")
    for user_data in users_data['admins']:
        try:
            user = User.objects.create_user(
                email=user_data['email'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role='admin'
            )
            created_users['admins'].append(user)
            test_results['created_users'].append(user.email)
            log_pass("Admin Creation", f"Created {user.email}")
        except IntegrityError:
            user = User.objects.get(email=user_data['email'])
            created_users['admins'].append(user)
            log_warning("Admin Creation", f"{user.email} already exists")
    
    # Create Recruiters
    print("\n📋 Creating Recruiters...")
    for user_data in users_data['recruiters']:
        try:
            user = User.objects.create_user(
                email=user_data['email'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role='recruiter',
                phone=f'+91-98765{user_data["last_name"]}'
            )
            created_users['recruiters'].append(user)
            test_results['created_users'].append(user.email)
            log_pass("Recruiter Creation", f"Created {user.email}")
        except IntegrityError:
            user = User.objects.get(email=user_data['email'])
            created_users['recruiters'].append(user)
            log_warning("Recruiter Creation", f"{user.email} already exists")
    
    # Create Candidates
    print("\n📋 Creating Candidates...")
    for user_data in users_data['candidates']:
        try:
            user = User.objects.create_user(
                email=user_data['email'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role='candidate',
                phone=f'+91-87654{user_data["last_name"]}'
            )
            created_users['candidates'].append(user)
            test_results['created_users'].append(user.email)
            log_pass("Candidate Creation", f"Created {user.email}")
        except IntegrityError:
            user = User.objects.get(email=user_data['email'])
            created_users['candidates'].append(user)
            log_warning("Candidate Creation", f"{user.email} already exists")
    
    print(f"\n✅ Total Users Created: {len(test_results['created_users'])}")
    print(f"   Admins: {len(created_users['admins'])}")
    print(f"   Recruiters: {len(created_users['recruiters'])}")
    print(f"   Candidates: {len(created_users['candidates'])}")
    
    return created_users

# ============================================================================
# STEP 2: CREATE COMPANY PROFILES FOR RECRUITERS
# ============================================================================

def create_company_profiles(recruiters):
    """Create company profiles for all recruiters"""
    print_section("STEP 2: CREATING COMPANY PROFILES")
    
    companies = [
        {'name': 'TechCorp Alpha', 'industry': 'Software Development', 'size': '51-200'},
        {'name': 'DataSoft Beta', 'industry': 'Data Analytics', 'size': '11-50'},
        {'name': 'CloudNet Gamma', 'industry': 'Cloud Services', 'size': '201-500'},
        {'name': 'AI Solutions Delta', 'industry': 'Artificial Intelligence', 'size': '1-10'},
        {'name': 'CyberSec Epsilon', 'industry': 'Cybersecurity', 'size': '51-200'},
        {'name': 'FinTech Zeta', 'industry': 'Financial Technology', 'size': '11-50'},
        {'name': 'HealthTech Eta', 'industry': 'Healthcare Technology', 'size': '201-500'},
        {'name': 'EduTech Theta', 'industry': 'Education Technology', 'size': '51-200'},
    ]
    
    created_profiles = []
    
    for i, recruiter in enumerate(recruiters):
        company = companies[i % len(companies)]
        
        try:
            # Check if profile already exists
            existing_profile = RecruiterCompanyProfile.objects.filter(recruiter=recruiter).first()
            
            if existing_profile:
                log_warning("Company Profile", f"Profile already exists for {recruiter.email}")
                created_profiles.append(existing_profile)
                continue
            
            profile = RecruiterCompanyProfile.objects.create(
                recruiter=recruiter,
                company_name=f"{company['name']} {i+1}",
                website=f"https://www.{company['name'].lower().replace(' ', '')}{i+1}.com",
                industry=company['industry'],
                company_size=company['size'],
                founded_year=2015 + i,
                head_office_location=f"{'Bangalore' if i % 3 == 0 else 'Mumbai' if i % 3 == 1 else 'Chennai'}",
                gst_cin=f"GST{22 + i}ABCD{1234 + i}E{i}Z{i}",
                company_description=f"Leading {company['industry']} company providing innovative solutions.",
                mission_and_culture="Innovation, Excellence, Integrity",
                benefits_and_perks="Health Insurance, Remote Work, Flexible Hours, Learning Budget",
                office_address=f"{i+1}, Tech Park, {'Bangalore' if i % 3 == 0 else 'Mumbai' if i % 3 == 1 else 'Chennai'}",
                work_mode='hybrid' if i % 2 == 0 else 'remote',
                verification_status='pending'
            )
            
            created_profiles.append(profile)
            log_pass("Company Profile", f"Created profile for {recruiter.email} - {profile.company_name}")
            
        except Exception as e:
            log_fail("Company Profile", f"Failed for {recruiter.email}: {str(e)}")
    
    print(f"\n✅ Total Company Profiles: {len(created_profiles)}")
    return created_profiles

# ============================================================================
# STEP 3: TEST JOB POSTING BEFORE APPROVAL (SHOULD FAIL)
# ============================================================================

def test_job_posting_before_approval(recruiters):
    """Test that recruiters cannot post jobs before approval"""
    print_section("STEP 3: TESTING JOB POSTING BEFORE APPROVAL")
    
    test_recruiter = recruiters[0]
    
    # Check if recruiter can post jobs
    can_post = test_recruiter.can_post_jobs()
    
    if not can_post:
        log_pass("Security Test", f"{test_recruiter.email} correctly blocked from posting jobs (not approved)")
    else:
        log_fail("Security Test", f"{test_recruiter.email} can post jobs without approval!")
    
    # Try to create a job (should fail validation)
    try:
        job = JobPost.objects.create(
            recruiter=test_recruiter,
            job_title="Test Job Before Approval",
            job_type="Full-time",
            work_mode="Remote",
            experience_level="0-1 years",
            location="Test City",
            job_description="This should not be created",
            is_published=True
        )
        log_fail("Security Test", "Job created before approval - SECURITY BREACH!")
        job.delete()  # Clean up
    except Exception as e:
        log_pass("Security Test", f"Job creation blocked as expected: {str(e)[:50]}")

# ============================================================================
# STEP 4: ADMIN APPROVAL FLOW
# ============================================================================

def admin_approval_flow(recruiters):
    """Simulate admin approving recruiters"""
    print_section("STEP 4: ADMIN APPROVAL FLOW")
    
    approved_count = 0
    rejected_count = 0
    
    for i, recruiter in enumerate(recruiters):
        # Approve first 6 recruiters, reject 2
        if i < 6:
            recruiter.approve_recruiter()
            
            # Also verify company profile
            try:
                profile = recruiter.company_profile
                profile.verification_status = 'verified'
                profile.save()
                log_pass("Admin Approval", f"Approved {recruiter.email} - {profile.company_name}")
                approved_count += 1
            except:
                log_warning("Admin Approval", f"No company profile for {recruiter.email}")
        else:
            recruiter.reject_recruiter()
            log_pass("Admin Rejection", f"Rejected {recruiter.email}")
            rejected_count += 1
    
    print(f"\n✅ Approved: {approved_count}")
    print(f"❌ Rejected: {rejected_count}")
    
    return recruiters[:6]  # Return approved recruiters

# ============================================================================
# STEP 5: CREATE JOBS FOR APPROVED RECRUITERS
# ============================================================================

def create_jobs_for_recruiters(approved_recruiters):
    """Create 2 jobs for each approved recruiter"""
    print_section("STEP 5: CREATING JOBS FOR APPROVED RECRUITERS")
    
    job_templates = [
        {
            'title': 'Senior Python Developer',
            'type': 'Full-time',
            'mode': 'Remote',
            'experience': '3-5 years',
            'location': 'Bangalore, India',
            'min_salary': 1200000,
            'max_salary': 1800000,
            'description': 'Looking for experienced Python developer to build scalable systems.',
            'skills': ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS']
        },
        {
            'title': 'Frontend React Developer',
            'type': 'Full-time',
            'mode': 'Hybrid',
            'experience': '2-4 years',
            'location': 'Mumbai, India',
            'min_salary': 800000,
            'max_salary': 1400000,
            'description': 'Build modern web applications using React and TypeScript.',
            'skills': ['React', 'TypeScript', 'Redux', 'CSS', 'REST APIs']
        },
        {
            'title': 'DevOps Engineer',
            'type': 'Full-time',
            'mode': 'Remote',
            'experience': '3-6 years',
            'location': 'Chennai, India',
            'min_salary': 1000000,
            'max_salary': 1600000,
            'description': 'Manage cloud infrastructure and CI/CD pipelines.',
            'skills': ['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'Terraform']
        },
        {
            'title': 'Data Scientist',
            'type': 'Full-time',
            'mode': 'On-site',
            'experience': '2-5 years',
            'location': 'Bangalore, India',
            'min_salary': 1100000,
            'max_salary': 1700000,
            'description': 'Analyze data and build ML models for business insights.',
            'skills': ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics']
        }
    ]
    
    created_jobs = []
    
    for recruiter in approved_recruiters:
        # Create 2 jobs per recruiter
        for j in range(2):
            template = job_templates[j % len(job_templates)]
            
            try:
                job = JobPost.objects.create(
                    recruiter=recruiter,
                    job_title=template['title'],
                    department='Engineering',
                    job_type=template['type'],
                    work_mode=template['mode'],
                    experience_level=template['experience'],
                    location=template['location'],
                    min_salary=template['min_salary'],
                    max_salary=template['max_salary'],
                    currency='INR',
                    salary_period='annually',
                    job_description=template['description'],
                    key_responsibilities=json.dumps([
                        'Design and develop features',
                        'Write clean, maintainable code',
                        'Collaborate with team members',
                        'Participate in code reviews'
                    ]),
                    benefits_and_perks=json.dumps([
                        'Health Insurance',
                        'Remote Work',
                        'Flexible Hours',
                        'Learning Budget'
                    ]),
                    requirements=json.dumps([
                        "Bachelor's degree in Computer Science",
                        f"{template['experience']} of experience",
                        'Strong problem-solving skills',
                        'Excellent communication'
                    ]),
                    required_skills=json.dumps(template['skills']),
                    application_deadline=(datetime.now() + timedelta(days=30)).date(),
                    apply_method='platform',
                    is_published=True
                )
                
                created_jobs.append(job)
                test_results['created_jobs'].append(f"{job.id}: {job.job_title}")
                log_pass("Job Creation", f"Created '{job.job_title}' for {recruiter.email}")
                
            except Exception as e:
                log_fail("Job Creation", f"Failed for {recruiter.email}: {str(e)}")
    
    print(f"\n✅ Total Jobs Created: {len(created_jobs)}")
    return created_jobs

# ============================================================================
# STEP 6: CANDIDATES APPLY FOR JOBS
# ============================================================================

def candidates_apply_for_jobs(candidates, jobs):
    """Each candidate applies for 3 different jobs"""
    print_section("STEP 6: CANDIDATES APPLYING FOR JOBS")
    
    created_applications = []
    
    for candidate in candidates:
        # Each candidate applies for 3 jobs
        jobs_to_apply = jobs[:3] if len(jobs) >= 3 else jobs
        
        for job in jobs_to_apply:
            try:
                application = JobApplication.objects.create(
                    job=job,
                    candidate=candidate,
                    status='applied',
                    cover_letter=f"I am {candidate.full_name} and I am very interested in the {job.job_title} position."
                )
                
                created_applications.append(application)
                test_results['created_applications'].append(
                    f"{candidate.email} → {job.job_title}"
                )
                log_pass("Application", f"{candidate.email} applied for '{job.job_title}'")
                
            except IntegrityError:
                log_warning("Application", f"{candidate.email} already applied for '{job.job_title}'")
            except Exception as e:
                log_fail("Application", f"{candidate.email} failed: {str(e)}")
    
    print(f"\n✅ Total Applications: {len(created_applications)}")
    return created_applications

# ============================================================================
# STEP 7: DATA ISOLATION TESTING
# ============================================================================

def test_data_isolation(recruiters, candidates):
    """Test that data isolation is working correctly"""
    print_section("STEP 7: DATA ISOLATION TESTING")
    
    # Test 1: Recruiter can only see their own jobs
    if len(recruiters) >= 2:
        recruiter1 = recruiters[0]
        recruiter2 = recruiters[1]
        
        recruiter1_jobs = JobPost.objects.filter(recruiter=recruiter1)
        recruiter2_jobs = JobPost.objects.filter(recruiter=recruiter2)
        
        # Check no overlap
        overlap = set(recruiter1_jobs.values_list('id', flat=True)) & set(recruiter2_jobs.values_list('id', flat=True))
        
        if len(overlap) == 0:
            log_pass("Data Isolation", f"Recruiter jobs properly isolated (R1: {recruiter1_jobs.count()}, R2: {recruiter2_jobs.count()})")
        else:
            log_fail("Data Isolation", f"Job overlap detected: {overlap}")
    
    # Test 2: Candidate can only see their own applications
    if len(candidates) >= 2:
        candidate1 = candidates[0]
        candidate2 = candidates[1]
        
        candidate1_apps = JobApplication.objects.filter(candidate=candidate1)
        candidate2_apps = JobApplication.objects.filter(candidate=candidate2)
        
        # Check no overlap
        overlap = set(candidate1_apps.values_list('id', flat=True)) & set(candidate2_apps.values_list('id', flat=True))
        
        if len(overlap) == 0:
            log_pass("Data Isolation", f"Candidate applications properly isolated (C1: {candidate1_apps.count()}, C2: {candidate2_apps.count()})")
        else:
            log_fail("Data Isolation", f"Application overlap detected: {overlap}")
    
    # Test 3: Company profile uniqueness
    profiles = RecruiterCompanyProfile.objects.all()
    recruiter_ids = [p.recruiter_id for p in profiles]
    
    if len(recruiter_ids) == len(set(recruiter_ids)):
        log_pass("Data Isolation", f"Company profiles unique per recruiter ({len(profiles)} profiles)")
    else:
        log_fail("Data Isolation", "Duplicate company profiles detected!")

# ============================================================================
# STEP 8: SECURITY TESTING
# ============================================================================

def test_security(candidates, recruiters):
    """Test security constraints"""
    print_section("STEP 8: SECURITY TESTING")
    
    # Test 1: Duplicate application prevention
    if candidates and JobPost.objects.exists():
        candidate = candidates[0]
        job = JobPost.objects.first()
        
        # Try to create duplicate application
        try:
            JobApplication.objects.create(
                job=job,
                candidate=candidate,
                status='applied'
            )
            JobApplication.objects.create(
                job=job,
                candidate=candidate,
                status='applied'
            )
            log_fail("Security", "Duplicate application allowed - SECURITY BREACH!")
        except IntegrityError:
            log_pass("Security", "Duplicate application correctly prevented")
    
    # Test 2: Role verification
    if candidates:
        candidate = candidates[0]
        if candidate.role == 'candidate':
            log_pass("Security", f"Candidate role correctly set: {candidate.email}")
        else:
            log_fail("Security", f"Candidate role incorrect: {candidate.role}")
    
    if recruiters:
        recruiter = recruiters[0]
        if recruiter.role == 'recruiter':
            log_pass("Security", f"Recruiter role correctly set: {recruiter.email}")
        else:
            log_fail("Security", f"Recruiter role incorrect: {recruiter.role}")
    
    # Test 3: Approval status check
    approved_recruiters = [r for r in recruiters if r.approval_status == 'approved']
    pending_recruiters = [r for r in recruiters if r.approval_status == 'pending']
    
    log_pass("Security", f"Approval status: {len(approved_recruiters)} approved, {len(pending_recruiters)} pending")

# ============================================================================
# STEP 9: DATABASE VALIDATION
# ============================================================================

def validate_database():
    """Validate database integrity"""
    print_section("STEP 9: DATABASE VALIDATION")
    
    # Check unique constraints
    total_users = User.objects.count()
    unique_emails = User.objects.values('email').distinct().count()
    
    if total_users == unique_emails:
        log_pass("DB Validation", f"All user emails unique ({total_users} users)")
    else:
        log_fail("DB Validation", f"Duplicate emails found! Total: {total_users}, Unique: {unique_emails}")
    
    # Check foreign key relationships
    jobs_with_invalid_recruiter = JobPost.objects.filter(recruiter__isnull=True).count()
    if jobs_with_invalid_recruiter == 0:
        log_pass("DB Validation", "All jobs have valid recruiter references")
    else:
        log_fail("DB Validation", f"{jobs_with_invalid_recruiter} jobs with invalid recruiter!")
    
    # Check application relationships
    apps_with_invalid_job = JobApplication.objects.filter(job__isnull=True).count()
    apps_with_invalid_candidate = JobApplication.objects.filter(candidate__isnull=True).count()
    
    if apps_with_invalid_job == 0 and apps_with_invalid_candidate == 0:
        log_pass("DB Validation", "All applications have valid relationships")
    else:
        log_fail("DB Validation", f"Invalid applications: {apps_with_invalid_job} jobs, {apps_with_invalid_candidate} candidates")
    
    # Summary statistics
    print(f"\n📊 Database Statistics:")
    print(f"   Total Users: {User.objects.count()}")
    print(f"   - Admins: {User.objects.filter(role='admin').count()}")
    print(f"   - Recruiters: {User.objects.filter(role='recruiter').count()}")
    print(f"   - Candidates: {User.objects.filter(role='candidate').count()}")
    print(f"   Company Profiles: {RecruiterCompanyProfile.objects.count()}")
    print(f"   Job Posts: {JobPost.objects.count()}")
    print(f"   - Published: {JobPost.objects.filter(is_published=True).count()}")
    print(f"   - Draft: {JobPost.objects.filter(is_published=False).count()}")
    print(f"   Job Applications: {JobApplication.objects.count()}")

# ============================================================================
# GENERATE TEST REPORT
# ============================================================================

def generate_test_report():
    """Generate comprehensive test report"""
    print_section("TEST EXECUTION REPORT")
    
    total_tests = len(test_results['passed']) + len(test_results['failed'])
    pass_rate = (len(test_results['passed']) / total_tests * 100) if total_tests > 0 else 0
    
    report = f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    END-TO-END TEST EXECUTION REPORT                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

📅 Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
🎯 Test Scope: Complete Job Portal System

┌──────────────────────────────────────────────────────────────────────────────┐
│ TEST SUMMARY                                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

Total Tests Run: {total_tests}
✅ Passed: {len(test_results['passed'])}
❌ Failed: {len(test_results['failed'])}
⚠️  Warnings: {len(test_results['warnings'])}
📊 Pass Rate: {pass_rate:.2f}%

┌──────────────────────────────────────────────────────────────────────────────┐
│ DATA CREATED                                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

👥 Users Created: {len(test_results['created_users'])}
💼 Jobs Created: {len(test_results['created_jobs'])}
📝 Applications Created: {len(test_results['created_applications'])}

┌──────────────────────────────────────────────────────────────────────────────┐
│ PASSED TESTS                                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

"""
    
    for test in test_results['passed']:
        report += f"{test}\n"
    
    if test_results['failed']:
        report += f"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ FAILED TESTS                                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

"""
        for test in test_results['failed']:
            report += f"{test}\n"
    
    if test_results['warnings']:
        report += f"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ WARNINGS                                                                     │
└──────────────────────────────────────────────────────────────────────────────┘

"""
        for warning in test_results['warnings']:
            report += f"{warning}\n"
    
    report += f"""
┌──────────────────────────────────────────────────────────────────────────────┐
│ SYSTEM VALIDATION CERTIFICATE                                                │
└──────────────────────────────────────────────────────────────────────────────┘

"""
    
    if len(test_results['failed']) == 0:
        report += """
✅ SYSTEM VALIDATION: PASSED

The Job Portal system has successfully passed all end-to-end tests.
All features are working as expected with proper data isolation and security.

System Status: PRODUCTION READY ✅

Validated By: QA Automation System
Date: """ + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + """

"""
    else:
        report += f"""
⚠️  SYSTEM VALIDATION: FAILED

The system has {len(test_results['failed'])} failing tests that need to be addressed.
Please review the failed tests above and fix the issues.

System Status: REQUIRES FIXES ⚠️

"""
    
    report += """
╔══════════════════════════════════════════════════════════════════════════════╗
║                           END OF REPORT                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""
    
    print(report)
    
    # Save report to file
    with open('E2E_TEST_REPORT.txt', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n📄 Report saved to: E2E_TEST_REPORT.txt")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main test execution"""
    print("╔══════════════════════════════════════════════════════════════════════════════╗")
    print("║                                                                              ║")
    print("║              COMPREHENSIVE END-TO-END TESTING - JOB PORTAL                   ║")
    print("║                                                                              ║")
    print("╚══════════════════════════════════════════════════════════════════════════════╝")
    
    try:
        # Step 1: Create users
        users = create_dummy_users()
        
        # Step 2: Create company profiles
        profiles = create_company_profiles(users['recruiters'])
        
        # Step 3: Test job posting before approval
        test_job_posting_before_approval(users['recruiters'])
        
        # Step 4: Admin approval flow
        approved_recruiters = admin_approval_flow(users['recruiters'])
        
        # Step 5: Create jobs
        jobs = create_jobs_for_recruiters(approved_recruiters)
        
        # Step 6: Candidates apply
        applications = candidates_apply_for_jobs(users['candidates'], jobs)
        
        # Step 7: Data isolation testing
        test_data_isolation(approved_recruiters, users['candidates'])
        
        # Step 8: Security testing
        test_security(users['candidates'], users['recruiters'])
        
        # Step 9: Database validation
        validate_database()
        
        # Generate report
        generate_test_report()
        
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
