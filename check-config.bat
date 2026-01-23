@echo off
echo ============================================
echo   CONFIGURATION CHECKER
echo ============================================
echo.

echo Checking Backend Configuration...
echo ----------------------------------------
if exist "server\.env" (
    echo [OK] server/.env exists
    
    findstr /C:"MONGO_URI=mongodb" server\.env >nul
    if errorlevel 1 (
        echo [WARNING] MONGO_URI not configured properly
        echo Please add your MongoDB connection string
    ) else (
        echo [OK] MONGO_URI is set
    )
    
    findstr /C:"JWT_SECRET=" server\.env >nul
    if errorlevel 1 (
        echo [WARNING] JWT_SECRET not set
    ) else (
        echo [OK] JWT_SECRET is set
    )
    
    findstr /C:"PORT=" server\.env >nul
    if errorlevel 1 (
        echo [WARNING] PORT not set
    ) else (
        echo [OK] PORT is set
    )
) else (
    echo [ERROR] server/.env not found!
    echo Run setup-complete.bat first
)
echo.

echo Checking Frontend Configuration...
echo ----------------------------------------
if exist "client\.env" (
    echo [OK] client/.env exists
    
    findstr /C:"VITE_API_BASE_URL=" client\.env >nul
    if errorlevel 1 (
        echo [WARNING] VITE_API_BASE_URL not set
    ) else (
        echo [OK] VITE_API_BASE_URL is set
    )
) else (
    echo [ERROR] client/.env not found!
    echo Run setup-complete.bat first
)
echo.

echo Checking Dependencies...
echo ----------------------------------------
if exist "server\node_modules" (
    echo [OK] Backend dependencies installed
) else (
    echo [WARNING] Backend dependencies not installed
    echo Run: cd server ^&^& npm install
)

if exist "client\node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [WARNING] Frontend dependencies not installed
    echo Run: cd client ^&^& npm install
)
echo.

echo ============================================
echo   Configuration Check Complete
echo ============================================
echo.
echo Next steps:
echo   1. If warnings above, fix configuration
echo   2. Run: cd server ^&^& node test-full-connection.js
echo   3. Run: start-dev.bat
echo.
pause
