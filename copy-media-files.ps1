# Copy Existing Media Files to Frontend Public Folder
# This script copies images and videos to the correct locations

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Copy Media Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create destination directories if they don't exist
$imageDest = "frontend\public\images"
$videoDest = "frontend\public\video"

if (-not (Test-Path $imageDest)) {
    New-Item -ItemType Directory -Path $imageDest -Force | Out-Null
    Write-Host "Created directory: $imageDest" -ForegroundColor Green
}

if (-not (Test-Path $videoDest)) {
    New-Item -ItemType Directory -Path $videoDest -Force | Out-Null
    Write-Host "Created directory: $videoDest" -ForegroundColor Green
}

# Copy images
Write-Host "`nCopying images..." -ForegroundColor Yellow
$imageSource = "images"
$imageCount = 0

if (Test-Path $imageSource) {
    $imageFiles = Get-ChildItem -Path $imageSource -Filter *.jpeg
    
    foreach ($file in $imageFiles) {
        $destPath = Join-Path $imageDest $file.Name
        Copy-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "  Copied: $($file.Name)" -ForegroundColor Gray
        $imageCount++
    }
    
    Write-Host "  Total images copied: $imageCount" -ForegroundColor Green
} else {
    Write-Host "  Source folder not found: $imageSource" -ForegroundColor Red
}

# Copy videos
Write-Host "`nCopying videos..." -ForegroundColor Yellow
$videoSource = "video"
$videoCount = 0

if (Test-Path $videoSource) {
    $videoFiles = Get-ChildItem -Path $videoSource -Filter *.mp4
    
    foreach ($file in $videoFiles) {
        $destPath = Join-Path $videoDest $file.Name
        Copy-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "  Copied: $($file.Name)" -ForegroundColor Gray
        $videoCount++
    }
    
    Write-Host "  Total videos copied: $videoCount" -ForegroundColor Green
} else {
    Write-Host "  Source folder not found: $videoSource" -ForegroundColor Red
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Images copied: $imageCount" -ForegroundColor Green
Write-Host "Videos copied: $videoCount" -ForegroundColor Green
Write-Host "Total files: $($imageCount + $videoCount)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files are now in:" -ForegroundColor Yellow
Write-Host "  - $imageDest" -ForegroundColor White
Write-Host "  - $videoDest" -ForegroundColor White
Write-Host ""
Write-Host "Next step: Run the database import script" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  npm run ts-node scripts/import-existing-media.ts" -ForegroundColor White
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
