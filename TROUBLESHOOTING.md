# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. MongoDB Connection Fails

**Symptoms:**
```
❌ MongoDB Connection failed: connect ECONNREFUSED
❌ MongoServerError: bad auth
❌ MongooseServerSelectionError
```

**Solutions:**

#### A. Test the Connection
```bash
cd server
node test-connection.js
```

#### B. Check MongoDB Atlas

1. **Login to MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Login with your credentials

2. **Verify Cluster is Running**
   - Dashboard → Clusters
   - Check if cluster0 is active (not paused)
   - If paused, click "Resume"

3. **Fix Network Access**
   - Left menu → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere"
   - Enter: `0.0.0.0/0`
   - Click "Confirm"
   - Wait 1-2 minutes for changes to apply

4. **Verify Database User**
   - Left menu → Database Access
   - Check if user `rajaparimala000` exists
   - If not, create new user:
     - Click "Add New Database User"
     - Username: `rajaparimala000`
     - Password: `RaviKumaraHS@18`
     - Database User Privileges: "Read and write to any database"
     - Click "Add User"

5. **Get New Connection String**
   - Dashboard → Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Update `server/.env`:
     ```
     MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.dt63zvk.mongodb.net/mytechz?retryWrites=true&w=majority
     ```

### 2. Server Won't Start

**Symptoms:**
```
Error: Cannot find module
SyntaxError: Unexpected token
Port already in use
```

**Solutions:**

#### A. Missing Dependencies
```bash
cd server
npm install
```

#### B. Port Already in Use
```bash
# Windows - Kill process on port 5010
netstat -ano | findstr :5010
taskkill /PID <PID_NUMBER> /F
```

#### C. Syntax Errors
- Make sure you saved all files
- Check `server/server.js` for any typos
- Run: `node server/server.js` to see detailed errors

### 3. Frontend Won't Start

**Symptoms:**
```
Error: Cannot find module
Failed to resolve import
Port already in use
```

**Solutions:**

#### A. Missing Dependencies
```bash
cd client
npm install
```

#### B. Port Already in Use (5173)
```bash
# Windows - Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

#### C. Clear Cache
```bash
cd client
rmdir /s /q node_modules
rmdir /s /q .vite
npm install
npm run dev
```

### 4. Frontend Can't Connect to Backend

**Symptoms:**
- API calls fail in browser console
- Network errors (ERR_CONNECTION_REFUSED)
- CORS errors

**Solutions:**

#### A. Check Backend is Running
- Backend must be running on port 5010
- Check terminal shows: "Server running on port 5010"

#### B. Verify Environment Variables
```bash
# client/.env should have:
VITE_API_BASE_URL=http://localhost:5010
```

#### C. Check CORS Configuration
- Open `server/server.js`
- Verify CORS allows `http://localhost:5173`

#### D. Browser Console
- Press F12 in browser
- Check Console tab for errors
- Check Network tab for failed requests

### 5. Login/Registration Not Working

**Symptoms:**
- "User not found" errors
- "Invalid credentials"
- Registration fails

**Solutions:**

#### A. Check MongoDB Connection
```bash
cd server
node test-connection.js
```

#### B. Check Database
- Login to MongoDB Atlas
- Browse Collections
- Verify `users` collection exists

#### C. Check JWT Secret
```bash
# server/.env should have:
JWT_SECRET=yourSuperSecretKey
```

### 6. File Upload Issues

**Symptoms:**
- Resume upload fails
- "File too large" errors

**Solutions:**

#### A. Check Uploads Folder
```bash
# Make sure folder exists:
cd server
mkdir uploads
```

#### B. Check File Size Limits
- Default limit is usually 10MB
- Check `server/routes/resumeUploadRoutes.js`

### 7. Email Not Sending

**Symptoms:**
- Registration emails not received
- Password reset emails not sent

**Solutions:**

#### A. Check Email Configuration
```bash
# server/.env should have:
EMAIL_USER=mytechza1@gmail.com
EMAIL_PASS=iwnlpiekzmpbwtzp
```

#### B. Gmail App Password
- If using Gmail, you need an "App Password"
- Go to Google Account → Security → 2-Step Verification → App Passwords
- Generate new password
- Update `EMAIL_PASS` in `server/.env`

## Quick Diagnostic Commands

### Check if ports are in use:
```bash
netstat -ano | findstr :5010
netstat -ano | findstr :5173
```

### Check Node.js version:
```bash
node --version
npm --version
```

### Check environment variables:
```bash
cd server
type .env
```

### Test MongoDB connection:
```bash
cd server
node test-connection.js
```

### Check server logs:
```bash
cd server
type server.log
```

## Still Having Issues?

1. **Run the setup checker:**
   ```
   Double-click: check-setup.bat
   ```

2. **Check all files are saved**
   - Make sure you saved changes in your editor

3. **Restart everything:**
   - Close all terminals
   - Run `start-dev.bat` again

4. **Check the logs:**
   - Backend terminal for server errors
   - Browser console (F12) for frontend errors

5. **Verify file structure:**
   ```
   project/
   ├── server/
   │   ├── .env (must exist!)
   │   ├── server.js
   │   └── config/db.js
   └── client/
       ├── .env (optional)
       └── src/
   ```

## Emergency Reset

If nothing works, try this:

```bash
# 1. Backup your .env files
copy server\.env server\.env.backup
copy client\.env client\.env.backup

# 2. Clean install
cd server
rmdir /s /q node_modules
del package-lock.json
npm install

cd ..\client
rmdir /s /q node_modules
del package-lock.json
npm install

# 3. Restore .env files
copy server\.env.backup server\.env
copy client\.env.backup client\.env

# 4. Test connection
cd server
node test-connection.js

# 5. Start application
cd ..
start-dev.bat
```

---

**Need more help?** Check the other documentation files:
- `README_FIRST.md` - Quick overview
- `START_HERE.md` - Getting started
- `SETUP_GUIDE.md` - Detailed setup
- `FIXES_APPLIED.md` - What was fixed
