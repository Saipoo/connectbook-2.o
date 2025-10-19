@echo off
echo.
echo ========================================
echo  RESTARTING BACKEND WITH AUTO-SEED
echo ========================================
echo.

cd backend

echo [1/3] Stopping any running backend...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Starting backend server...
echo Server will auto-seed internships and hackathons if database is empty
echo.

start "ConnectBook Backend" cmd /k "npm run dev"

echo.
echo [3/3] Backend started in new window!
echo.
echo Check the backend console for seed status
echo Look for messages like:
echo   - MongoDB Connected Successfully
echo   - Successfully seeded X internships
echo   - Successfully seeded X hackathons
echo.
echo Backend running at: http://localhost:5000
echo.

pause
