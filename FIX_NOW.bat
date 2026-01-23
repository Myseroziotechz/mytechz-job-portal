@echo off
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🔧 FIXING JOBS PAGE NOW 🔧                     ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo This will fix the "Failed to connect to server" error.
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo STEP 1: Checking if backend is running...
echo.
curl -s http://127.0.0.1:8000/api/jobs/public > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running!
) else (
    echo ❌ Backend is NOT running!
    echo.
    echo Starting backend now...
    start "MytechZ Backend" cmd /k "cd backend && python manage.py runserver"
    echo ✅ Backend started!
    timeout /t 5 /nobreak > nul
)
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo STEP 2: Checking if ngrok is running...
echo.
curl -s https://4f5bf3dc95aa.ngrok-free.app > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ngrok is running!
) else (
    echo ❌ Ngrok is NOT running!
    echo.
    echo Starting ngrok now...
    start "Ngrok Tunnel" cmd /k "C:\ngrok.exe http 8000"
    echo ✅ Ngrok started!
    timeout /t 3 /nobreak > nul
)
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo STEP 3: YOU MUST DO THIS MANUALLY!
echo.
echo ⚠️  CRITICAL STEP - READ CAREFULLY! ⚠️
echo.
echo 1. Open this URL in your browser:
echo    https://4f5bf3dc95aa.ngrok-free.app
echo.
echo 2. You will see a page with "ngrok" logo
echo.
echo 3. Click the blue "Visit Site" button
echo.
echo 4. You should see: {"detail":"Not Found"}
echo    (This is good!)
echo.
echo 5. Now open your demo site:
echo    https://moonlit-elf-6007d5.netlify.app/jobs
echo.
echo ✅ Jobs should load now!
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 💡 TIP: Keep the ngrok tab open during your demo!
echo.
echo If jobs page still shows error, click "Visit Site" again.
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Press any key to open ngrok URL in browser...
pause > nul
start https://4f5bf3dc95aa.ngrok-free.app
echo.
echo ✅ Browser opened! Click "Visit Site" button!
echo.
echo After clicking "Visit Site", press any key to open demo site...
pause > nul
start https://moonlit-elf-6007d5.netlify.app/jobs
echo.
echo ✅ Demo site opened! Jobs should load now!
echo.
echo Press any key to close this window...
pause > nul
