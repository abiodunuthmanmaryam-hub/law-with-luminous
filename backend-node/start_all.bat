@echo off
setlocal
echo ===================================================
echo     STARTING LAW WITH LUMINOUS SERVICES
echo ===================================================

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH!
    echo Please install Node.js from https://nodejs.org/
    echo Once installed, restart your terminal and run this again.
    pause
    exit /b
)

:: Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in your PATH!
    pause
    exit /b
)

echo [1/3] Starting Node.js Backend (Database & Users)...
start "Luminous Node Backend" cmd /k "cd backend-node && node server.js"

echo [2/3] Starting Python AI Brain (Search Logic)...
if not exist "backend-python\venv" (
    echo [INFO] Creating Python virtual environment...
    cd backend-python && python -m venv venv && venv\Scripts\pip install -r requirements.txt && cd ..
)
start "Luminous Python AI" cmd /k "cd backend-python && venv\Scripts\uvicorn main:app --reload --port 8000"

echo [3/3] Starting React Frontend (Luminous UI)...
start "Luminous React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All 3 services are launching!
echo - React UI: http://localhost:5173
echo - Python AI: http://localhost:8000
echo - Node API: http://localhost:5000
echo.
echo If any window closes immediately, check for errors in that window.
pause
