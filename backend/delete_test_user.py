#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

# Delete the test user
email = 'sivabalan.dataworker@gmail.com'
try:
    user = User.objects.get(email=email)
    user.delete()
    print(f"✅ Deleted user: {email}")
except User.DoesNotExist:
    print(f"❌ User not found: {email}")

print("\nRemaining users:")
for user in User.objects.all():
    print(f"- {user.email}")