# One-time setup: GitHub push + Vercel auto-deploy from every push to main
#
# Run: powershell -ExecutionPolicy Bypass -File setup-auto-deploy.ps1

Write-Host ""
Write-Host "=== RukZa Auto-Deploy Setup ===" -ForegroundColor Cyan
Write-Host ""

$projectId = "prj_jVgE6KFVLpNL115R2x6DnCo7mfEE"
$orgId = "team_JSFALASfsTpSVJhhfE3PLgxz"
$repo = "ameenruks33-cyber/Ruks-Website"

Write-Host "STEP 1 — Connect Vercel to GitHub (do this in browser)" -ForegroundColor Yellow
Write-Host "  1. Open https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  2. Open project: ruks-website" -ForegroundColor White
Write-Host "  3. Settings -> Git -> Connect: $repo" -ForegroundColor White
Write-Host "  4. Production Branch: main" -ForegroundColor White
Write-Host ""

Write-Host "STEP 2 — Add GitHub Actions secrets (backup deploy)" -ForegroundColor Yellow
Write-Host "  Open: https://github.com/$repo/settings/secrets/actions" -ForegroundColor White
Write-Host ""
Write-Host "  Add these 3 secrets:" -ForegroundColor White
Write-Host "  +-------------------+--------------------------------------------------+" -ForegroundColor Gray
Write-Host "  | VERCEL_TOKEN      | https://vercel.com/account/tokens (Full Account) |" -ForegroundColor Gray
Write-Host "  | VERCEL_ORG_ID     | $orgId" -ForegroundColor Gray
Write-Host "  | VERCEL_PROJECT_ID | $projectId" -ForegroundColor Gray
Write-Host "  +-------------------+--------------------------------------------------+" -ForegroundColor Gray
Write-Host ""

$token = Read-Host "Paste VERCEL_TOKEN here to test (or press Enter to skip)"
if (-not [string]::IsNullOrWhiteSpace($token)) {
    $token = $token.Trim().Trim('"').Trim("'")
    $env:VERCEL_TOKEN = $token
    Write-Host ""
    Write-Host "Testing token..." -ForegroundColor Yellow
    $whoami = npx vercel whoami --token $token 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Token OK — logged in as: $whoami" -ForegroundColor Green
    } else {
        Write-Host "Token FAILED. Create a new one at vercel.com/account/tokens" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "STEP 3 — After Cursor makes changes, publish with:" -ForegroundColor Yellow
Write-Host '  powershell -ExecutionPolicy Bypass -File publish.ps1 -Message "what changed"' -ForegroundColor White
Write-Host ""
Write-Host "Or ask Cursor: 'publish to GitHub'" -ForegroundColor Gray
Write-Host ""
Write-Host "Live site: https://ruks-website.vercel.app" -ForegroundColor Cyan
Write-Host ""
