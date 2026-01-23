# Test Credentials - Job Portal System

## 🔑 All Test User Credentials

---

## 👨‍💼 ADMINS (2 users)

### Admin 1
```
Email: admin1@test.com
Password: Admin@123
Role: admin
```

### Admin 2
```
Email: admin2@test.com
Password: Admin@123
Role: admin
```

---

## 💼 RECRUITERS (8 users)

### Recruiter 1 ✅ APPROVED
```
Email: recruiter1@test.com
Password: Recruiter@123
Role: recruiter
Company: TechCorp Alpha 1
Status: Approved
Can Post Jobs: YES
```

### Recruiter 2 ✅ APPROVED
```
Email: recruiter2@test.com
Password: Recruiter@123
Role: recruiter
Company: Another Tech Company
Status: Approved
Can Post Jobs: YES
```

### Recruiter 3 ✅ APPROVED
```
Email: recruiter3@test.com
Password: Recruiter@123
Role: recruiter
Company: CloudNet Gamma 3
Status: Approved
Can Post Jobs: YES
```

### Recruiter 4 ✅ APPROVED
```
Email: recruiter4@test.com
Password: Recruiter@123
Role: recruiter
Company: AI Solutions Delta 4
Status: Approved
Can Post Jobs: YES
```

### Recruiter 5 ✅ APPROVED
```
Email: recruiter5@test.com
Password: Recruiter@123
Role: recruiter
Company: CyberSec Epsilon 5
Status: Approved
Can Post Jobs: YES
```

### Recruiter 6 ✅ APPROVED
```
Email: recruiter6@test.com
Password: Recruiter@123
Role: recruiter
Company: FinTech Zeta 6
Status: Approved
Can Post Jobs: YES
```

### Recruiter 7 ❌ REJECTED
```
Email: recruiter7@test.com
Password: Recruiter@123
Role: recruiter
Company: HealthTech Eta 7
Status: Rejected
Can Post Jobs: NO
```

### Recruiter 8 ❌ REJECTED
```
Email: recruiter8@test.com
Password: Recruiter@123
Role: recruiter
Company: EduTech Theta 8
Status: Rejected
Can Post Jobs: NO
```

---

## 👨‍💻 CANDIDATES (10 users)

### Candidate 1
```
Email: candidate1@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 2
```
Email: candidate2@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 3
```
Email: candidate3@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 4
```
Email: candidate4@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 5
```
Email: candidate5@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 6
```
Email: candidate6@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 7
```
Email: candidate7@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 8
```
Email: candidate8@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 9
```
Email: candidate9@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

### Candidate 10
```
Email: candidate10@test.com
Password: Candidate@123
Role: candidate
Applications: 3 jobs
```

---

## 📊 Quick Stats

- **Total Users:** 20
- **Admins:** 2
- **Approved Recruiters:** 6
- **Rejected Recruiters:** 2
- **Candidates:** 10
- **Total Jobs Posted:** 12
- **Total Applications:** 30

---

## 🎯 Testing Scenarios

### Test Admin Functions
Login as: `admin1@test.com` / `Admin@123`
- View all recruiters
- Approve/reject recruiters
- View all jobs
- View all applications

### Test Approved Recruiter
Login as: `recruiter1@test.com` / `Recruiter@123`
- View company profile
- Post new jobs
- View posted jobs
- View applications for your jobs
- Update application status

### Test Rejected Recruiter
Login as: `recruiter7@test.com` / `Recruiter@123`
- View company profile
- Try to post job (should be blocked)
- See rejection status

### Test Candidate
Login as: `candidate1@test.com` / `Candidate@123`
- Browse jobs
- Apply for jobs
- View my applications
- Check application status

---

## 🔐 Security Notes

1. **All passwords follow the pattern:**
   - Admins: `Admin@123`
   - Recruiters: `Recruiter@123`
   - Candidates: `Candidate@123`

2. **Approval Status:**
   - Recruiters 1-6: Approved ✅
   - Recruiters 7-8: Rejected ❌

3. **Job Posting:**
   - Only approved recruiters can post jobs
   - Unapproved recruiters are blocked at model level

4. **Applications:**
   - Each candidate has applied for 3 jobs
   - Duplicate applications are prevented

---

## 🌐 Access URLs

**Frontend:** http://localhost:5173  
**Backend API:** http://127.0.0.1:5010  
**Admin Panel:** http://127.0.0.1:5010/admin

---

## 📝 Notes

- All users were created during E2E testing
- Company profiles are complete for all recruiters
- Jobs are published and visible
- Applications are tracked in database
- System is production-ready

---

**Last Updated:** January 21, 2026  
**Status:** ✅ All credentials verified and working
