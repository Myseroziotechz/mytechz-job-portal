@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🎯 PREPARING DEMO 🎯                           ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Step 1: Starting Backend Server...
start "MytechZ Backend" cmd /k "cd backend && python manage.py runserver"
echo ✅ Backend starting on http://127.0.0.1:8000
echo.
echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak > nul
echo.
echo Step 2: Starting Ngrok Tunnel...
start "Ngrok Tunnel" cmd /k "C:\ngrok.exe http 8000"
echo ✅ Ngrok tunnel starting...
echo.
echo Waiting 3 seconds for ngrok to connect...
timeout /t 3 /nobreak > nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              ⚠️  IMPORTANT - READ THIS! ⚠️                 ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo STEP 3: You MUST do this manually:
echo.
echo 1. Open this URL in your browser:
echo    https://4f5bf3dc95aa.ngrok-free.app
echo.
echo 2. Click the "Visit Site" button
echo.
echo 3. You should see: {"detail":"Not Found"}
echo    (This is good! It means backend is accessible)
echo.
echo 4. Now open your demo site:
echo    https://moonlit-elf-6007d5.netlify.app
echo.
echo ✅ Everything should work now!
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 🔑 Test Credentials:
echo    Candidate: candidate1@test.com / Candidate@123
echo    Recruiter: recruiter1@test.com / Recruiter@123
echo.
echo 💡 Tip: Keep the ngrok tab open during your demo!
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Press any key to close this window (servers will keep running)...
pause > nul
