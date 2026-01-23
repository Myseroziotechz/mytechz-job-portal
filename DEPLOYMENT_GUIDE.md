# 🚀 MytechZ Deployment Guide for Demo

**Date:** January 21, 2026  
**Purpose:** Deploy MytechZ for demo/production  
**Stack:** React (Frontend) + Django (Backend) + SQLite

---

## 📋 Quick Overview

You have **3 deployment options**:

1. **🌐 Full Cloud Deployment** (Recommended for demo)
   - Frontend: Netlify/Vercel (Free)
   - Backend: Railway/Render (Free tier)
   - Best for: Public demos, client presentations

2. **💻 Local Network Demo**
   - Run on your machine
   - Access from other devices on same network
   - Best for: Quick demos, testing

3. **🐳 Docker Deployment**
   - Containerized deployment
   - Easy to move between environments
   - Best for: Professional demos, staging

---

## 🌟 OPTION 1: Full Cloud Deployment (RECOMMENDED)

### Part A: Deploy Backend (Railway - Free Tier)

#### Step 1: Prepare Backend for Deployment

1. Create `runtime.txt` in backend folder:
```
python-3.11
```

2. Create `Procfile` in backend folder:
```
web: gunicorn job_portal.wsgi --log-file -
```

3. Update `requirements.txt`:
```
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
python-decouple==3.8
Pillow
gunicorn==21.2.0
whitenoise==6.6.0
dj-database-url==2.1.0
psycopg2-binary==2.9.9
```

4. Update `backend/job_portal/settings.py`:


```python
import os
import dj_database_url
from pathlib import Path

# Add at top
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Add whitenoise to middleware (after SecurityMiddleware)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    # ... rest of middleware
]

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Database - use PostgreSQL in production, SQLite in development
if os.environ.get('DATABASE_URL'):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
```

#### Step 2: Deploy to Railway


1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables:
   ```
   DEBUG=False
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=*.railway.app
   DATABASE_URL=(Railway will auto-add if you add PostgreSQL)
   ```
7. Click "Deploy"
8. Note your backend URL: `https://your-app.railway.app`

### Part B: Deploy Frontend (Netlify - Free Tier)

#### Step 1: Update Frontend Environment

Create `client/.env.production`:
```
VITE_API_URL=https://your-app.railway.app
```

#### Step 2: Deploy to Netlify

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Configure build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-app.railway.app`
7. Click "Deploy"
8. Your site will be live at: `https://your-app.netlify.app`

---

## 💻 OPTION 2: Local Network Demo (FASTEST)

### Step 1: Find Your Local IP


```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

### Step 2: Update Backend Settings

Edit `backend/job_portal/settings.py`:
```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.100', '*']
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://192.168.1.100:5173',
]
```

### Step 3: Update Frontend Environment

Edit `client/.env`:
```
VITE_API_URL=http://192.168.1.100:5010
```

### Step 4: Start Servers

```cmd
# Terminal 1 - Backend
cd backend
python manage.py runserver 0.0.0.0:5010

# Terminal 2 - Frontend
cd client
npm run dev -- --host
```

### Step 5: Access from Other Devices

- Your computer: `http://localhost:5173`
- Other devices on network: `http://192.168.1.100:5173`

---

## 🐳 OPTION 3: Docker Deployment

### Step 1: Create Docker Files


Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python manage.py collectstatic --noinput
EXPOSE 5010
CMD ["gunicorn", "job_portal.wsgi:application", "--bind", "0.0.0.0:5010"]
```

Create `client/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
```

Create `docker-compose.yml` in root:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5010:5010"
    environment:
      - DEBUG=False
      - ALLOWED_HOSTS=*
    volumes:
      - ./backend/db.sqlite3:/app/db.sqlite3
  
  frontend:
    build: ./client
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5010
    depends_on:
      - backend
```

### Step 2: Run with Docker

```cmd
docker-compose up --build
```

Access at: `http://localhost:5173`

---

## 🎯 RECOMMENDED: Quick Demo Setup (5 Minutes)

