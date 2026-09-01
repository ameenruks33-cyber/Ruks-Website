# One-time Vercel setup: link project, Blob storage, production deploy
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File setup-vercel-auto.ps1 -Token "your_vercel_token"

param(
    [string]$Token = $env:VERCEL_TOKEN
)

Write-Host ""
Write-Host "=== RukZa Vercel Auto Setup ===" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrWhiteSpace($Token)) {
    $Token = Read-Host "Paste your Vercel token (https://vercel.com/account/tokens)"
}

$Token = $Token.Trim().Trim('"').Trim("'")

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host "Token required. Exiting." -ForegroundColor Red
    exit 1
}

if ($Token.Length -lt 20) {
    Write-Host "Token looks too short. Copy the full token from Vercel." -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot
$env:VERCEL_TOKEN = $Token

Write-Host ""
Write-Host "Step 1/4: Linking project to Vercel..." -ForegroundColor Yellow
npx vercel link --yes --token $Token
if ($LASTEXITCODE -ne 0) {
    Write-Host "Link failed. Check your token and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2/4: Creating Blob store (rukza-store)..." -ForegroundColor Yellow
npx vercel blob create-store rukza-store --access public --yes --token $Token
if ($LASTEXITCODE -ne 0) {
    Write-Host "Blob store may already exist - continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3/4: Pulling environment variables..." -ForegroundColor Yellow
npx vercel env pull .env.vercel --yes --environment=production --token $Token

Write-Host ""
Write-Host "Step 4/4: Deploying to production..." -ForegroundColor Yellow
npx vercel deploy --prod --yes --token $Token

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "GitHub push to main = auto Vercel update" -ForegroundColor White
    Write-Host "Admin edits now save on live website (Blob connected)" -ForegroundColor White
    Write-Host ""
    Write-Host "Open your live admin: https://YOUR-SITE.vercel.app/admin/login" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Deploy failed. Check token and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
