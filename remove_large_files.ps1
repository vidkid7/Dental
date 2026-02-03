# Script to remove node_modules from git history
# This will rewrite your git history to remove all node_modules files

Write-Host "This script will remove node_modules from your entire git history." -ForegroundColor Yellow
Write-Host "This is necessary because GitHub rejects files over 100MB." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: This will rewrite git history!" -ForegroundColor Red
Write-Host "Press Ctrl+C to cancel, or press Enter to continue..." -ForegroundColor Yellow
Read-Host

# Method 1: Using git filter-branch (built-in, slower but works)
Write-Host "Removing node_modules from git history..." -ForegroundColor Green

git filter-branch --force --index-filter `
  "git rm -r --cached --ignore-unmatch node_modules frontend/node_modules backend/node_modules" `
  --prune-empty --tag-name-filter cat -- --all

Write-Host ""
Write-Host "Cleaning up..." -ForegroundColor Green
Remove-Item -Path .git/refs/original -Recurse -Force -ErrorAction SilentlyContinue
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host ""
Write-Host "Done! Now you can push to GitHub with:" -ForegroundColor Green
Write-Host "git push origin main --force" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: This is a force push and will overwrite the remote repository!" -ForegroundColor Yellow
