# Commit + push to GitHub. Vercel deploys automatically after push.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File publish.ps1
#   powershell -ExecutionPolicy Bypass -File publish.ps1 -Message "Fix admin marketing loading"
#
param(
    [string]$Message = ""
)

Set-Location $PSScriptRoot

$status = git status --porcelain
if (-not $status) {
    Write-Host "Nothing to publish - working tree clean." -ForegroundColor Yellow
    exit 0
}

if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = "Update RukZa Fashion Hub from Cursor"
}

Write-Host ""
Write-Host "=== Publish to GitHub + Vercel ===" -ForegroundColor Cyan
Write-Host ""

git add -A

git -c user.name="ameenruks33-cyber" -c user.email="ameenzeon@gmail.com" commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "Commit failed." -ForegroundColor Red
    exit 1
}

Write-Host "Pushing to GitHub (main)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Push failed. Fix GitHub login, then run again:" -ForegroundColor Red
    Write-Host "  powershell -ExecutionPolicy Bypass -File push-to-github.ps1" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "SUCCESS - pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Vercel will deploy automatically in 2-4 minutes:" -ForegroundColor Cyan
Write-Host "  https://ruks-website.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "Track deploy:" -ForegroundColor Gray
Write-Host "  https://vercel.com -> ruks-website -> Deployments" -ForegroundColor Gray
Write-Host "  https://github.com/ameenruks33-cyber/Ruks-Website/actions" -ForegroundColor Gray
Write-Host ""
