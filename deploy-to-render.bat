@echo off
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                              ║
echo ║                    🚀 DEPLOY TO RENDER - MYTECHZ JOB PORTAL                 ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝

echo.
echo 📋 Step 1: Checking Git status...
git status

echo.
echo 📋 Step 2: Adding all changes...
git add .

echo.
echo 📋 Step 3: Committing changes...
git commit -m "DEPLOYMENT FIX: Updated configuration for Render deployment

- Fixed requirements.txt (removed duplicate setuptools, added versions)
- Updated Django settings for production deployment
- Added PostgreSQL support with dj-database-url
- Improved CORS configuration for production
- Updated render.yaml with proper environment variables
- Added production-ready database configuration
- Fixed ALLOWED_HOSTS configuration

This should resolve the deployment error and make the app production-ready."

echo.
echo 📋 Step 4: Pushing to GitHub...
git push origin main

echo.
echo ✅ Code pushed to GitHub successfully!
echo.
echo 📋 Next Steps:
echo 1. Go to https://render.com
echo 2. Create new Web Service from your GitHub repo
echo 3. Use these settings:
echo    - Name: mytechz-backend
echo    - Root Directory: backend
echo    - Build Command: pip install -r requirements.txt ^&^& python manage.py collectstatic --noinput ^&^& python manage.py migrate
echo    - Start Command: gunicorn job_portal.wsgi:application
echo 4. Add environment variables from render.yaml
echo 5. Deploy!
echo.
echo 🎯 The deployment should now work without errors!

pause