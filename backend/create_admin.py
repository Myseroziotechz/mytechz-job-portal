#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

# Create admin user
email = 'admin@jobportal.com'
password = 'admin123'

try:
    # Check if admin already exists
    if User.objects.filter(email=email).exists():
        print(f"Admin {email} already exists!")
        user = User.objects.get(email=email)
        user.set_password(password)
        user.role = 'admin'
        user.is_staff = True
        user.is_superuser = True
        user.save()
        print(f"Updated admin credentials for {email}")
    else:
        # Create new admin
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name='Admin',
            last_name='User',
            phone='1234567890',
            role='admin',
            is_staff=True,
            is_superuser=True
        )
        print(f"✅ Created admin: {email}")
    
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    print(f"👤 Role: {user.role}")
    print(f"📛 Name: {user.full_name}")
    print(f"🔧 Staff: {user.is_staff}")
    print(f"🔧 Superuser: {user.is_superuser}")
    
except Exception as e:
    print(f"❌ Error creating admin: {e}")