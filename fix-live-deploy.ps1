# Opens the pages you need to fix live deploy (run by double-click or in PowerShell)
Write-Host ""
Write-Host "=== Fix Live Site Deploy ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your code IS on GitHub but Vercel deploy is FAILING." -ForegroundColor Yellow
Write-Host "Reason: VERCEL_TOKEN secret is missing in GitHub Actions." -ForegroundColor Yellow
Write-Host ""
Write-Host "FASTEST FIX (2 minutes in browser):" -ForegroundColor Green
Write-Host "  1. Vercel opens -> Deployments -> Create Deployment" -ForegroundColor White
Write-Host "  2. Branch: main -> Deploy" -ForegroundColor White
Write-Host "  3. Wait until Ready, then Ctrl+Shift+R on your site" -ForegroundColor White
Write-Host ""
Write-Host "Opening browser tabs..." -ForegroundColor Gray

Start-Process "https://vercel.com/dashboard"
Start-Process "https://github.com/ameenruks33-cyber/Ruks-Website/actions/runs/33607005593"
Start-Process "https://github.com/ameenruks33-cyber/Ruks-Website/settings/secrets/actions/new"

Write-Host ""
Write-Host "PERMANENT FIX (so every push auto-deploys):" -ForegroundColor Green
Write-Host '  Run: powershell -File complete-setup.ps1 -VercelToken "vcp_YOUR_TOKEN"' -ForegroundColor White
Write-Host "  Get token: https://vercel.com/account/tokens" -ForegroundColor Gray
Write-Host ""
