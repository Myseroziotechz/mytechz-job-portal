"""
Simple wrapper to run E2E test with proper encoding
"""
import os
import sys

# Set UTF-8 encoding for Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')

# Import and run the test
import django
django.setup()

# Now run the actual test
exec(open('comprehensive_e2e_test.py', encoding='utf-8').read())
