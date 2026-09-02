# One-time Firebase + GitHub setup helper for RukZa Fashion Hub
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File setup-firebase-github.ps1

Write-Host ""
Write-Host "=== RukZa Firebase + GitHub Setup ===" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "Step 1/4: Firebase login (browser will open)..." -ForegroundColor Yellow
npx -y firebase-tools@latest login
if ($LASTEXITCODE -ne 0) { exit 1 }

$projectId = Read-Host "Enter your Firebase Project ID (e.g. rukza-fashion-hub)"
if ([string]::IsNullOrWhiteSpace($projectId)) {
    Write-Host "Project ID required." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2/4: Linking Firebase project..." -ForegroundColor Yellow
npx -y firebase-tools@latest use $projectId
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host ""
Write-Host "Step 3/4: Setting admin secrets..." -ForegroundColor Yellow
Write-Host "You will be prompted to enter each secret value." -ForegroundColor Gray
npx -y firebase-tools@latest apphosting:secrets:set ADMIN_PASSWORD
npx -y firebase-tools@latest apphosting:secrets:set ADMIN_SECRET
npx -y firebase-tools@latest apphosting:secrets:set AUTH_SECRET

Write-Host ""
Write-Host "Step 4/4: Deploy to Firebase App Hosting..." -ForegroundColor Yellow
npx -y firebase-tools@latest deploy --only apphosting
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Deploy failed. You may need to:" -ForegroundColor Yellow
    Write-Host "  1. Enable Blaze billing on Firebase" -ForegroundColor White
    Write-Host "  2. Connect GitHub in Firebase Console -> App Hosting" -ForegroundColor White
    Write-Host "  See FIREBASE_SETUP.md for full steps." -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host "Push to GitHub main = Firebase auto-updates (after GitHub is connected in console)" -ForegroundColor White
Write-Host "Full guide: FIREBASE_SETUP.md" -ForegroundColor Cyan
Write-Host ""
