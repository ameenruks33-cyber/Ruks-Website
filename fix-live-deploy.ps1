# Opens the pages you need to fix live deploy (run by double-click or in PowerShell)
Write-Host ""
Write-Host "=== Fix Live Site Deploy ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your code IS on GitHub but Vercel deploy is FAILING." -ForegroundColor Yellow
Write-Host "Reason: no VERCEL_DEPLOY_HOOK or VERCEL_TOKEN in GitHub Secrets." -ForegroundColor Yellow
Write-Host ""
Write-Host "EASIEST FIX (2 minutes):" -ForegroundColor Green
Write-Host "  1. Vercel -> ruks-website -> Settings -> Git -> Deploy Hooks" -ForegroundColor White
Write-Host "  2. Create hook (branch main), copy URL" -ForegroundColor White
Write-Host "  3. GitHub -> Secrets -> New -> VERCEL_DEPLOY_HOOK = paste URL" -ForegroundColor White
Write-Host "  4. Actions -> Deploy to Vercel -> Run workflow" -ForegroundColor White
Write-Host ""
Write-Host "INSTANT FIX (no secret):" -ForegroundColor Green
Write-Host "  Vercel -> Deployments -> Create Deployment -> main -> Deploy" -ForegroundColor White
Write-Host ""
Write-Host "Opening browser tabs..." -ForegroundColor Gray

Start-Process "https://vercel.com/dashboard"
Start-Process "https://github.com/ameenruks33-cyber/Ruks-Website/actions/workflows/deploy-vercel.yml"
Start-Process "https://github.com/ameenruks33-cyber/Ruks-Website/settings/secrets/actions/new"

Write-Host ""
Write-Host "See full steps: FIX-DEPLOY-NOW.md" -ForegroundColor Gray
Write-Host ""
