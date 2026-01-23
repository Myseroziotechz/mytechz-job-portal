"""
UI Route Verification Script
Tests that all frontend routes are properly configured and backend APIs are accessible
"""

import requests
import json
from datetime import datetime

# Configuration
BACKEND_URL = "http://127.0.0.1:5010"
FRONTEND_URL = "http://localhost:5173"

# Test results
results = {
    'backend_apis': [],
    'frontend_routes': [],
    'passed': 0,
    'failed': 0
}

def print_header(title):
    """Print section header"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)

def test_backend_api(method, endpoint, description, auth_required=False, token=None):
    """Test backend API endpoint"""
    url = f"{BACKEND_URL}{endpoint}"
    headers = {}
    
    if auth_required and token:
        headers['Authorization'] = f'Bearer {token}'
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=5)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json={}, timeout=5)
        else:
            response = requests.request(method, url, headers=headers, timeout=5)
        
        status = response.status_code
        
        if status in [200, 201, 400, 401, 403, 404]:  # Expected status codes
            print(f"✅ {method} {endpoint} - {description} (Status: {status})")
            results['backend_apis'].append({
                'endpoint': endpoint,
                'method': method,
                'status': status,
                'passed': True
            })
            results['passed'] += 1
            return True
        else:
            print(f"⚠️  {method} {endpoint} - {description} (Status: {status})")
            results['backend_apis'].append({
                'endpoint': endpoint,
                'method': method,
                'status': status,
                'passed': False
            })
            results['failed'] += 1
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ {method} {endpoint} - Connection failed (Backend not running?)")
        results['backend_apis'].append({
            'endpoint': endpoint,
            'method': method,
            'status': 'Connection Error',
            'passed': False
        })
        results['failed'] += 1
        return False
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)[:50]}")
        results['backend_apis'].append({
            'endpoint': endpoint,
            'method': method,
            'status': str(e)[:50],
            'passed': False
        })
        results['failed'] += 1
        return False

def test_frontend_route(route, description):
    """Test frontend route accessibility"""
    url = f"{FRONTEND_URL}{route}"
    
    try:
        response = requests.get(url, timeout=5)
        status = response.status_code
        
        if status == 200:
            print(f"✅ {route} - {description}")
            results['frontend_routes'].append({
                'route': route,
                'status': status,
                'passed': True
            })
            results['passed'] += 1
            return True
        else:
            print(f"⚠️  {route} - {description} (Status: {status})")
            results['frontend_routes'].append({
                'route': route,
                'status': status,
                'passed': False
            })
            results['failed'] += 1
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"❌ {route} - Connection failed (Frontend not running?)")
        results['frontend_routes'].append({
            'route': route,
            'status': 'Connection Error',
            'passed': False
        })
        results['failed'] += 1
        return False
    except Exception as e:
        print(f"❌ {route} - Error: {str(e)[:50]}")
        results['frontend_routes'].append({
            'route': route,
            'status': str(e)[:50],
            'passed': False
        })
        results['failed'] += 1
        return False

def get_auth_token():
    """Get authentication token for testing"""
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/auth/login",
            json={
                'email': 'candidate1@test.com',
                'password': 'Candidate@123'
            },
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            return data.get('access') or data.get('token')
        return None
    except:
        return None

def main():
    """Main test execution"""
    print("\n" + "="*80)
    print("  UI ROUTE & API VERIFICATION TEST")
    print("="*80)
    print(f"\nBackend URL: {BACKEND_URL}")
    print(f"Frontend URL: {FRONTEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test Backend APIs
    print_header("TESTING BACKEND APIs")
    
    print("\n📋 Public APIs (No Auth Required)")
    test_backend_api('GET', '/api/jobs/public', 'Get all published jobs')
    test_backend_api('GET', '/api/jobs/1', 'Get single job details')
    test_backend_api('POST', '/api/auth/register', 'User registration')
    test_backend_api('POST', '/api/auth/login', 'User login')
    
    print("\n📋 Protected APIs (Auth Required)")
    token = get_auth_token()
    if token:
        print(f"   Token obtained: {token[:20]}...")
        test_backend_api('POST', '/api/jobs/1/apply', 'Apply for job', True, token)
        test_backend_api('GET', '/api/recruiter/applications/my-applications', 'Get my applications', True, token)
    else:
        print("   ⚠️  Could not obtain auth token, skipping protected API tests")
    
    # Test Frontend Routes
    print_header("TESTING FRONTEND ROUTES")
    
    print("\n📋 Public Routes")
    test_frontend_route('/', 'Home page')
    test_frontend_route('/login', 'Login page')
    test_frontend_route('/register', 'Register page')
    test_frontend_route('/jobs/private', 'Jobs listing page')
    
    print("\n📋 Protected Routes (May redirect to login)")
    test_frontend_route('/profile', 'Profile page')
    test_frontend_route('/my-applications', 'My applications page')
    test_frontend_route('/recruiter', 'Recruiter dashboard')
    test_frontend_route('/recruiter/company-profile', 'Company profile page')
    test_frontend_route('/recruiter/post-job', 'Post job page')
    test_frontend_route('/dashboard/admin', 'Admin dashboard')
    
    # Generate Report
    print_header("TEST SUMMARY")
    
    total_tests = results['passed'] + results['failed']
    pass_rate = (results['passed'] / total_tests * 100) if total_tests > 0 else 0
    
    print(f"\nTotal Tests: {total_tests}")
    print(f"✅ Passed: {results['passed']}")
    print(f"❌ Failed: {results['failed']}")
    print(f"📊 Pass Rate: {pass_rate:.2f}%")
    
    print(f"\nBackend APIs Tested: {len(results['backend_apis'])}")
    print(f"Frontend Routes Tested: {len(results['frontend_routes'])}")
    
    if results['failed'] == 0:
        print("\n✅ ALL TESTS PASSED!")
        print("   Both servers are running and accessible.")
    else:
        print("\n⚠️  SOME TESTS FAILED")
        print("   Check if both servers are running:")
        print("   - Backend: python manage.py runserver 127.0.0.1:5010")
        print("   - Frontend: npm run dev")
    
    # Save report
    report = {
        'test_date': datetime.now().isoformat(),
        'backend_url': BACKEND_URL,
        'frontend_url': FRONTEND_URL,
        'summary': {
            'total': total_tests,
            'passed': results['passed'],
            'failed': results['failed'],
            'pass_rate': pass_rate
        },
        'backend_apis': results['backend_apis'],
        'frontend_routes': results['frontend_routes']
    }
    
    with open('UI_ROUTE_TEST_REPORT.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Report saved to: UI_ROUTE_TEST_REPORT.json")
    
    print("\n" + "="*80)
    print("  TEST COMPLETE")
    print("="*80)

if __name__ == '__main__':
    main()
