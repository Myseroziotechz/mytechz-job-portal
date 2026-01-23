@echo off
echo ========================================
echo   Deploying Profile Dropdown Fix
echo ========================================
echo.
echo BUGS FIXED:
echo - Rotating rectangle animation
echo - Overlapping navigation layers
echo - Confusing drawer UX
echo.
echo NEW FEATURES:
echo - Clean Naukri-style dropdown
echo - Profile completion ring
echo - Performance metrics
echo - Role-based menus
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
echo   Profile dropdown is now live!
echo   No more rotating bugs!
echo ========================================
echo.
echo Frontend: https://moonlit-elf-6007d5.netlify.app
echo Backend: https://mytechz-job-portal.onrender.com
echo.
echo Test the new dropdown:
echo 1. Click your profile avatar
echo 2. See clean dropdown panel
echo 3. No rotating elements!
echo 4. Click outside to close
echo.
pause
