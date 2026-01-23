@echo off
echo ========================================
echo   MytechZ Job Portal - Full Stack
echo ========================================
echo.

echo [1/2] Starting Backend Server...
cd backend
start "Job Portal Backend" cmd /k "call venv\Scripts\activate && python manage.py runserver 127.0.0.1:5010"

echo.
echo [2/2] Starting Frontend Client...
cd ..\client
start "Job Portal Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   ✅ Full Stack Application Started!
echo ========================================
echo.
echo Backend:  http://127.0.0.1:5010/
echo Frontend: http://localhost:5173/
echo Admin:    http://127.0.0.1:5010/admin/
echo.
echo Admin Credentials:
echo Email: admin@jobportal.com
echo Password: admin123
echo.
echo Press any key to stop all servers...
pause > nul

echo.
echo Stopping servers...
taskkill /FI "WindowTitle eq Job Portal Backend*" /T /F > nul 2>&1
taskkill /FI "WindowTitle eq Job Portal Frontend*" /T /F > nul 2>&1
echo Done!