@echo off
echo ========================================
echo PUSHING TO GITHUB - siva-dataworker
echo ========================================
echo.
echo This will open your browser for authentication.
echo Please login with: sivabalan.dataworker@gmail.com
echo.
pause

cd /d "%~dp0"

echo.
echo Checking git status...
git status

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Code pushed to GitHub.
) else (
    echo FAILED! Please check the error above.
    echo.
    echo ALTERNATIVE METHOD:
    echo 1. Open GitHub Desktop
    echo 2. Click "Push origin" button
    echo 3. Login with sivabalan.dataworker@gmail.com if prompted
)
echo ========================================
echo.
pause
