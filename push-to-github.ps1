# Push RukZa Fashion Hub to GitHub
# Run: Right-click -> Run with PowerShell  OR  powershell -ExecutionPolicy Bypass -File push-to-github.ps1

Write-Host ""
Write-Host "=== Push to GitHub: Ruks-Website ===" -ForegroundColor Cyan
Write-Host ""

$repoUrl = "https://github.com/ameenruks33-cyber/Ruks-Website.git"

Write-Host "You need a GitHub Personal Access Token from:" -ForegroundColor Yellow
Write-Host "https://github.com/settings/tokens" -ForegroundColor White
Write-Host "(Log in as: ameenruks33-cyber, check 'repo' permission)" -ForegroundColor Gray
Write-Host ""

$username = Read-Host "GitHub username (press Enter for ameenruks33-cyber)"
if ([string]::IsNullOrWhiteSpace($username)) { $username = "ameenruks33-cyber" }

$token = Read-Host "Paste your Personal Access Token" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan

$pushUrl = "https://${username}:${plainToken}@github.com/ameenruks33-cyber/Ruks-Website.git"
git push $pushUrl main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Your code is on GitHub:" -ForegroundColor Green
    Write-Host "https://github.com/ameenruks33-cyber/Ruks-Website" -ForegroundColor White
    Write-Host ""
    Write-Host "Next: Go to vercel.com -> Import this repo -> Deploy" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Push failed. Check your token has 'repo' permission." -ForegroundColor Red
    Write-Host "Create token: https://github.com/settings/tokens" -ForegroundColor Yellow
}

Write-Host ""
