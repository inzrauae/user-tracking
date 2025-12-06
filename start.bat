@echo off
echo Starting User Tracking Application...
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    if errorlevel 1 (
        echo Failed to start MongoDB. Please start it manually.
        echo Run: net start MongoDB
        pause
        exit /b 1
    )
) else (
    echo MongoDB is already running.
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 >nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Application started successfully!
echo.
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