For fastest demo setup, use **Local Network Demo**:


### Quick Start Script

Create `start-demo.bat`:
```batch
@echo off
echo Starting MytechZ Demo...
echo.

REM Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do set IP=%%a
set IP=%IP:~1%
echo Your IP: %IP%
echo.

REM Start backend
echo Starting Backend...
start cmd /k "cd backend && python manage.py runserver 0.0.0.0:5010"
timeout /t 5

REM Start frontend
echo Starting Frontend...
start cmd /k "cd client && npm run dev -- --host"
timeout /t 5

echo.
echo ========================================
echo MytechZ Demo is Running!
echo ========================================
echo.
echo Access from this computer:
echo   http://localhost:5173
echo.
echo Access from other devices:
echo   http://%IP%:5173
echo.
echo Admin Panel:
echo   http://localhost:5010/admin
echo   Username: admin1@test.com
echo   Password: Admin@123
echo.
echo Press any key to stop servers...
pause
taskkill /F /FI "WindowTitle eq *runserver*"
taskkill /F /FI "WindowTitle eq *npm*"
```

Just run: `start-demo.bat`

---

## 📱 Demo Checklist

### Before Demo
- ✅ Backend running
- ✅ Frontend running
- ✅ Test login works
- ✅ Test job posting works
- ✅ Test application works
- ✅ Admin panel accessible
- ✅ All features working

### Demo Accounts


**Admin:**
- Email: admin1@test.com
- Password: Admin@123

**Recruiter:**
- Email: sivabalan@test.com
- Password: Test@123

**Candidate:**
- Email: candidate1@test.com
- Password: Test@123

### Demo Flow

1. **Homepage** - Show landing page
2. **Jobs** - Browse available jobs
3. **Login as Candidate** - Apply for jobs
4. **Login as Recruiter** - Post jobs, view applications
5. **Admin Panel** - Show college applications
6. **Admissions** - Apply to colleges

---

## 🔧 Troubleshooting

### Backend Issues

**Port already in use:**
```cmd
netstat -ano | findstr :5010
taskkill /PID <PID> /F
```

**Database errors:**
```cmd
cd backend
python manage.py migrate
```

**CORS errors:**
Add your frontend URL to `CORS_ALLOWED_ORIGINS` in settings.py

### Frontend Issues

**API connection failed:**
- Check `VITE_API_URL` in `.env`
- Verify backend is running
- Check CORS settings

**Build errors:**
```cmd
cd client
rm -rf node_modules
npm install
npm run build
```

---

## 🌐 Production Deployment Tips

### Security
- ✅ Set `DEBUG=False`
- ✅ Use strong `SECRET_KEY`
- ✅ Configure proper `ALLOWED_HOSTS`
- ✅ Use HTTPS
- ✅ Enable CSRF protection
- ✅ Use environment variables

### Performance
- ✅ Enable caching
- ✅ Use CDN for static files
- ✅ Optimize images
- ✅ Enable gzip compression
- ✅ Use production database (PostgreSQL)

### Monitoring
- ✅ Set up error tracking (Sentry)
- ✅ Monitor uptime
- ✅ Track performance
- ✅ Set up backups

---

## 📊 Deployment Comparison

| Feature | Local Network | Railway + Netlify | Docker |
|---------|--------------|-------------------|--------|
| **Setup Time** | 5 min | 30 min | 15 min |
| **Cost** | Free | Free tier | Free |
| **Public Access** | ❌ No | ✅ Yes | ❌ No |
| **SSL/HTTPS** | ❌ No | ✅ Yes | ❌ No |
| **Scalability** | ❌ Low | ✅ High | ✅ Medium |
| **Best For** | Quick demo | Public demo | Staging |

---

## ✅ Next Steps

1. Choose deployment option
2. Follow the steps above
3. Test all features
4. Share demo link/IP
5. Gather feedback

---

**Need Help?** Check `TROUBLESHOOTING.md` or contact support.

**Last Updated:** January 21, 2026
