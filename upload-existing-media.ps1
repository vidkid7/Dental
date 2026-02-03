# Upload Existing Media Files to Database
# This script copies existing images and videos to frontend/public and adds them to the database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Upload Existing Media Files" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000/api/v1"

# Login and get token
Write-Host "1. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "superadmin@dental.com"
    password = "superadmin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "   Login successful" -ForegroundColor Green
    $token = $response.access_token
} catch {
    Write-Host "   Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Trying alternative credentials..." -ForegroundColor Yellow
    
    # Try alternative login
    $loginBody = @{
        email = "admin@dental.com"
        password = "admin123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        Write-Host "   Login successful with alternative credentials" -ForegroundColor Green
        $token = $response.access_token
    } catch {
        Write-Host "   All login attempts failed" -ForegroundColor Red
        exit
    }
}

$headers = @{
    "Authorization" = "Bearer $token"
}

# Copy images to frontend/public/images
Write-Host "`n2. Copying images to frontend/public/images..." -ForegroundColor Yellow
$imageSource = "images"
$imageDest = "frontend\public\images"

if (-not (Test-Path $imageDest)) {
    New-Item -ItemType Directory -Path $imageDest -Force | Out-Null
}

$imageFiles = Get-ChildItem -Path $imageSource -Filter *.jpeg
$imageCount = 0

foreach ($file in $imageFiles) {
    $destPath = Join-Path $imageDest $file.Name
    Copy-Item -Path $file.FullName -Destination $destPath -Force
    Write-Host "   Copied: $($file.Name)" -ForegroundColor Gray
    $imageCount++
}

Write-Host "   Copied $imageCount images" -ForegroundColor Green

# Copy videos to frontend/public/video
Write-Host "`n3. Copying videos to frontend/public/video..." -ForegroundColor Yellow
$videoSource = "video"
$videoDest = "frontend\public\video"

if (-not (Test-Path $videoDest)) {
    New-Item -ItemType Directory -Path $videoDest -Force | Out-Null
}

$videoFiles = Get-ChildItem -Path $videoSource -Filter *.mp4
$videoCount = 0

foreach ($file in $videoFiles) {
    $destPath = Join-Path $videoDest $file.Name
    Copy-Item -Path $file.FullName -Destination $destPath -Force
    Write-Host "   Copied: $($file.Name)" -ForegroundColor Gray
    $videoCount++
}

Write-Host "   Copied $videoCount videos" -ForegroundColor Green

# Add images to database
Write-Host "`n4. Adding images to database..." -ForegroundColor Yellow
$addedImages = 0

foreach ($file in $imageFiles) {
    $fileInfo = Get-Item (Join-Path $imageDest $file.Name)
    
    # Create media record
    $mediaData = @{
        name = $file.Name
        url = "/images/$($file.Name)"
        publicId = $file.Name
        type = "image"
        mimeType = "image/jpeg"
        size = $fileInfo.Length
        folder = "treatments"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/media" -Method Post -Body $mediaData -Headers $headers -ContentType "application/json"
        Write-Host "   Added: $($file.Name)" -ForegroundColor Gray
        $addedImages++
    } catch {
        Write-Host "   Failed to add $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "   Added $addedImages images to database" -ForegroundColor Green

# Add videos to database
Write-Host "`n5. Adding videos to database..." -ForegroundColor Yellow
$addedVideos = 0

foreach ($file in $videoFiles) {
    $fileInfo = Get-Item (Join-Path $videoDest $file.Name)
    
    # Create media record
    $mediaData = @{
        name = $file.Name
        url = "/video/$($file.Name)"
        publicId = $file.Name
        type = "video"
        mimeType = "video/mp4"
        size = $fileInfo.Length
        folder = "treatments"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/media" -Method Post -Body $mediaData -Headers $headers -ContentType "application/json"
        Write-Host "   Added: $($file.Name)" -ForegroundColor Gray
        $addedVideos++
    } catch {
        Write-Host "   Failed to add $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "   Added $addedVideos videos to database" -ForegroundColor Green

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Images copied: $imageCount" -ForegroundColor Green
Write-Host "Videos copied: $videoCount" -ForegroundColor Green
Write-Host "Images added to database: $addedImages" -ForegroundColor Green
Write-Host "Videos added to database: $addedVideos" -ForegroundColor Green
Write-Host ""
Write-Host "Total media files: $($addedImages + $addedVideos)" -ForegroundColor Cyan
Write-Host ""
Write-Host "View gallery at: http://localhost:3000/gallery" -ForegroundColor Yellow
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
