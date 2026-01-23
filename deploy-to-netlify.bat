@echo off
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                              ║
echo ║              🚀 AUTO DEPLOY TO NETLIFY 🚀                                   ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo.

echo [1/3] Navigating to client folder...
cd client
echo ✅ Done
echo.

echo [2/3] Building production bundle...
echo This may take 1-2 minutes...
echo.
call npm run build
echo.
echo ✅ Build complete!
echo.

echo [3/3] Deploying to Netlify...
echo.
call netlify deploy --prod --dir=dist --site=moonlit-elf-6007d5
echo.
echo ✅ Deployment complete!
echo.

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                              ║
echo ║                    ✅ DEPLOYED SUCCESSFULLY! ✅                             ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo.

echo 🌐 Your website is live at:
echo    https://moonlit-elf-6007d5.netlify.app
echo.
echo ✨ Changes are now live!
echo.
echo 💡 To deploy again after making changes:
echo    1. Make your code changes
echo    2. Run: deploy-to-netlify.bat
echo    3. Done! Changes will be live in 30 seconds
echo.
echo.

pause
