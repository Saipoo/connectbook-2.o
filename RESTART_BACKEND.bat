@echo off
echo ============================================
echo  RESTARTING BACKEND SERVER
echo ============================================
echo.
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting backend server...
cd /d "c:\Users\Dell\Desktop\crap cb major\backend"
start cmd /k "node server.js"
echo.
echo ============================================
echo Backend server restarted!
echo Check the new terminal window for output
echo ============================================
pause
