#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

# Reset password for sivabalan.data@gmail.com
email = 'sivabalan.data@gmail.com'
new_password = 'testpass123'

try:
    user = User.objects.get(email=email)
    user.set_password(new_password)
    user.save()
    print(f"✅ Password reset for: {email}")
    print(f"New password: {new_password}")
    print("You can now login with this password!")
except User.DoesNotExist:
    print(f"❌ User not found: {email}")