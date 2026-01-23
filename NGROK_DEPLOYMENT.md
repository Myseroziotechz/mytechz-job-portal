# 🌐 Deploy MytechZ with ngrok (Public Demo in 5 Minutes!)

**Date:** January 21, 2026  
**Method:** ngrok tunneling  
**Best For:** Quick public demos, client presentations, testing

---

## 🎯 What is ngrok?

ngrok creates secure tunnels to your localhost, giving you a public URL instantly.

**Benefits:**
- ✅ Public URL in seconds
- ✅ HTTPS automatically
- ✅ No deployment needed
- ✅ Perfect for demos
- ✅ Free tier available

---

## 📋 Prerequisites

1. **Download ngrok:**
   - Go to: https://ngrok.com/download
   - Download for Windows
   - Extract to a folder (e.g., `C:\ngrok`)

2. **Sign up (Free):**
   - Go to: https://dashboard.ngrok.com/signup
   - Create free account
   - Get your authtoken

3. **Configure ngrok:**
   ```cmd
   cd C:\ngrok
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Update Backend Settings

Edit `backend/job_portal/settings.py`:
```python
# Add at the top
import os

# Update ALLOWED_HOSTS
ALLOWED_HOSTS = ['*']  # Allow all hosts for ngrok

# Update CORS settings
CORS_ALLOW_ALL_ORIGINS = True  # For demo purposes
```

### Step 2: Start Your Servers

Open 2 terminals:

**Terminal 1 - Backend:**
```cmd
cd MytechZ_frontend_dark_theme_fixing_bk_working\backend
python manage.py runserver 0.0.0.0:5010
```

**Terminal 2 - Frontend:**
```cmd
cd MytechZ_frontend_dark_theme_fixing_bk_working\client
npm run dev -- --host
```

### Step 3: Start ngrok Tunnels

Open 2 MORE terminals:

**Terminal 3 - Backend Tunnel:**
```cmd
cd C:\ngrok
ngrok http 5010
```

Copy the URL shown (e.g., `https://abc123.ngrok-free.app`)

**Terminal 4 - Frontend Tunnel:**
```cmd
cd C:\ngrok
ngrok http 5173
```

Copy the URL shown (e.g., `https://xyz789.ngrok-free.app`)

### Step 4: Update Frontend Environment

Edit `client/.env`:
```
VITE_API_URL=https://abc123.ngrok-free.app
```

Replace `abc123.ngrok-free.app` with YOUR backend ngrok URL.

### Step 5: Restart Frontend

Stop frontend (Ctrl+C) and restart:
```cmd
npm run dev -- --host
```

### Step 6: Share Your Demo!

**Frontend URL:** `https://xyz789.ngrok-free.app`  
**Backend URL:** `https://abc123.ngrok-free.app`  
**Admin Panel:** `https://abc123.ngrok-free.app/admin`

Share the frontend URL with anyone!

---

## 🎬 Automated Script

I've created an automated script for you!


---

## 📝 Configuration Files

### Update Backend Settings

Edit `backend/job_portal/settings.py` - Add these lines:

```python
# At the top with other imports
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True  # Keep True for demo

# Update ALLOWED_HOSTS to accept ngrok URLs
ALLOWED_HOSTS = ['*']

# CORS Settings - Allow all origins for ngrok
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# If you want to be more specific (recommended):
# CORS_ALLOWED_ORIGINS = [
#     'https://your-frontend-url.ngrok-free.app',
#     'http://localhost:5173',
# ]
```

---

## 🔧 Troubleshooting

### ngrok Warning Page

If you see "ngrok warning" page:
- Click "Visit Site" button
- This is normal for free tier
- Visitors will see this once per session

### CORS Errors

If you get CORS errors:
1. Make sure `CORS_ALLOW_ALL_ORIGINS = True` in settings.py
2. Restart backend server
3. Clear browser cache

### ngrok URL Changes

Free ngrok URLs change every time you restart.
- Update `.env` with new backend URL
- Restart frontend
- Share new frontend URL

### Connection Refused

- Make sure both servers are running
- Check if ports 5010 and 5173 are accessible
- Verify ngrok is pointing to correct ports

---

## 💡 Pro Tips

### 1. Keep URLs Stable (Paid Feature)

With ngrok paid plan ($8/month):
```cmd
ngrok http 5010 --domain=your-custom-domain.ngrok-free.app
```

### 2. Use ngrok Config File

Create `ngrok.yml`:
```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN
tunnels:
  backend:
    proto: http
    addr: 5010
  frontend:
    proto: http
    addr: 5173
```

Start both tunnels:
```cmd
ngrok start --all
```

### 3. Monitor Traffic

ngrok provides a web interface at:
```
http://localhost:4040
```

See all requests, responses, and replay them!

---

## 📊 Comparison: ngrok vs Other Methods

| Feature | ngrok | Railway | Local Network |
|---------|-------|---------|---------------|
| **Setup Time** | 5 min | 30 min | 2 min |
| **Public URL** | ✅ Yes | ✅ Yes | ❌ No |
| **HTTPS** | ✅ Yes | ✅ Yes | ❌ No |
| **Persistent** | ❌ No* | ✅ Yes | ❌ No |
| **Cost** | Free | Free | Free |
| **Best For** | Quick demo | Production | Local test |

*URLs change on restart (free tier)

---

## ✅ Checklist

Before sharing your demo:

- [ ] Backend server running
- [ ] Frontend server running
- [ ] ngrok backend tunnel running
- [ ] ngrok frontend tunnel running
- [ ] `.env` updated with backend ngrok URL
- [ ] Frontend restarted after `.env` update
- [ ] Tested login works
- [ ] Tested job application works
- [ ] Admin panel accessible
- [ ] Shared frontend ngrok URL

---

## 🎯 Demo Flow

1. **Share URL:** Send frontend ngrok URL to client
2. **They Visit:** Client opens URL in browser
3. **Click "Visit Site":** On ngrok warning page
4. **Demo Features:** Show all features
5. **Login:** Use demo accounts
6. **Admin Panel:** Show backend ngrok URL + /admin

---

## 📱 Demo Accounts

**Admin:**
- URL: `https://your-backend.ngrok-free.app/admin`
- Email: admin1@test.com
- Password: Admin@123

**Recruiter:**
- Email: sivabalan@test.com
- Password: Test@123

**Candidate:**
- Email: candidate1@test.com
- Password: Test@123

---

## 🔒 Security Notes

**For Demo Only:**
- `ALLOWED_HOSTS = ['*']` - Not for production
- `CORS_ALLOW_ALL_ORIGINS = True` - Not for production
- `DEBUG = True` - Not for production

**For Production:**
- Use specific allowed hosts
- Use specific CORS origins
- Set DEBUG = False
- Use environment variables
- Use proper database (PostgreSQL)

---

## 📞 Support

**ngrok Issues:**
- Docs: https://ngrok.com/docs
- Dashboard: https://dashboard.ngrok.com

**MytechZ Issues:**
- Check: TROUBLESHOOTING.md
- Check: CURRENT_SYSTEM_STATUS.md

---

**Last Updated:** January 21, 2026  
**Status:** ✅ Ready to Use
