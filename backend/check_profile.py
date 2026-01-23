#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

# Check specific user profile
email = 'sivabalan.data@gmail.com'
try:
    user = User.objects.get(email=email)
    print(f"✅ User found: {user.email} (ID: {user.id})")
    print(f"📝 Profile Data:")
    print(f"   First Name: {user.first_name}")
    print(f"   Last Name: {user.last_name}")
    print(f"   Phone: {user.phone}")
    print(f"   Gender: {user.gender}")
    print(f"   Date of Birth: {user.date_of_birth}")
    print(f"   Address: {user.address}")
    print(f"   City: {user.city}")
    print(f"   State: {user.state}")
    print(f"   Pincode: {user.pincode}")
    print(f"   Bio: {user.bio}")
    print(f"   Skills: {user.skills}")
    print(f"   Experience: {user.experience}")
    print(f"   Education: {user.education}")
    print(f"   LinkedIn: {user.linkedin_url}")
    print(f"   GitHub: {user.github_url}")
    print(f"   Portfolio: {user.portfolio_url}")
    print(f"   Created: {user.created_at}")
    print(f"   Updated: {user.updated_at}")
except User.DoesNotExist:
    print(f"❌ User not found: {email}")