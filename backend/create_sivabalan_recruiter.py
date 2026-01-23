#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

# Create recruiter account with the email from screenshot
email = 'sivabalan.dataworr@gmail.com'
password = 'demo123'

try:
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        print(f"User {email} already exists!")
        user = User.objects.get(email=email)
        user.set_password(password)
        user.role = 'recruiter'
        user.first_name = 'Sivabalan'
        user.last_name = 'S'
        user.save()
        print(f"Updated to recruiter role for {email}")
    else:
        # Create new recruiter
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name='Sivabalan',
            last_name='S',
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