@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🎯 STARTING LOCAL DEMO 🎯                      ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Starting Backend Server...
start "MytechZ Backend" cmd /k "cd backend && python manage.py runserver"
echo ✅ Backend starting on http://127.0.0.1:8000
echo.
echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak > nul
echo.
echo Starting Frontend Server...
start "MytechZ Frontend" cmd /k "cd client && npm run dev"
echo ✅ Frontend starting on http://localhost:5173
echo.
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              ✅ DEMO SERVERS STARTING! ✅                   ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://127.0.0.1:8000
echo.
echo 🔑 Test Credentials:
echo    Candidate: candidate1@test.com / Candidate@123
echo    Recruiter: recruiter1@test.com / Recruiter@123
echo    Admin:     admin1@test.com / Admin@123
echo.
echo 💡 Tip: Wait 10 seconds, then open http://localhost:5173
echo.
echo Press any key to close this window (servers will keep running)...
pause > nul
