@echo off
echo Stopping any existing Node processes...
taskkill /F /IM node.exe 2>nul

echo Starting backend server...
cd backend
node server.js
