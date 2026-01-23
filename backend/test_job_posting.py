#!/usr/bin/env python
"""
Test Job Posting API
"""
import os
import django
import requests
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User
from rest_framework_simplejwt.tokens import RefreshToken

# Get approved recruiter
recruiter = User.objects.get(email='spark@gmail.com')
print(f"Testing with recruiter: {recruiter.email}")
print(f"Approval status: {recruiter.approval_status}")
print(f"Can post jobs: {recruiter.can_post_jobs()}")

# Generate JWT token
refresh = RefreshToken.for_user(recruiter)
access_token = str(refresh.access_token)
print(f"\nGenerated JWT token: {access_token[:50]}...")

# Test data
test_job_data = {
    "title": "Senior Python Developer",
    "department": "Engineering",
    "jobType": "Full-time",
    "workMode": "Remote",
    "experience": "3-5 years",
    "location": "Mumbai, India",
    "salary": {
        "min": "1200000",
        "max": "1800000",
        "currency": "INR",
        "period": "annually"
    },
    "description": "We are looking for an experienced Python developer to join our team. You will work on building scalable backend systems.",
    "responsibilities": [
        "Design and develop backend APIs",
        "Write clean, maintainable code",
        "Collaborate with frontend team",
        "Participate in code reviews"
    ],
    "requirements": [
        "Bachelor's degree in Computer Science",
        "3+ years of Python experience",
        "Strong understanding of REST APIs",
        "Experience with Django or Flask"
    ],
    "skills": [
        "Python",
        "Django",
        "PostgreSQL",
        "Docker",
        "AWS"
    ],
    "benefits": [
        "Health Insurance",
        "Remote Work",
        "Flexible Hours",
        "Learning Budget"
    ],
    "applicationDeadline": "2026-02-28",
    "applicationMethod": "internal",
    "featuredJob": False,
    "jobStatus": "published"
}

print("\n" + "="*80)
print("TESTING JOB POSTING API")
print("="*80)
print(f"\nTest Data:")
print(json.dumps(test_job_data, indent=2))

# Make API request
url = "http://127.0.0.1:5010/api/recruiter/post-job"
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

print(f"\n\nSending POST request to: {url}")
print(f"Headers: Authorization: Bearer {access_token[:30]}...")

try:
    response = requests.post(url, json=test_job_data, headers=headers)
    
    print(f"\n{'='*80}")
    print(f"RESPONSE")
    print(f"{'='*80}")
    print(f"Status Code: {response.status_code}")
    print(f"Response Body:")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code == 201:
        print(f"\n✅ SUCCESS! Job created successfully!")
        job_data = response.json()
        if 'job' in job_data:
            print(f"\nJob ID: {job_data['job'].get('id')}")
            print(f"Job Title: {job_data['job'].get('job_title')}")
            print(f"Published: {job_data['job'].get('is_published')}")
    else:
        print(f"\n❌ FAILED! Status code: {response.status_code}")
        if 'errors' in response.json():
            print(f"\nValidation Errors:")
            for field, errors in response.json()['errors'].items():
                print(f"  - {field}: {errors}")
    
except requests.exceptions.ConnectionError:
    print("\n❌ ERROR: Could not connect to backend server")
    print("Make sure the backend is running on http://127.0.0.1:5010")
except Exception as e:
    print(f"\n❌ ERROR: {e}")

print("\n" + "="*80)
print("TEST COMPLETE")
print("="*80)
