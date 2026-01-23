# UI Flow Testing Guide - Job Portal

## 🎯 Testing Objective

Verify that every clickable element, form submission, and page navigation works correctly across all user roles.

---

## 🧪 Test Environment Setup

### Prerequisites
1. ✅ Backend server running on http://127.0.0.1:5010
2. ✅ Frontend server running on http://localhost:5173
3. ✅ Test users created (see TEST_CREDENTIALS.md)
4. ✅ Browser DevTools open (F12) to monitor:
   - Network tab (API calls)
   - Console tab (errors)

---

## 👤 CANDIDATE UI FLOW TESTING

### Test User
```
Email: candidate1@test.com
Password: Candidate@123
```

---

### 1. Home Page (Not Logged In)

**URL:** `http://localhost:5173/`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Click "Jobs" in navbar | Redirect to `/jobs/private` | GET /api/jobs/public | ⬜ |
| View job cards | Display 16 jobs | - | ⬜ |
| Click job card | Open job modal | - | ⬜ |
| Click "Apply" on card | Redirect to `/jobs/{id}/apply` | - | ⬜ |
| Click "Login" button | Redirect to `/login` | - | ⬜ |
| Click "Register" button | Redirect to `/register` | - | ⬜ |

---

### 2. Registration Page

**URL:** `http://localhost:5173/register`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Fill registration form | Form fields accept input | - | ⬜ |
| Click "Register" | Account created | POST /api/auth/register | ⬜ |
| Success message | "Registration successful" toast | - | ⬜ |
| Auto redirect | Redirect to `/login` | - | ⬜ |

**Test Data:**
```
First Name: Test
Last Name: Candidate
Email: testcandidate@test.com
Password: Test@123
Confirm Password: Test@123
Role: Candidate
```

---

### 3. Login Page

**URL:** `http://localhost:5173/login`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Enter credentials | Fields accept input | - | ⬜ |
| Click "Login" | Login successful | POST /api/auth/login | ⬜ |
| Token stored | localStorage has 'token' | - | ⬜ |
| User stored | localStorage has 'user' | - | ⬜ |
| Redirect | Go to `/dashboard/user` or `/` | - | ⬜ |
| Navbar updated | Shows "Profile", "Logout" | - | ⬜ |

---

### 4. Jobs Page (Logged In)

**URL:** `http://localhost:5173/jobs/private`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display all jobs | GET /api/jobs/public | ⬜ |
| Search jobs | Filter by keyword | - | ⬜ |
| Filter by location | Jobs filtered | - | ⬜ |
| Click "Apply" button | Redirect to `/jobs/{id}/apply` | - | ⬜ |
| Click job card | Open job modal | - | ⬜ |

---

### 5. Job Apply Page

**URL:** `http://localhost:5173/jobs/{id}/apply`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display full job details | GET /api/jobs/{id} | ⬜ |
| Job title visible | Shows correct title | - | ⬜ |
| Company name visible | Shows correct company | - | ⬜ |
| Description visible | Shows full description | - | ⬜ |
| Skills visible | Shows skill tags | - | ⬜ |
| Benefits visible | Shows benefits grid | - | ⬜ |
| Click "Apply Now" | Open cover letter modal | - | ⬜ |
| Enter cover letter | Text area accepts input | - | ⬜ |
| Click "Submit" | Application submitted | POST /api/jobs/{id}/apply | ⬜ |
| Success message | "Application submitted!" | - | ⬜ |
| Button changes | Shows "Applied" (green) | - | ⬜ |
| Button disabled | Cannot apply again | - | ⬜ |
| Redirect | Go to `/my-applications` | - | ⬜ |

---

### 6. My Applications Page

**URL:** `http://localhost:5173/my-applications`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display all applications | GET /api/recruiter/applications/my-applications | ⬜ |
| Application cards | Show job title, company | - | ⬜ |
| Status badge | Show "Applied" status | - | ⬜ |
| Applied date | Show application date | - | ⬜ |
| Filter by status | Filter applications | - | ⬜ |
| Search | Search by job title | - | ⬜ |
| Click application | View details | - | ⬜ |

---

### 7. Profile Page

**URL:** `http://localhost:5173/profile`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display profile data | GET /api/auth/profile | ⬜ |
| Edit profile | Form fields editable | - | ⬜ |
| Update info | Save changes | PUT /api/auth/profile | ⬜ |
| Upload resume | File upload works | POST /api/resume/upload | ⬜ |
| Success message | "Profile updated" | - | ⬜ |

---

## 💼 RECRUITER UI FLOW TESTING

### Test User
```
Email: recruiter1@test.com
Password: Recruiter@123
```

---

### 1. Recruiter Dashboard

