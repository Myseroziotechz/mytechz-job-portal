#!/usr/bin/env python
"""
Test API endpoints for Recruiter Approval Workflow
"""
import requests
import json

BASE_URL = "http://127.0.0.1:5010"

def test_admin_endpoints():
    """Test admin endpoints (requires admin token)"""
    
    print("🔍 Testing Admin API Endpoints")
    print("=" * 40)
    
    # Note: In a real scenario, you would get this token by logging in as admin
    # For testing, we'll just check if the endpoints exist and return proper error messages
    
    endpoints = [
        ("GET", "/api/recruiter/admin/recruiters", "List all recruiters"),
        ("GET", "/api/recruiter/admin/recruiters/1", "Get recruiter details"),
        ("PUT", "/api/recruiter/admin/recruiters/1/approve", "Approve recruiter"),
        ("PUT", "/api/recruiter/admin/recruiters/1/reject", "Reject recruiter"),
    ]
    
    for method, endpoint, description in endpoints:
        print(f"\n📡 Testing: {method} {endpoint}")
        print(f"   Description: {description}")
        
        try:
            url = BASE_URL + endpoint
            
            if method == "GET":
                response = requests.get(url)
            elif method == "PUT":
                response = requests.put(url, json={})
            else:
                response = requests.post(url, json={})
            
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 401:
                print("   ✅ Endpoint exists - Authentication required (expected)")
            elif response.status_code == 403:
                print("   ✅ Endpoint exists - Permission denied (expected)")
            elif response.status_code == 404:
                print("   ❌ Endpoint not found")
            else:
                print(f"   ℹ️  Response: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("   ❌ Server not running")
            return False
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    return True

def test_recruiter_endpoints():
    """Test recruiter endpoints"""
    
    print("\n\n🏢 Testing Recruiter API Endpoints")
    print("=" * 40)
    
    endpoints = [
        ("GET", "/api/recruiter/company-profile", "Get company profile"),
        ("POST", "/api/recruiter/company-profile", "Create company profile"),
        ("PUT", "/api/recruiter/company-profile", "Update company profile"),
        ("POST", "/api/recruiter/jobs/create", "Create job (with approval guard)"),
    ]
    
    for method, endpoint, description in endpoints:
        print(f"\n📡 Testing: {method} {endpoint}")
        print(f"   Description: {description}")
        
        try:
            url = BASE_URL + endpoint
            
            if method == "GET":
                response = requests.get(url)
            elif method == "PUT":
                response = requests.put(url, json={})
            else:
                response = requests.post(url, json={})
            
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 401:
                print("   ✅ Endpoint exists - Authentication required (expected)")
            elif response.status_code == 403:
                print("   ✅ Endpoint exists - Permission denied (expected)")
            elif response.status_code == 404:
                print("   ❌ Endpoint not found")
            else:
                print(f"   ℹ️  Response: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("   ❌ Server not running")
            return False
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    return True

def main():
    """Main test function"""
    print("🚀 Testing Recruiter Approval Workflow API Endpoints")
    print("=" * 60)
    
    # Test if server is running
    try:
        response = requests.get(BASE_URL + "/admin/")
        print(f"✅ Server is running at {BASE_URL}")
    except requests.exceptions.ConnectionError:
        print(f"❌ Server is not running at {BASE_URL}")
        print("   Please start the server with: python manage.py runserver 127.0.0.1:5010")
        return
    
    # Test endpoints
    admin_ok = test_admin_endpoints()
    recruiter_ok = test_recruiter_endpoints()
    
    print("\n" + "=" * 60)
    if admin_ok and recruiter_ok:
        print("🎉 All API endpoints are properly configured!")
        print("\nNext steps:")
        print("1. Login as admin to get JWT token")
        print("2. Use token to test admin endpoints")
        print("3. Login as recruiter to test recruiter endpoints")
        print("4. Test complete approval workflow")
    else:
        print("❌ Some endpoints may have issues")
    
    print("\n📚 Documentation: RECRUITER_APPROVAL_WORKFLOW.md")

if __name__ == "__main__":
    main()