#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

print("Existing users:")
for user in User.objects.all():
    print(f"- {user.email} (ID: {user.id})")

print(f"\nTotal users: {User.objects.count()}")