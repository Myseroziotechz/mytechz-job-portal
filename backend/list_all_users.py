#!/usr/bin/env python
"""
List all users in the database with their credentials info
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

print("=" * 80)
print("ALL USERS IN DATABASE")
print("=" * 80)

users = User.objects.all().order_by('role', 'email')

if users.count() == 0:
    print("\n❌ No users found in database!")
else:
    print(f"\nTotal users: {users.count()}\n")
    
    # Group by role
    roles = ['admin', 'recruiter', 'candidate']
    
    for role in roles:
        role_users = users.filter(role=role)
        if role_users.count() > 0:
            print(f"\n{'='*80}")
            print(f"{role.upper()}S ({role_users.count()})")
            print(f"{'='*80}")
            
            for user in role_users:
                print(f"\n📧 Email: {user.email}")
                print(f"   Name: {user.full_name}")
                print(f"   Role: {user.role}")
                
                if role == 'recruiter':
                    print(f"   Approval Status: {user.approval_status}")
                    print(f"   Profile Completed: {user.profile_completed}")
                    print(f"   Can Post Jobs: {user.can_post_jobs()}")
                    
                    # Check if has company profile
                    try:
                        profile = user.company_profile
                        print(f"   Company: {profile.company_name}")
                    except:
                        print(f"   Company: No profile")
                
                print(f"   Created: {user.created_at.strftime('%Y-%m-%d %H:%M')}")
                print(f"   Active: {user.is_active}")
                print("-" * 80)

print("\n" + "=" * 80)
print("NOTE: Passwords are hashed and cannot be displayed")
print("Use the credentials from your registration or reset password")
print("=" * 80)
