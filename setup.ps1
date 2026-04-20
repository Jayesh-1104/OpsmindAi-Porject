#!/usr/bin/env pwsh
# Opsmind AI Setup Script for Windows PowerShell

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Opsmind AI - Project Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node -v 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green

# Check if npm is installed
$npmVersion = npm -v 2>$null
if ($null -eq $npmVersion) {
    Write-Host "ERROR: npm is not installed." -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Root dependencies installed" -ForegroundColor Green
Write-Host ""

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location opsmind-backend-new
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Setup backend .env if not exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating backend .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠ Please update backend/.env with your MongoDB and API keys" -ForegroundColor Yellow
} else {
    Write-Host "✓ Backend .env file already exists" -ForegroundColor Green
}
Write-Host ""

# Back to root
Set-Location ..

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location opsmind-frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Setup frontend .env if not exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating frontend .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Frontend .env created" -ForegroundColor Green
} else {
    Write-Host "✓ Frontend .env file already exists" -ForegroundColor Green
}
Write-Host ""

Set-Location ..

# Setup complete
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Update backend configuration:"
Write-Host "   - Edit: opsmind-backend-new/.env"
Write-Host "   - Add your MongoDB connection string"
Write-Host "   - Add your Gemini API key"
Write-Host ""
Write-Host "2. Start the backend (in one terminal):"
Write-Host "   - npm run dev:backend"
Write-Host ""
Write-Host "3. Start the frontend (in another terminal):"
Write-Host "   - npm run dev:frontend"
Write-Host ""
Write-Host "4. Open your browser and navigate to: http://localhost:3000"
Write-Host ""
