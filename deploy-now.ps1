# Deploy latest code to Vercel NOW
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File deploy-now.ps1
#
# Get your token: https://vercel.com/account/tokens

param(
    [string]$Token = $env:VERCEL_TOKEN
)

Write-Host ""
Write-Host "=== Deploy RukZa to Vercel (LIVE) ===" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host "You need a Vercel token (free):" -ForegroundColor Yellow
    Write-Host "1. Open https://vercel.com/account/tokens" -ForegroundColor White
    Write-Host "2. Create Token -> Full Access -> copy it" -ForegroundColor White
    Write-Host ""
    $Token = Read-Host "Paste your Vercel token here"
}

$Token = $Token.Trim().Trim('"').Trim("'")

if ([string]::IsNullOrWhiteSpace($Token) -or $Token.Length -lt 20) {
    Write-Host "Invalid token. Get one from https://vercel.com/account/tokens" -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot
$env:VERCEL_TOKEN = $Token

Write-Host ""
Write-Host "Deploying to https://ruks-website.vercel.app ..." -ForegroundColor Yellow
Write-Host "This takes 2-4 minutes. Do not close this window." -ForegroundColor Gray
Write-Host ""

# Correct team scope (typo in old orgId caused Not authorized)
npx vercel deploy --prod --yes --scope ameenruks33-cybers-projects --token $Token

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Live site updated." -ForegroundColor Green
    Write-Host ""
    Write-Host "Open these URLs:" -ForegroundColor Cyan
    Write-Host "  Admin:     https://ruks-website.vercel.app/admin/login" -ForegroundColor White
    Write-Host "  Marketing: https://ruks-website.vercel.app/admin/marketing" -ForegroundColor White
    Write-Host "  Shop:      https://ruks-website.vercel.app/shop/slim-fit-dress-shirt" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Deploy failed. Check your token and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
