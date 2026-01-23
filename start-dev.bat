@echo off
echo ========================================
echo   MytechZ Development Environment
echo ========================================
echo.

echo [1/4] Testing MongoDB Connection...
cd server
call node test-connection.js
if errorlevel 1 (
    echo.
    echo ❌ MongoDB connection failed!
    echo Please check your MONGO_URI in server/.env
    pause
    exit /b 1
)

echo.
echo [2/4] Starting Backend Server...
start "MytechZ Backend" cmd /k "cd /d %CD% && npm start"

echo.
echo [3/4] Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo.
echo [4/4] Starting Frontend Client...
cd ..\client
start "MytechZ Frontend" cmd /k "cd /d %CD% && npm run dev"

echo.
echo ========================================
echo   ✅ Development Environment Started!
echo ========================================
echo.
echo Backend:  http://localhost:5010
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause > nul

echo.
echo Stopping servers...
taskkill /FI "WindowTitle eq MytechZ Backend*" /T /F > nul 2>&1
taskkill /FI "WindowTitle eq MytechZ Frontend*" /T /F > nul 2>&1
echo Done!
