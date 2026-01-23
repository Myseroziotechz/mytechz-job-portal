@echo off
echo ========================================
echo   MytechZ Frontend Only
echo ========================================
echo.

echo Starting Frontend Client...
cd client
start "MytechZ Frontend" cmd /k "cd /d %CD% && npm run dev"

echo.
echo ========================================
echo   ✅ Frontend Started!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo.
echo Note: Backend has been removed.
echo API calls will fail until you set up a new backend.
echo.
echo Press any key to stop frontend...
pause > nul

echo.
echo Stopping frontend...
taskkill /FI "WindowTitle eq MytechZ Frontend*" /T /F > nul 2>&1
echo Done!