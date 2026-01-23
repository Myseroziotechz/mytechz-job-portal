#!/usr/bin/env python
"""
Test registration endpoint to see detailed errors
"""
import requests
import json

BASE_URL = "http://127.0.0.1:5010"

print("=" * 80)
print("TESTING REGISTRATION ENDPOINT")
print("=" * 80)

# Test data from the screenshot
test_data = {
    "firstName": "Sivabalan",
    "lastName": "S",
    "email": "newuser@test.com",  # Use new email
    "phone": "08754140702",
    "gender": "Male",
    "password": "test1234",
    "confirmPassword": "test1234",  # Add confirmPassword
    "role": "candidate"
}

print("\n📤 Sending registration request...")
print(f"URL: {BASE_URL}/api/auth/register")
print(f"Data: {json.dumps(test_data, indent=2)}")

try:
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\n📥 Response Status: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    try:
        response_data = response.json()
        print(f"\n📋 Response Data:")
        print(json.dumps(response_data, indent=2))
    except:
        print(f"\n📋 Response Text:")
        print(response.text)
    
    if response.status_code == 201:
        print("\n✅ Registration successful!")
    else:
        print("\n❌ Registration failed!")
        
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "=" * 80)

# Also test login
print("\nTESTING LOGIN ENDPOINT")
print("=" * 80)

login_data = {
    "email": "candidate@test.com",
    "password": "candidate123"
}

print(f"\n📤 Sending login request...")
print(f"Data: {json.dumps(login_data, indent=2)}")

try:
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\n📥 Response Status: {response.status_code}")
    
    try:
        response_data = response.json()
        print(f"\n📋 Response Data:")
        print(json.dumps(response_data, indent=2))
    except:
        print(f"\n📋 Response Text:")
        print(response.text)
    
    if response.status_code == 200:
        print("\n✅ Login successful!")
    else:
        print("\n❌ Login failed!")
        
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "=" * 80)
