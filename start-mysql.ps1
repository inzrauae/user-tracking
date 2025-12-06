# Start User Tracking Application with MySQL

Write-Host "Starting User Tracking Application (MySQL Version)..." -ForegroundColor Green
Write-Host ""

# Check if MySQL is running
Write-Host "Checking MySQL..." -ForegroundColor Yellow

$mysqlServices = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue

if ($mysqlServices) {
    $runningService = $mysqlServices | Where-Object { $_.Status -eq 'Running' } | Select-Object -First 1
    
    if ($runningService) {
        Write-Host "MySQL is running ($($runningService.Name))." -ForegroundColor Green
    } else {
        Write-Host "MySQL service found but not running. Attempting to start..." -ForegroundColor Yellow
        $serviceToStart = $mysqlServices | Select-Object -First 1
        try {
            Start-Service -Name $serviceToStart.Name
            Start-Sleep -Seconds 2
            Write-Host "MySQL started successfully." -ForegroundColor Green
        } catch {
            Write-Host "Failed to start MySQL. Please start it manually." -ForegroundColor Red
            Write-Host "Try: net start $($serviceToStart.Name)" -ForegroundColor Cyan
            pause
            exit
        }
    }
} else {
    Write-Host "MySQL service not found." -ForegroundColor Yellow
    Write-Host "If using XAMPP, please start MySQL from XAMPP Control Panel" -ForegroundColor Cyan
    Write-Host "If MySQL is not installed, see QUICK_START_MYSQL.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to continue anyway (if MySQL is running)..." -ForegroundColor Yellow
    pause
}

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "MySQL Database: user_tracking" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check backend terminal for database connection status" -ForegroundColor Yellow
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
pause
