@echo off
setlocal enabledelayedexpansion
set SCRIPT_DIR=%~dp0

echo.
echo  DRISHTI — Exam Integrity Intelligence Platform
echo  FAR AWAY 2026
echo.
echo  Starting backend on port 8000...
start "DRISHTI Backend" cmd /k "cd /d "!SCRIPT_DIR!backend" && python -m uvicorn main:app --reload --port 8000 --host 127.0.0.1"
timeout /t 5 /nobreak > nul

echo  Starting frontend on port 5173...
start "DRISHTI Frontend" cmd /k "cd /d "!SCRIPT_DIR!frontend" && npm run dev"

echo.
echo  Backend  ^> http://localhost:8000
echo  Frontend ^> http://localhost:5173
echo  API Docs ^> http://localhost:8000/docs
echo.
echo  Connecting in browser...
timeout /t 3 /nobreak > nul

REM Try to open browser
start http://localhost:5173

pause
