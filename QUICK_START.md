# 🚀 Quick Start Guide - MytechZ

## Prerequisites
- ✅ Node.js installed (v16 or higher)
- ✅ MongoDB Atlas account (free tier)

## 🎯 Setup in 3 Steps

### Step 1: Get MongoDB Credentials (5 minutes)

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster** (M0 - no credit card needed)
3. **Create Database User**:
   - Go to "Database Access"
   - Add user with username & password
   - Save credentials!
4. **Allow Network Access**:
   - Go to "Network Access"
   - Add IP: `0.0.0.0/0` (allow all for development)
5. **Get Connection String**:
   - Go to "Database" → "Connect" → "Drivers"
   - Copy connection string
   - Replace `<username>` and `<password>`
   - Add database name: `/mytechz`

**Example:**
```
mongodb+srv://myuser:MyPass123@cluster0.abc123.mongodb.net/mytechz?retryWrites=true&w=majority
```

**Special Characters in Password?** URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`

📖 **Detailed guide**: See `MONGODB_SETUP_GUIDE.md`

---

### Step 2: Configure Environment

1. **Update `server/.env`**:
```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mytechz?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here
PORT=5010
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

2. **Update `client/.env`** (should already be correct):
```env
VITE_API_BASE_URL=http://localhost:5010
```

---

### Step 3: Install & Run

**Option A: Automatic Setup (Recommended)**
```bash
setup-complete.bat
```
This will:
- Install all dependencies
- Test MongoDB connection
- Verify configuration

**Option B: Manual Setup**
```bash
# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install

# Test connection
cd ../server
node test-full-connection.js
```

---

## 🎮 Running the Application

### Start Development Servers
```bash
start-dev.bat
```

This opens two windows:
- **Backend**: http://localhost:5010
- **Frontend**: http://localhost:5173

### Manual Start (Alternative)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

---

## ✅ Verify Everything Works

### 1. Test MongoDB Connection
```bash
cd server
node test-full-connection.js
```

Expected output:
```
✅ MongoDB Connected Successfully!
✅ Found X collections
```

### 2. Test Backend API
Open browser: http://localhost:5010

Should see: `API is running...`

### 3. Test Frontend
Open browser: http://localhost:5173

Should see your application homepage

---

## 🔧 Common Issues

### "MongoDB connection failed"
- ✅ Check MONGO_URI in `server/.env`
- ✅ Verify username/password are correct
- ✅ URL encode special characters in password
- ✅ Check Network Access allows 0.0.0.0/0

### "Cannot connect to backend"
- ✅ Backend running on port 5010?
- ✅ Check `VITE_API_BASE_URL` in `client/.env`
- ✅ CORS configured correctly (already done)

### "Port already in use"
- ✅ Close other applications using ports 5010 or 5173
- ✅ Or change PORT in `server/.env`

---

## 📁 Project Structure

```
mytechz/
├── server/              # Backend (Express + MongoDB)
│   ├── .env            # ⚠️ Configure this!
│   ├── server.js       # Main server file
│   ├── config/         # Database config
│   ├── routes/         # API routes
│   └── models/         # MongoDB models
│
├── client/             # Frontend (React + Vite)
│   ├── .env           # API URL config
│   ├── src/           # React components
│   └── public/        # Static files
│
└── *.bat              # Windows scripts
```

---

## 🎯 What's Connected?

```
Frontend (React)  →  Backend (Express)  →  MongoDB Atlas
localhost:5173    →  localhost:5010     →  Cloud Database
```

**Data Flow:**
1. User interacts with React frontend
2. Frontend sends API requests to Express backend
3. Backend queries/updates MongoDB
4. Backend sends response to frontend
5. Frontend displays data to user

---

## 📚 Next Steps

1. ✅ Complete MongoDB setup
2. ✅ Run `setup-complete.bat`
3. ✅ Start development with `start-dev.bat`
4. 🎨 Start building features!

---

## 🆘 Need Help?

- **MongoDB Setup**: `MONGODB_SETUP_GUIDE.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`
- **Full Documentation**: `README.md`

---

## 🎉 You're Ready!

Once you see:
- ✅ MongoDB Connected
- ✅ Backend running on 5010
- ✅ Frontend running on 5173

**You're all set to start developing!** 🚀
