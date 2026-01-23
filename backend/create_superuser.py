#!/usr/bin/env python
"""
Script to create a superuser for the Job Portal
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

def create_superuser():
    """Create a superuser if it doesn't exist"""
    email = 'admin@jobportal.com'
    password = 'admin123'
    
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            email=email,
            password=password,
            first_name='Admin',
            last_name='User'
        )
        print(f"✅ Superuser created successfully!")
        print(f"📧 Email: {email}")
        print(f"🔑 Password: {password}")
    else:
        print("ℹ️ Superuser already exists")

if __name__ == '__main__':
    create_superuser()