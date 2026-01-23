# How to Start the Job Portal

## ⚠️ IMPORTANT: You need BOTH servers running!

The job portal requires **TWO servers** to work:
1. **Backend Server** (Django) - Port 5010
2. **Frontend Server** (React) - Port 5173

---

## 🚀 Quick Start (Easiest Method)

### Option 1: Use the Batch File
Double-click: **`START_SERVERS.bat`**

This will automatically start both servers in separate windows.

---

## 🔧 Manual Start (If batch file doesn't work)

### Step 1: Start Backend Server

Open **Terminal 1** (Command Prompt or PowerShell):
```bash
cd backend
python manage.py runserver 127.0.0.1:5010
```

**Wait for this message:**
```
Starting development server at http://127.0.0.1:5010/
Quit the server with CTRL-BREAK.
```

✅ Backend is running!

---

### Step 2: Start Frontend Server

Open **Terminal 2** (New window):
```bash
cd client
npm run dev
```

**Wait for this message:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

✅ Frontend is running!

---

## 🌐 Access the Application

Once both servers are running:

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the homepage

---

## 🧪 Test if Backend is Working

Open browser and go to:
```
http://127.0.0.1:5010/api/jobs/public
```

You should see JSON data with jobs.

If you see an error or "Cannot connect", the backend is not running.

---

## 📊 Check Database Jobs

To see what jobs are in the database:

```bash
cd backend
python check_published_jobs.py
```

This will show:
- Total jobs in database
- How many are published
- Details of each job

---

## ❌ Troubleshooting

### "No jobs found" on frontend

**Cause:** Backend server is not running

**Solution:**
1. Check if backend is running on port 5010
2. Test: http://127.0.0.1:5010/api/jobs/public
3. If not working, start backend server

---

### "Connection refused" error

**Cause:** Backend server is not running

**Solution:**
```bash
cd backend
python manage.py runserver 127.0.0.1:5010
```

---

### "Port already in use"

**Cause:** Server is already running

**Solution:**
1. Close the existing server (Ctrl+C)
2. Or use a different port

---

### No jobs in database

**Cause:** No jobs have been created yet

**Solution:**
1. Login as recruiter: `recruiter@demo.com` / `recruiter123`
2. Go to "Post Job"
3. Create and publish a job

Or run:
```bash
cd backend
python check_published_jobs.py
```

This will show and publish any draft jobs.

---

## 🔑 Test Credentials

### Candidate
```
Email: candidate@test.com
Password: candidate123
```

### Recruiter (Can post jobs)
```
Email: spark@gmail.com
Password: spark123
```

### Recruiter 2
```
Email: recruiter@demo.com
Password: recruiter123
```

---

## ✅ Verification Checklist

Before using the application, verify:

- [ ] Backend server running on port 5010
- [ ] Frontend server running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can access http://127.0.0.1:5010/api/jobs/public
- [ ] Jobs are visible on frontend

---

## 📝 Current Database Status

As of now, you have:
- ✅ 3 published jobs in database
- ✅ Job Application system ready
- ✅ All APIs working

**You just need to start the servers!**

---

## 🎯 Next Steps

1. Start both servers (use START_SERVERS.bat)
2. Open http://localhost:5173
3. Click "Jobs" in navigation
4. You should see 3 jobs
5. Click "Apply" on any job
6. Test the application flow

---

## 💡 Pro Tips

- Keep both terminal windows open while using the app
- Don't close the terminal windows
- If you make changes to backend code, restart backend server
- If you make changes to frontend code, Vite will auto-reload

---

**Need help? Check the documentation files in the project root.**
