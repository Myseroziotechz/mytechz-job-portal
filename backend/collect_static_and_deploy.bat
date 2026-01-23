@echo off
echo ========================================
echo Collecting Django Static Files
echo ========================================

cd /d "%~dp0"

echo.
echo Collecting static files...
python manage.py collectstatic --noinput

echo.
echo ========================================
echo Static files collected successfully!
echo ========================================
echo.
echo Now committing and pushing to trigger Render deployment...
echo.

cd ..
git add .
git commit -m "Enable whitenoise and collect static files for Django admin"
git push origin main

echo.
echo ========================================
echo Done! Render will redeploy automatically.
echo Wait 2-3 minutes, then visit:
echo https://mytechz-job-portal.onrender.com/admin
echo ========================================
pause
