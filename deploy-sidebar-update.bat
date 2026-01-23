@echo off
echo ========================================
echo   Deploying Naukri Sidebar Redesign
echo ========================================
echo.

cd client

echo [1/3] Building production bundle...
call npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Deploying to Netlify...
call netlify deploy --prod --dir=dist
if errorlevel 1 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Deployment complete!
echo.
echo ========================================
echo   Your site is now live with the new
echo   Naukri-style sidebar design!
echo ========================================
echo.
echo Frontend: https://moonlit-elf-6007d5.netlify.app
echo Backend: https://mytechz-job-portal.onrender.com
echo.
pause
