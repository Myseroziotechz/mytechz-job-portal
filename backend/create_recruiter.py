#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

# Create demo recruiter account
email = 'recruiter@demo.com'
password = 'demo123'

try:
    # Check if recruiter already exists
    if User.objects.filter(email=email).exists():
        print(f"Recruiter {email} already exists!")
        user = User.objects.get(email=email)
        user.set_password(password)
        user.role = 'recruiter'
        user.save()
        print(f"Updated password and role for {email}")
    else:
        # Create new recruiter
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name='Demo',
            last_name='Recruiter',
            phone='1234567890',
            role='recruiter'
        )
        print(f"✅ Created recruiter: {email}")
    
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    print(f"👤 Role: {user.role}")
    print(f"📛 Name: {user.full_name}")
    
except Exception as e:
    print(f"❌ Error creating recruiter: {e}")