"""
Test the public jobs API endpoint
"""

import requests

def test_public_jobs_api():
    print("=" * 80)
    print("TESTING PUBLIC JOBS API ENDPOINT")
    print("=" * 80)
    
    url = "http://127.0.0.1:5010/api/jobs/public"
    
    print(f"\nTesting: {url}")
    
    try:
        response = requests.get(url, timeout=5)
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ SUCCESS!")
            print(f"Response data: {data}")
            
            if 'jobs' in data:
                jobs = data['jobs']
                print(f"\nTotal jobs returned: {len(jobs)}")
                
                for i, job in enumerate(jobs, 1):
                    print(f"\n--- Job {i} ---")
                    print(f"ID: {job.get('id')}")
                    print(f"Title: {job.get('job_title')}")
                    print(f"Company: {job.get('company_name')}")
                    print(f"Location: {job.get('location')}")
                    print(f"Type: {job.get('job_type')}")
            else:
                print("\n⚠️  No 'jobs' key in response")
        else:
            print(f"\n❌ ERROR: Status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend server")
        print("   Make sure the Django server is running:")
        print("   cd backend")
        print("   python manage.py runserver 127.0.0.1:5010")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == '__main__':
    test_public_jobs_api()
