# One-command setup: Vercel token -> GitHub secret + live deploy
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File complete-setup.ps1 -VercelToken "vcp_xxxx"
#
param(
    [Parameter(Mandatory = $true)]
    [string]$VercelToken
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$VercelToken = $VercelToken.Trim().Trim('"').Trim("'")
$repo = "ameenruks33-cyber/Ruks-Website"
$orgId = "team_JSFALASTsTpSVJhhfE3PLgxz"
$projectId = "prj_jVgE6KFVLpNL115R2x6DnCo7mfEE"

Write-Host ""
Write-Host "=== Complete Auto-Deploy Setup ===" -ForegroundColor Cyan
Write-Host ""

# 1. Test Vercel token
Write-Host "[1/4] Testing Vercel token..." -ForegroundColor Yellow
$env:VERCEL_TOKEN = $VercelToken
$whoami = npx vercel whoami --token $VercelToken 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel token failed. Create a new one at https://vercel.com/account/tokens" -ForegroundColor Red
    Write-Host $whoami
    exit 1
}
Write-Host "  OK - Vercel account: $whoami" -ForegroundColor Green

# 2. GitHub CLI login check
Write-Host "[2/4] Checking GitHub CLI..." -ForegroundColor Yellow
$ghPath = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghPath) {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
}

$ghAuth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  GitHub not logged in. Opening browser login..." -ForegroundColor Yellow
    Write-Host "  Complete the login in your browser, then run this script again." -ForegroundColor White
    gh auth login -h github.com -p https -w -s repo,workflow
    if ($LASTEXITCODE -ne 0) {
        Write-Host "GitHub login failed or was cancelled." -ForegroundColor Red
        exit 1
    }
}
Write-Host "  OK - GitHub CLI ready" -ForegroundColor Green

# 3. Save GitHub secret (only VERCEL_TOKEN needed - IDs are in workflow file)
Write-Host "[3/4] Saving VERCEL_TOKEN to GitHub Actions secrets..." -ForegroundColor Yellow
gh secret set VERCEL_TOKEN --body $VercelToken --repo $repo
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to set GitHub secret." -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Secret saved" -ForegroundColor Green

# 4. Deploy live now
Write-Host "[4/4] Deploying to production..." -ForegroundColor Yellow
npx vercel deploy --prod --yes --token $VercelToken
if ($LASTEXITCODE -ne 0) {
    Write-Host "Deploy failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "ALL DONE!" -ForegroundColor Green
Write-Host ""
Write-Host "Live site:  https://ruks-website.vercel.app" -ForegroundColor Cyan
Write-Host "Marketing:  https://ruks-website.vercel.app/admin/marketing" -ForegroundColor Cyan
Write-Host ""
Write-Host "From now on, after Cursor changes run:" -ForegroundColor White
Write-Host '  powershell -ExecutionPolicy Bypass -File publish.ps1 -Message "what changed"' -ForegroundColor Gray
Write-Host ""
Write-Host "Also connect Git in Vercel (one time in browser):" -ForegroundColor Yellow
Write-Host "  https://vercel.com -> ruks-website -> Settings -> Git -> Connect Ruks-Website" -ForegroundColor Gray
Write-Host ""
