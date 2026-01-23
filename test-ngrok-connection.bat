@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🔍 TESTING NGROK CONNECTION 🔍                 ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Testing backend connection...
echo.
echo Step 1: Testing local backend (http://127.0.0.1:8000)
curl -s http://127.0.0.1:8000/api/jobs/public
echo.
echo.
echo Step 2: Testing ngrok tunnel (https://4f5bf3dc95aa.ngrok-free.app)
curl -s https://4f5bf3dc95aa.ngrok-free.app/api/jobs/public
echo.
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo If you see HTML with "ngrok" in it, you need to:
echo 1. Open: https://4f5bf3dc95aa.ngrok-free.app
echo 2. Click "Visit Site"
echo 3. Then try again
echo.
echo If you see JSON data, ngrok is working! ✅
echo.
pause