**URL:** `http://localhost:5173/recruiter`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display dashboard | - | ⬜ |
| Stats visible | Show job count, applications | - | ⬜ |
| Click "Company Profile" | Redirect to `/recruiter/company-profile` | - | ⬜ |
| Click "Post Job" | Redirect to `/recruiter/post-job` | - | ⬜ |
| Click "Posted Jobs" | Redirect to `/recruiter/posted-jobs` | - | ⬜ |
| Click "Applications" | View applications | - | ⬜ |

---

### 2. Company Profile Page

**URL:** `http://localhost:5173/recruiter/company-profile`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display profile form | GET /api/recruiter/company-profile | ⬜ |
| Form fields | Pre-filled with data | - | ⬜ |
| Edit company name | Field accepts input | - | ⬜ |
| Edit website | Field accepts input | - | ⬜ |
| Edit industry | Dropdown works | - | ⬜ |
| Edit company size | Dropdown works | - | ⬜ |
| Edit location | Field accepts input | - | ⬜ |
| Click "Save" | Profile updated | PUT /api/recruiter/company-profile | ⬜ |
| Success message | "Profile updated" | - | ⬜ |
| Verification status | Shows current status | - | ⬜ |

---

### 3. Post Job Page

**URL:** `http://localhost:5173/recruiter/post-job`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display job form | - | ⬜ |
| Enter job title | Field accepts input | - | ⬜ |
| Select job type | Dropdown works | - | ⬜ |
| Select work mode | Dropdown works | - | ⬜ |
| Enter location | Field accepts input | - | ⬜ |
| Enter salary | Fields accept numbers | - | ⬜ |
| Enter description | Textarea accepts input | - | ⬜ |
| Add responsibilities | Dynamic list works | - | ⬜ |
| Add requirements | Dynamic list works | - | ⬜ |
| Add skills | Tag input works | - | ⬜ |
| Add benefits | Dynamic list works | - | ⬜ |
| Click "Publish" | Job created | POST /api/recruiter/post-job | ⬜ |
| Success message | "Job published!" | - | ⬜ |
| Redirect | Go to `/recruiter/posted-jobs` | - | ⬜ |

---

### 4. Posted Jobs Page

**URL:** `http://localhost:5173/recruiter/posted-jobs`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display all jobs | GET /api/recruiter/jobs/my-jobs | ⬜ |
| Job cards | Show title, location, date | - | ⬜ |
| Application count | Show number of applicants | - | ⬜ |
| Click "View" | View job details | - | ⬜ |
| Click "Edit" | Edit job | - | ⬜ |
| Click "Delete" | Delete job | DELETE /api/recruiter/jobs/{id} | ⬜ |
| Click "View Applications" | View applicants | - | ⬜ |

---

### 5. Applications Page

**URL:** `http://localhost:5173/recruiter/applications`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display applications | GET /api/recruiter/applications/recruiter | ⬜ |
| Application cards | Show candidate info | - | ⬜ |
| Status badge | Show current status | - | ⬜ |
| Filter by job | Filter applications | - | ⬜ |
| Filter by status | Filter applications | - | ⬜ |
| Click application | View details | - | ⬜ |
| Click "Shortlist" | Update status | PUT /api/recruiter/applications/{id}/update-status | ⬜ |
| Click "Reject" | Update status | PUT /api/recruiter/applications/{id}/update-status | ⬜ |
| Download resume | Download file | - | ⬜ |

---

## 👨‍💼 ADMIN UI FLOW TESTING

### Test User
```
Email: admin1@test.com
Password: Admin@123
```

---

### 1. Admin Dashboard

**URL:** `http://localhost:5173/dashboard/admin`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display dashboard | - | ⬜ |
| Stats visible | Show total users, jobs | - | ⬜ |
| Click "Recruiters" | View recruiter list | - | ⬜ |
| Click "Jobs" | View all jobs | - | ⬜ |
| Click "Applications" | View all applications | - | ⬜ |

---

### 2. Recruiter Management

**URL:** `http://localhost:5173/admin/recruiters`

| Action | Expected Result | API Call | Status |
|--------|----------------|----------|--------|
| Page loads | Display recruiters | GET /api/recruiter/admin/recruiters | ⬜ |
| Recruiter cards | Show name, email, status | - | ⬜ |
| Filter by status | Filter recruiters | - | ⬜ |
| Click recruiter | View details | - | ⬜ |
| Click "Approve" | Approve recruiter | PUT /api/recruiter/admin/recruiters/{id}/approve | ⬜ |
| Click "Reject" | Reject recruiter | PUT /api/recruiter/admin/recruiters/{id}/reject | ⬜ |
| Success message | "Recruiter approved" | - | ⬜ |
| Status updated | Badge shows "Approved" | - | ⬜ |

---

## 🔍 NAVIGATION TESTING

### Test All Routes

