# 🚀 Quick Start Guide

## Option 1: Automated Start (Recommended)

Double-click `start-dev.bat` - This will:
1. Test MongoDB connection
2. Start backend server (port 5010)
3. Start frontend client (port 5173)

## Option 2: Manual Start

### Step 1: Test MongoDB Connection
```bash
cd server
node test-connection.js
```

If you see ✅ SUCCESS, proceed to Step 2.

### Step 2: Start Backend (Terminal 1)
```bash
cd server
npm install
npm start
```

Wait for: `✅ MongoDB Connected` and `Server running on port 5010`

### Step 3: Start Frontend (Terminal 2)
```bash
cd client
npm install
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 4: Open Browser
Navigate to: http://localhost:5173

---

## ⚠️ If MongoDB Connection Fails

1. **Check MongoDB Atlas Dashboard**:
   - Go to https://cloud.mongodb.com
   - Login with your account
   - Verify cluster is running (not paused)

2. **Fix Network Access**:
   - In MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Verify Database User**:
   - In MongoDB Atlas → Database Access
   - Check if user `rajaparimala000` exists
   - If not, create a new user and update `server/.env`

4. **Update Connection String** (if needed):
   - Get new connection string from MongoDB Atlas
   - Update `MONGO_URI` in `server/.env`
   - Format: `mongodb+srv://USERNAME:PASSWORD@cluster0.dt63zvk.mongodb.net/mytechz`

---

## 📝 What Was Fixed

✅ MongoDB URI - Removed spaces from username  
✅ Added database name to connection string  
✅ Fixed ES module syntax error  
✅ Added better error handling  
✅ Improved connection logging  

---

## 🆘 Still Having Issues?

Run the test connection script:
```bash
cd server
node test-connection.js
```

This will show detailed error messages to help diagnose the problem.
