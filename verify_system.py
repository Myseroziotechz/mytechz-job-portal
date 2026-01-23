#!/usr/bin/env python3
"""
System Verification Script
Verifies that the job portal system is running correctly
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://127.0.0.1:5010"
FRONTEND_URL = "http://localhost:5173"

# Colors for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_header(text):
    """Print section header"""
    print(f"\n{BLUE}{'=' * 80}{RESET}")
    print(f"{BLUE}{text.center(80)}{RESET}")
    print(f"{BLUE}{'=' * 80}{RESET}\n")

def print_success(text):
    """Print success message"""
    print(f"{GREEN}✅ {text}{RESET}")

def print_error(text):
    """Print error message"""
    print(f"{RED}❌ {text}{RESET}")

def print_info(text):
    """Print info message"""
    print(f"{YELLOW}ℹ️  {text}{RESET}")

def check_server(url, name):
    """Check if server is running"""
    try:
        response = requests.get(url, timeout=5)
        if response.status_code < 500:
            print_success(f"{name} is running at {url}")
            return True
        else:
            print_error(f"{name} returned error: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error(f"{name} is not running at {url}")
        return False
    except Exception as e:
        print_error(f"Error checking {name}: {str(e)}")
        return False

def test_endpoint(method, endpoint, name, expected_status=200, data=None, headers=None):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=5)
        else:
            print_error(f"Unsupported method: {method}")
            return False
        
        if response.status_code == expected_status:
            print_success(f"{name}: {method} {endpoint} - Status {response.status_code}")
            return True
        else:
            print_error(f"{name}: {method} {endpoint} - Expected {expected_status}, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"{name}: {str(e)}")
        return False

def verify_database():
    """Verify database statistics"""
    try:
        # Get public jobs
        response = requests.get(f"{BASE_URL}/api/jobs/public", timeout=5)
        if response.status_code == 200:
            data = response.json()
            job_count = data.get('count', 0)
            print_success(f"Database: {job_count} published jobs found")
            return True
        else:
            print_error(f"Failed to fetch jobs: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Database verification failed: {str(e)}")
        return False

def test_authentication():
    """Test authentication endpoints"""
    print_header("Testing Authentication")
    
    # Test login with candidate credentials
    login_data = {
        "email": "candidate1@test.com",
        "password": "Candidate@123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=login_data,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('token'):
                print_success("Authentication: Login successful")
                print_info(f"User: {data.get('user', {}).get('email')}")
                print_info(f"Role: {data.get('user', {}).get('role')}")
                return data.get('token')
            else:
                print_error("Authentication: Login failed - No token received")
                return None
        else:
            print_error(f"Authentication: Login failed - Status {response.status_code}")
            return None
    except Exception as e:
        print_error(f"Authentication test failed: {str(e)}")
        return None

def test_job_application_flow(token):
    """Test job application flow"""
    print_header("Testing Job Application Flow")
    
    if not token:
        print_error("No authentication token available")
        return False
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Get first job
    try:
        response = requests.get(f"{BASE_URL}/api/jobs/public", timeout=5)
        if response.status_code == 200:
            jobs = response.json().get('jobs', [])
            if jobs:
                job_id = jobs[0]['id']
                print_success(f"Found job: {jobs[0]['job_title']} (ID: {job_id})")
                
                # Check application status
                response = requests.get(
                    f"{BASE_URL}/api/jobs/{job_id}/check-status",
                    headers=headers,
                    timeout=5
                )
                
                if response.status_code == 200:
                    data = response.json()
                    has_applied = data.get('has_applied', False)
                    if has_applied:
                        print_info(f"Already applied to this job")
                    else:
                        print_info(f"Not yet applied to this job")
                    return True
                else:
                    print_error(f"Failed to check application status: {response.status_code}")
                    return False
            else:
                print_error("No jobs found")
                return False
        else:
            print_error(f"Failed to fetch jobs: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Job application flow test failed: {str(e)}")
        return False

def main():
    """Main verification function"""
    print_header("JOB PORTAL SYSTEM VERIFICATION")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {
        'passed': 0,
        'failed': 0
    }
    
    # Check servers
    print_header("Server Status")
    if check_server(f"{BASE_URL}/api/jobs/public", "Backend Server"):
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    if check_server(FRONTEND_URL, "Frontend Server"):
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    # Verify database
    print_header("Database Verification")
    if verify_database():
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    # Test API endpoints
    print_header("API Endpoint Tests")
    
    endpoints = [
        ("GET", "/api/jobs/public", "Public Jobs", 200),
    ]
    
    for method, endpoint, name, expected_status in endpoints:
        if test_endpoint(method, endpoint, name, expected_status):
            results['passed'] += 1
        else:
            results['failed'] += 1
    
    # Test authentication
    token = test_authentication()
    if token:
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    # Test job application flow
    if test_job_application_flow(token):
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    # Print summary
    print_header("VERIFICATION SUMMARY")
    total = results['passed'] + results['failed']
    pass_rate = (results['passed'] / total * 100) if total > 0 else 0
    
    print(f"Total Tests: {total}")
    print(f"Passed: {GREEN}{results['passed']}{RESET}")
    print(f"Failed: {RED}{results['failed']}{RESET}")
    print(f"Pass Rate: {GREEN if pass_rate == 100 else YELLOW}{pass_rate:.1f}%{RESET}")
    
    if results['failed'] == 0:
        print(f"\n{GREEN}{'=' * 80}{RESET}")
        print(f"{GREEN}{'✅ ALL TESTS PASSED - SYSTEM IS OPERATIONAL'.center(80)}{RESET}")
        print(f"{GREEN}{'=' * 80}{RESET}\n")
    else:
        print(f"\n{RED}{'=' * 80}{RESET}")
        print(f"{RED}{'❌ SOME TESTS FAILED - CHECK ERRORS ABOVE'.center(80)}{RESET}")
        print(f"{RED}{'=' * 80}{RESET}\n")
    
    print_info("Frontend: http://localhost:5173")
    print_info("Backend: http://127.0.0.1:5010")
    print_info("Test Credentials: See TEST_CREDENTIALS.md")
    
    return results['failed'] == 0

if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n{YELLOW}Verification interrupted by user{RESET}")
        exit(1)
    except Exception as e:
        print(f"\n{RED}Verification failed with error: {str(e)}{RESET}")
        exit(1)
