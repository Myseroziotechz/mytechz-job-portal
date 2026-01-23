@echo off
echo ═══════════════════════════════════════════════════════════════════
echo    DJANGO ADMIN - COLLECT STATIC FILES AND DEPLOY
echo ═══════════════════════════════════════════════════════════════════
echo.

echo [1/3] Installing whitenoise (if not installed)...
pip install whitenoise==6.6.0
echo.

echo [2/3] Collecting static files...
python manage.py collectstatic --noinput
echo.

echo [3/3] Committing and pushing to trigger Render deployment...
cd ..
git add .
git commit -m "Update Django admin static files configuration"
git push origin main
echo.

echo ═══════════════════════════════════════════════════════════════════
echo    ✅ DEPLOYMENT TRIGGERED!
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Render will automatically deploy your changes.
echo Wait 2-3 minutes, then visit:
echo https://mytechz-job-portal.onrender.com/admin
echo.
echo Press any key to exit...
pause >nul
