#!/usr/bin/env python
"""
Test recruiter registration endpoint
"""
import requests
import json

BASE_URL = "http://127.0.0.1:5010"

def test_recruiter_registration():
    """Test the recruiter registration endpoint"""
    
    print("🧪 Testing Recruiter Registration Endpoint")
    print("=" * 50)
    
    # Test data matching frontend form
    test_data = {
        "companyEmail": "test.recruiter@testcompany.com",
        "companyName": "Test Company Ltd",
        "gstCin": "27AABCT1234C1Z5",
        "hrName": "John Doe",
        "hrRole": "HR Manager",
        "phone": "9876543210",
        "password": "testpass123",
        "confirmPassword": "testpass123",
        "role": "recruiter"
    }
    
    print("📤 Sending registration request...")
    print(f"Data: {json.dumps(test_data, indent=2)}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/recruiter-register",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"\n📥 Response Status: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 201 and response_data.get('success'):
                print("✅ Registration successful!")
                print(f"   User ID: {response_data['user']['id']}")
                print(f"   Email: {response_data['user']['email']}")
                print(f"   Name: {response_data['user']['full_name']}")
                print(f"   Role: {response_data['user']['role']}")
                
                # Clean up - delete the test user
                print("\n🧹 Cleaning up test user...")
                import os
                import django
                os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
                django.setup()
                
                from authentication.models import User
                try:
                    test_user = User.objects.get(email="test.recruiter@testcompany.com")
                    test_user.delete()
                    print("✅ Test user deleted")
                except User.DoesNotExist:
                    print("ℹ️  Test user not found (already deleted)")
                
            else:
                print("❌ Registration failed!")
                if 'errors' in response_data:
                    print("   Errors:")
                    for field, errors in response_data['errors'].items():
                        print(f"     {field}: {errors}")
                
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Server not running at http://127.0.0.1:5010")
        print("   Please start the server with: python manage.py runserver 127.0.0.1:5010")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_validation_errors():
    """Test validation error handling"""
    
    print("\n🧪 Testing Validation Error Handling")
    print("=" * 50)
    
    # Test with invalid data
    invalid_data = {
        "companyEmail": "invalid-email",  # Invalid email
        "companyName": "",  # Empty company name
        "hrName": "",  # Empty HR name
        "phone": "123",  # Invalid phone
        "password": "123",  # Weak password
        "confirmPassword": "456",  # Mismatched password
    }
    
    print("📤 Sending invalid registration request...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/recruiter-register",
            json=invalid_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📥 Response Status: {response.status_code}")
        
        if response.status_code == 400:
            response_data = response.json()
            print("✅ Validation errors properly returned:")
            print(f"   Message: {response_data.get('message')}")
            if 'errors' in response_data:
                for field, errors in response_data['errors'].items():
                    print(f"   {field}: {errors}")
        else:
            print(f"❌ Unexpected response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_recruiter_registration()
    test_validation_errors()