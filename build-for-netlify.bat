@echo off
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                              ║
echo ║                    🚀 BUILDING FOR NETLIFY 🚀                               ║
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

echo [3/3] Build summary...
echo.
echo ✅ Production files created in: client/dist
echo ✅ Ready to deploy to Netlify!
echo.
echo.

echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                              ║
echo ║                    ✅ BUILD COMPLETE! ✅                                    ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo.

echo 📦 Next Steps:
echo.
echo METHOD 1: Drag & Drop (Easiest)
echo    1. Go to: https://app.netlify.com/drop
echo    2. Drag the 'client/dist' folder
echo    3. Drop it on the page
echo    4. Done! ✅
echo.
echo METHOD 2: Netlify CLI
echo    1. Run: netlify login
echo    2. Run: netlify deploy --prod
echo    3. Select 'dist' as publish directory
echo    4. Done! ✅
echo.
echo.

echo 🌐 Backend URL (Ngrok):
echo    https://4f5bf3dc95aa.ngrok-free.app
echo.
echo ⚠️  Make sure Django and Ngrok are running!
echo.
echo.

pause
