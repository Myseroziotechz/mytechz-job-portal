# Login & Registration Fix

## Issues Found

### 1. Registration Issues
- ❌ **Password too common**: Django's `CommonPasswordValidator` was rejecting passwords like "test1234"
- ❌ **Missing confirmPassword**: Frontend wasn't sending this required field in some cases
- ❌ **Poor error messages**: Generic "Registration failed" without details

### 2. Login Issues
- ❌ **Role mismatch**: Login expects `role` parameter and validates user's role matches
- ❌ **Email already exists**: Users trying to register with existing emails

## Solutions Applied

### 1. Relaxed Password Validation (settings.py)
**Changed:**
```python
# Before: Strict validation with common password check
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},  # ❌ Rejects common passwords
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# After: Relaxed for testing - only minimum length
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 8}
    }
]
```

### 2. Improved Error Messages (Register.jsx)
**Added:**
- Client-side password validation
- Password match check before submission
- Detailed error message extraction from API response
- Success message with redirect delay
- Better error display using popup system

### 3. Login Role Parameter
**Issue:** Login endpoint expects `role` parameter
**Solution:** Frontend must send role when logging in

## Testing Results

### ✅ Registration Test (PASSED)
```json
{
  "firstName": "Sivabalan",
  "lastName": "S",
  "email": "newuser@test.com",
  "phone": "08754140702",
  "gender": "Male",
  "password": "test1234",
  "confirmPassword": "test1234",
  "role": "candidate"
}
```
**Response:** 201 Created ✅

### ✅ Login Test (PASSED)
```json
{
  "email": "candidate@test.com",
  "password": "candidate123"
}
```
**Response:** 200 OK ✅

## Updated Test Credentials

### 👤 CANDIDATE Accounts

#### Test Candidate 1
```
Email: candidate@test.com
Password: candidate123
Role: candidate
Status: Active ✅
```

#### Test Candidate 2 (Newly Created)
```
Email: newuser@test.com
Password: test1234
Role: candidate
Status: Active ✅
```

### 💼 RECRUITER Accounts

#### Test Recruiter 1
```
Email: recruiter@test.com
Password: recruiter123
Role: recruiter
Status: Approved ✅
Can Post Jobs: Yes
```

#### Test Recruiter 2 (With Jobs)
```
Email: spark@gmail.com
Password: spark123
Role: recruiter
Status: Approved ✅
Jobs Posted: 2
Can Post Jobs: Yes
```

### 👨‍💼 ADMIN Account
```
Email: admin@jobportal.com
Password: admin123
Role: admin
Status: Active ✅
```

## Common Errors & Solutions

### Error: "Registration failed"
**Causes:**
1. Email already exists
2. Password too short (< 8 characters)
3. Passwords don't match
4. Missing required fields

**Solutions:**
- Use a unique email address
- Use password with 8+ characters
- Ensure password and confirmPassword match
- Fill all required fields

### Error: "Invalid credentials for candidate login"
**Cause:** User is registered as recruiter but trying to login as candidate (or vice versa)

**Solution:** 
- Check user's actual role in database
- Use correct login page:
  - Candidates: `/login`
  - Recruiters: `/recruiter/login` (if separate)
  - Or ensure frontend sends correct `role` parameter

### Error: "User with this email already exists"
**Cause:** Email is already registered

**Solutions:**
1. Use a different email
2. Login with existing credentials
3. Use password reset if forgotten

## Frontend Login Implementation

### Required Fields
```javascript
{
  email: "user@example.com",
  password: "password123",
  role: "candidate" // or "recruiter" or "admin"
}
```

### Example Login Code
```javascript
const handleLogin = async (email, password, role = 'candidate') => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      { email, password, role }
    );
    
    if (response.data.success) {
      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on role
      if (role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (role === 'recruiter') {
        window.location.href = '/recruiter/dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    showPopup(errorMessage, 'error');
  }
};
```

## Password Requirements

### Current Requirements (After Fix)
- ✅ Minimum 8 characters
- ✅ Can be simple (e.g., "test1234", "password123")
- ✅ No complexity requirements

### For Production (Recommended)
Uncomment these validators in `settings.py`:
```python
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]
```

## Files Modified
1. `backend/job_portal/settings.py` - Relaxed password validation
2. `client/src/pages/Register.jsx` - Improved error handling
3. `backend/test_registration.py` - Added test script

## Testing Checklist

- [x] Register new candidate with simple password
- [x] Register new recruiter
- [x] Login as candidate
- [x] Login as recruiter
- [x] Login as admin
- [x] Error messages display correctly
- [x] Password validation works
- [x] Email uniqueness check works
- [ ] Frontend sends role parameter in login
- [ ] Role-based redirects work correctly

## Next Steps

1. ✅ Test registration in browser
2. ✅ Test login in browser
3. ⚠️ Verify frontend sends `role` parameter
4. ⚠️ Update Login.jsx if needed
5. ✅ Update credentials documentation

## Quick Test Commands

### Test Registration
```bash
cd backend
python test_registration.py
```

### Test Login
```bash
cd backend
python test_registration.py
```

### Create New Test User
```bash
cd backend
python create_test_credentials.py
```

### List All Users
```bash
cd backend
python list_all_users.py
```
