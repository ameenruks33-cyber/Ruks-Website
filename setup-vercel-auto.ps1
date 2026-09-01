# One-time Vercel setup: link project, Blob storage, production deploy
# Usage: powershell -ExecutionPolicy Bypass -File setup-vercel-auto.ps1

Write-Host ""
Write-Host "=== RukZa Vercel Auto Setup ===" -ForegroundColor Cyan
Write-Host ""

$token = Read-Host "Paste your Vercel token (https://vercel.com/account/tokens)"
if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "Token required. Exiting." -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot
$env:VERCEL_TOKEN = $token

Write-Host ""
Write-Host "Step 1/4: Linking project to Vercel..." -ForegroundColor Yellow
npx vercel link --yes --token $token
if ($LASTEXITCODE -ne 0) {
    Write-Host "Link failed. Try: npx vercel login" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2/4: Creating Blob store (rukza-store)..." -ForegroundColor Yellow
npx vercel blob create-store rukza-store --access public --yes --token $token
if ($LASTEXITCODE -ne 0) {
    Write-Host "Blob create may have failed if store already exists — continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3/4: Pulling environment variables..." -ForegroundColor Yellow
npx vercel env pull .env.vercel --yes --environment=production --token $token

Write-Host ""
Write-Host "Step 4/4: Deploying to production..." -ForegroundColor Yellow
npx vercel deploy --prod --yes --token $token

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "- GitHub push to main = auto Vercel update (if GitHub connected)" -ForegroundColor White
    Write-Host "- Admin edits now save to Blob on live website" -ForegroundColor White
    Write-Host ""
    Write-Host "See VERCEL_SETUP.md for GitHub Actions secrets (optional)" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "Deploy failed. Check token and try again." -ForegroundColor Red
}

Write-Host ""
