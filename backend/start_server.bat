@echo off
echo ========================================
echo   Job Portal Backend Server
echo ========================================
echo.

echo 🚀 Starting Django Development Server...
echo.

REM Activate virtual environment and start server
call venv\Scripts\activate
python manage.py runserver 127.0.0.1:5010

echo.
echo 🛑 Server stopped
pause