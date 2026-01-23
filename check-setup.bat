@echo off
echo ========================================
echo   MytechZ Setup Checker
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version > nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js from https://nodejs.org
    goto :end
) else (
    node --version
    echo ✅ Node.js installed
)

echo.
echo [2/5] Checking npm...
npm --version > nul 2>&1
if errorlevel 1 (
    echo ❌ npm not found!
    goto :end
) else (
    npm --version
    echo ✅ npm installed
)

echo.
echo [3/5] Checking server dependencies...
if exist "server\node_modules" (
    echo ✅ Server dependencies installed
) else (
    echo ⚠️  Server dependencies not installed
    echo    Run: cd server && npm install
)

echo.
echo [4/5] Checking client dependencies...
if exist "client\node_modules" (
    echo ✅ Client dependencies installed
) else (
    echo ⚠️  Client dependencies not installed
    echo    Run: cd client && npm install
)

echo.
echo [5/5] Checking environment files...
if exist "server\.env" (
    echo ✅ server/.env exists
) else (
    echo ❌ server/.env missing!
    echo    Copy server/.env.example to server/.env
)

if exist "client\.env" (
    echo ✅ client/.env exists
) else (
    echo ⚠️  client/.env missing (optional)
    echo    Copy client/.env.example to client/.env if needed
)

echo.
echo ========================================
echo   Setup Check Complete
echo ========================================
echo.
echo Next step: Run start-dev.bat to start the application
echo.

:end
pause
