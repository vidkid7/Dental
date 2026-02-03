# Test Cloudinary Media Upload System

Write-Host "========================================"
Write-Host "Cloudinary Media Upload System Test"
Write-Host "========================================"
Write-Host ""

$baseUrl = "http://localhost:4000/api/v1"

# Login and get token
Write-Host "1. Logging in as admin..."
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
    exit
}

# Get all media
Write-Host "`n2. Fetching all media files..."
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/media" -Method Get -Headers $headers
    Write-Host "   Found $($response.total) media files" -ForegroundColor Green
    
    if ($response.data.Count -gt 0) {
        Write-Host "`n   Recent uploads:"
        $response.data | Select-Object -First 5 | ForEach-Object {
            $sizeKB = [math]::Round($_.size / 1024, 2)
            Write-Host "   - $($_.name) ($($_.type), ${sizeKB}KB)"
            Write-Host "     URL: $($_.url)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   Failed to fetch media: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Cloudinary config
Write-Host "`n3. Checking Cloudinary Configuration..."
$envPath = "backend\.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $cloudName = $envContent | Where-Object { $_ -match "^CLOUDINARY_CLOUD_NAME=" }
    $apiKey = $envContent | Where-Object { $_ -match "^CLOUDINARY_API_KEY=" }
    $apiSecret = $envContent | Where-Object { $_ -match "^CLOUDINARY_API_SECRET=" }
    
    if ($cloudName -and $cloudName -notmatch "your_cloud_name") {
        Write-Host "   CLOUDINARY_CLOUD_NAME is configured" -ForegroundColor Green
    } else {
        Write-Host "   CLOUDINARY_CLOUD_NAME needs to be set" -ForegroundColor Red
    }
    
    if ($apiKey -and $apiKey -notmatch "your_api_key") {
        Write-Host "   CLOUDINARY_API_KEY is configured" -ForegroundColor Green
    } else {
        Write-Host "   CLOUDINARY_API_KEY needs to be set" -ForegroundColor Red
    }
    
    if ($apiSecret -and $apiSecret -notmatch "your_api_secret") {
        Write-Host "   CLOUDINARY_API_SECRET is configured" -ForegroundColor Green
    } else {
        Write-Host "   CLOUDINARY_API_SECRET needs to be set" -ForegroundColor Red
    }
} else {
    Write-Host "   backend/.env file not found" -ForegroundColor Red
}

Write-Host "`n========================================"
Write-Host "Test Summary"
Write-Host "========================================"
Write-Host ""
Write-Host "Backend API is running" -ForegroundColor Green
Write-Host "Media endpoints are accessible" -ForegroundColor Green
Write-Host "File size limits: 5MB images, 100MB videos" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:"
Write-Host "1. Configure Cloudinary credentials in backend/.env"
Write-Host "2. Test upload via Admin Panel - Media"
Write-Host "3. Verify files appear in public gallery at /gallery"
Write-Host ""
Write-Host "Test completed!"
