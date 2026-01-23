@echo off
color 0A
echo ========================================
echo    MytechZ - ngrok Public Demo
echo ========================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ngrok not found!
    echo.
    echo Please install ngrok:
    echo 1. Download from: https://ngrok.com/download
    echo 2. Extract to C:\ngrok or add to PATH
    echo 3. Run: ngrok config add-authtoken YOUR_TOKEN
    echo.
    pause
    exit /b 1
)

echo [INFO] ngrok found!
echo.

REM Start backend server
echo [1/4] Starting Backend Server...
start "MytechZ Backend" cmd /k "cd MytechZ_frontend_dark_theme_fixing_bk_working\backend && python manage.py runserver 0.0.0.0:5010"
timeout /t 5 /nobreak >nul

REM Start backend ngrok tunnel
echo [2/4] Starting Backend ngrok Tunnel...
start "ngrok Backend" cmd /k "ngrok http 5010"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo IMPORTANT: Copy Backend ngrok URL
echo ========================================
echo.
echo 1. Look at the "ngrok Backend" window
echo 2. Find the line: "Forwarding https://xxxxx.ngrok-free.app"
echo 3. Copy that URL (e.g., https://abc123.ngrok-free.app)
echo.
set /p BACKEND_URL="Paste Backend ngrok URL here: "

REM Update .env file
echo.
echo [3/4] Updating Frontend Configuration...
echo VITE_API_URL=%BACKEND_URL% > MytechZ_frontend_dark_theme_fixing_bk_working\client\.env
echo Configuration updated!

REM Start frontend server
echo [4/4] Starting Frontend Server...
start "MytechZ Frontend" cmd /k "cd MytechZ_frontend_dark_theme_fixing_bk_working\client && npm run dev -- --host"
timeout /t 5 /nobreak >nul

REM Start frontend ngrok tunnel
echo [5/5] Starting Frontend ngrok Tunnel...
start "ngrok Frontend" cmd /k "ngrok http 5173"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo    MytechZ Public Demo is Ready!
echo ========================================
echo.
echo Look at the "ngrok Frontend" window
echo Find: "Forwarding https://xxxxx.ngrok-free.app"
echo.
echo SHARE THIS URL WITH ANYONE:
echo   Frontend: https://xxxxx.ngrok-free.app
echo.
echo ADMIN PANEL:
echo   URL: %BACKEND_URL%/admin
echo   Email: admin1@test.com
echo   Password: Admin@123
echo.
echo DEMO ACCOUNTS:
echo   Recruiter: sivabalan@test.com / Test@123
echo   Candidate: candidate1@test.com / Test@123
echo.
echo ========================================
echo Windows Open:
echo   1. MytechZ Backend (Django server)
echo   2. ngrok Backend (Backend tunnel)
echo   3. MytechZ Frontend (Vite server)
echo   4. ngrok Frontend (Frontend tunnel)
echo ========================================
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo Stopping all servers...
taskkill /F /FI "WindowTitle eq MytechZ Backend*" >nul 2>&1
taskkill /F /FI "WindowTitle eq MytechZ Frontend*" >nul 2>&1
taskkill /F /FI "WindowTitle eq ngrok Backend*" >nul 2>&1
taskkill /F /FI "WindowTitle eq ngrok Frontend*" >nul 2>&1
echo All servers stopped.
echo.
pause