| Route | Expected Page | Auth Required | Status |
|-------|--------------|---------------|--------|
| `/` | Home page | No | ⬜ |
| `/login` | Login page | No | ⬜ |
| `/register` | Register page | No | ⬜ |
| `/jobs/private` | Jobs listing | No | ⬜ |
| `/jobs/{id}/apply` | Job apply page | No | ⬜ |
| `/profile` | User profile | Yes | ⬜ |
| `/my-applications` | Applications list | Yes (Candidate) | ⬜ |
| `/recruiter` | Recruiter dashboard | Yes (Recruiter) | ⬜ |
| `/recruiter/company-profile` | Company profile | Yes (Recruiter) | ⬜ |
| `/recruiter/post-job` | Post job form | Yes (Recruiter) | ⬜ |
| `/recruiter/posted-jobs` | Posted jobs | Yes (Recruiter) | ⬜ |
| `/dashboard/admin` | Admin dashboard | Yes (Admin) | ⬜ |

---

## 🔗 API INTEGRATION TESTING

### Verify API Calls

For each action, verify in Network tab:

1. **Request sent** - Check URL, method, headers
2. **Payload correct** - Check request body
3. **Response received** - Check status code (200, 201, etc.)
4. **Data parsed** - Check response body
5. **UI updated** - Check state changes

---

## 🎨 UI STATE TESTING

### Loading States

| Scenario | Expected UI | Status |
|----------|------------|--------|
| Page loading | Spinner visible | ⬜ |
| Form submitting | Button shows "Loading..." | ⬜ |
| Data fetching | Skeleton loaders | ⬜ |

### Error States

| Scenario | Expected UI | Status |
|----------|------------|--------|
| API error | Error message shown | ⬜ |
| Network error | "Connection failed" | ⬜ |
| Validation error | Field error messages | ⬜ |
| 404 error | "Not found" page | ⬜ |

### Empty States

| Scenario | Expected UI | Status |
|----------|------------|--------|
| No jobs | "No jobs available" | ⬜ |
| No applications | "No applications yet" | ⬜ |
| No results | "No results found" | ⬜ |

### Success States

| Scenario | Expected UI | Status |
|----------|------------|--------|
| Form submitted | Success toast | ⬜ |
| Data saved | "Saved successfully" | ⬜ |
| Application submitted | "Applied successfully" | ⬜ |

---

## 🐛 BUG TRACKING

### Bug Report Template

```
Bug ID: BUG-001
Severity: High/Medium/Low
Page: /jobs/1/apply
Action: Click "Apply Now"
Expected: Application submitted
Actual: Error 500
API: POST /api/jobs/1/apply
Error: "Recruiter not approved"
Fix: Add approval check
Status: Fixed/Pending
```

---

## ✅ TEST CHECKLIST

### General UI
- [ ] All buttons clickable
- [ ] All links working
- [ ] All forms submittable
- [ ] All modals open/close
- [ ] All dropdowns work
- [ ] All inputs accept data

### Navigation
- [ ] All routes accessible
- [ ] Protected routes redirect to login
- [ ] Role-based routes work
- [ ] Back button works
- [ ] Breadcrumbs work

### API Integration
- [ ] All API calls successful
- [ ] All payloads correct
- [ ] All responses handled
- [ ] All errors caught
- [ ] All loading states shown

### UX
- [ ] No broken links
- [ ] No blank pages
- [ ] No console errors
- [ ] No layout breaks
- [ ] No infinite loading
- [ ] Responsive on mobile
- [ ] Dark mode works

---

## 📊 TEST EXECUTION REPORT

### Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Blocked: ___
- Pass Rate: ___%

### Critical Issues
1. ___
2. ___
3. ___

### Medium Issues
1. ___
2. ___

### Low Issues
1. ___
2. ___

---

## 🎯 TESTING INSTRUCTIONS

### How to Test

1. **Open browser** - Chrome/Firefox with DevTools
2. **Start servers** - Backend + Frontend
3. **Open Network tab** - Monitor API calls
4. **Open Console tab** - Monitor errors
5. **Follow test steps** - Check each action
6. **Mark status** - ✅ Pass, ❌ Fail, ⚠️ Warning
7. **Log bugs** - Document issues
8. **Retest fixes** - Verify fixes work

### Testing Tips

- Test in incognito mode (clean state)
- Clear localStorage between tests
- Test with different screen sizes
- Test with slow network (throttling)
- Test with disabled JavaScript
- Test with screen reader
- Test keyboard navigation

---

## 📝 FINAL DELIVERABLES

1. ✅ Completed test checklist
2. ✅ Bug report with screenshots
3. ✅ API call logs
4. ✅ Console error logs
5. ✅ Navigation map
6. ✅ Fix recommendations

---

**Tester:** _______________  
**Date:** _______________  
**Status:** ⬜ In Progress / ⬜ Complete
