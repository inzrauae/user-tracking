# Start User Tracking Application

Write-Host "Starting User Tracking Application..." -ForegroundColor Green
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService -eq $null) {
    Write-Host "MongoDB service not found. Please install MongoDB." -ForegroundColor Red
    Write-Host "Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
    pause
    exit
}

if ($mongoService.Status -ne 'Running') {
    Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
    Start-Service -Name MongoDB
    Start-Sleep -Seconds 2
}

$mongoService = Get-Service -Name MongoDB
if ($mongoService.Status -eq 'Running') {
    Write-Host "MongoDB is running." -ForegroundColor Green
} else {
    Write-Host "Failed to start MongoDB. Please start it manually." -ForegroundColor Red
    pause
    exit
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
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
pause
