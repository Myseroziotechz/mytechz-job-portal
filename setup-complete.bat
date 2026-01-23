@echo off
echo ============================================
echo   MYTECHZ COMPLETE SETUP SCRIPT
echo ============================================
echo.

echo Step 1: Checking Node.js installation...
echo ----------------------------------------
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo [OK] Node.js is installed
echo.

echo Step 2: Installing Backend Dependencies...
echo ----------------------------------------
cd server
if not exist node_modules (
    echo Installing backend packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Backend installation failed!
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)
cd ..
echo.

echo Step 3: Installing Frontend Dependencies...
echo ----------------------------------------
cd client
if not exist node_modules (
    echo Installing frontend packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Frontend installation failed!
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)
cd ..
echo.

echo Step 4: Checking Environment Configuration...
echo ----------------------------------------
if not exist "server\.env" (
    echo [WARNING] server/.env not found!
    echo Creating from template...
    copy "server\.env.template" "server\.env"
    echo.
    echo [ACTION REQUIRED] Please configure server/.env with:
    echo   1. MongoDB connection string (MONGO_URI)
    echo   2. JWT secret key
    echo   3. Email credentials (optional)
    echo.
    echo See MONGODB_SETUP_GUIDE.md for MongoDB setup instructions
    echo.
) else (
    echo [OK] server/.env exists
)

if not exist "client\.env" (
    echo [WARNING] client/.env not found!
    echo Creating from template...
    copy "client\.env.template" "client\.env"
    echo [OK] client/.env created
) else (
    echo [OK] client/.env exists
)
echo.

echo Step 5: Testing MongoDB Connection...
echo ----------------------------------------
cd server
echo Running connection test...
node test-full-connection.js
if errorlevel 1 (
    echo.
    echo [WARNING] MongoDB connection test failed
    echo Please configure your MongoDB credentials in server/.env
    echo See MONGODB_SETUP_GUIDE.md for detailed instructions
    echo.
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo ============================================
echo   SETUP COMPLETED SUCCESSFULLY!
echo ============================================
echo.
echo Your application is ready to run!
echo.
echo To start development:
echo   1. Run: start-dev.bat
echo   2. Backend will run on: http://localhost:5010
echo   3. Frontend will run on: http://localhost:5173
echo.
echo Need help? Check these files:
echo   - MONGODB_SETUP_GUIDE.md (MongoDB setup)
echo   - README.md (General documentation)
echo   - TROUBLESHOOTING.md (Common issues)
echo.
pause
