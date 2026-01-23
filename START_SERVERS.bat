@echo off
echo ========================================
echo Starting MytechZ Job Portal Servers
echo ========================================
echo.

echo Starting Backend Server (Django)...
start "Django Backend" cmd /k "cd backend && python manage.py runserver 127.0.0.1:5010"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (React)...
start "React Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo.
echo Backend:  http://127.0.0.1:5010
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
