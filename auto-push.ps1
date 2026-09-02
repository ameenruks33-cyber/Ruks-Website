# Auto commit and push all changes to GitHub
# Run after making updates: powershell -ExecutionPolicy Bypass -File auto-push.ps1

Set-Location $PSScriptRoot

$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to push." -ForegroundColor Yellow
    exit 0
}

Write-Host "Committing changes..." -ForegroundColor Cyan
git add -A
$message = Read-Host "Commit message (press Enter for default)"
if ([string]::IsNullOrWhiteSpace($message)) {
    $message = "Update RukZa Fashion Hub"
}

git -c user.name="ameenruks33-cyber" -c user.email="ameenzeon@gmail.com" commit -m $message

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done! https://github.com/ameenruks33-cyber/Ruks-Website" -ForegroundColor Green
} else {
    Write-Host "Push failed. Run push-to-github.ps1 if login is needed." -ForegroundColor Red
}
