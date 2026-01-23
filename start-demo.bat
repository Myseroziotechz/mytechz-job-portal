@echo off
echo ========================================
echo    MytechZ Demo Launcher
echo ========================================
echo.

REM Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do set IP=%%a
set IP=%IP:~1%
echo Your Local IP: %IP%
echo.

REM Start backend
echo [1/2] Starting Backend Server...
start "MytechZ Backend" cmd /k "cd MytechZ_frontend_dark_theme_fixing_bk_working\backend && python manage.py runserver 0.0.0.0:5010"
timeout /t 5 /nobreak >nul

REM Start frontend
echo [2/2] Starting Frontend Server...
start "MytechZ Frontend" cmd /k "cd MytechZ_frontend_dark_theme_fixing_bk_working\client && npm run dev -- --host"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    MytechZ Demo is Running!
echo ========================================
echo.
echo Access from this computer:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5010
echo.
echo Access from other devices on network:
echo   Frontend: http://%IP%:5173
echo   Backend:  http://%IP%:5010
echo.
echo Admin Panel:
echo   URL:      http://localhost:5010/admin
echo   Username: admin1@test.com
echo   Password: Admin@123
echo.
echo Demo Accounts:
echo   Recruiter: sivabalan@test.com / Test@123
echo   Candidate: candidate1@test.com / Test@123
echo.
echo ========================================
echo Press any key to stop all servers...
echo ========================================
pause >nul

echo.
echo Stopping servers...
taskkill /F /FI "WindowTitle eq MytechZ Backend*" >nul 2>&1
taskkill /F /FI "WindowTitle eq MytechZ Frontend*" >nul 2>&1
echo Servers stopped.
echo.
pause
