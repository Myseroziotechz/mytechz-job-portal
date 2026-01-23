@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🔄 UPDATING NGROK URL 🔄                       ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo New Ngrok URL: https://9dce45d1cde6.ngrok-free.app
echo.
echo ════════════════════════════════════════════════════════════════
echo Step 1: Building Frontend with New URL...
echo ════════════════════════════════════════════════════════════════
echo.
cd client
call npm run build
echo.
echo ✅ Build complete!
echo.
echo ════════════════════════════════════════════════════════════════
echo Step 2: Deploying to Netlify...
echo ════════════════════════════════════════════════════════════════
echo.
call netlify deploy --prod --dir=dist
echo.
echo ✅ Deployment complete!
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 🎯 NEXT STEPS:
echo.
echo 1. Open: https://9dce45d1cde6.ngrok-free.app
echo 2. Click: "Visit Site"
echo 3. Open: https://moonlit-elf-6007d5.netlify.app
echo.
echo ✅ Everything should work now!
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
