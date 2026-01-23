@echo off
color 0C
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🚨 BACKEND NOT RUNNING! 🚨                     ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo The error shows: ERR_NGROK_8012
echo This means your Django backend is not running!
echo.
echo Starting backend now...
echo.
cd backend
echo.
echo ════════════════════════════════════════════════════════════════
echo Starting Django server on http://127.0.0.1:8000
echo ════════════════════════════════════════════════════════════════
echo.
python manage.py runserver
