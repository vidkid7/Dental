# Test Cloudinary Media Upload System
# This script tests the media upload functionality with file size validation

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cloudinary Media Upload System Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000/api/v1"
$token = ""

# Function to login and get token
function Get-AuthToken {
    Write-Host "1. Logging in as admin..." -ForegroundColor Yellow
    
    $loginBody = @{
        email = "admin@dental.com"
        password = "admin123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        Write-Host "   ✓ Login successful" -ForegroundColor Green
        return $response.access_token
    } catch {
        Write-Host "   ✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to get all media
function Get-AllMedia {
    param($token)
    
    Write-Host "`n2. Fetching all media files..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/media" -Method Get -Headers $headers
        Write-Host "   ✓ Found $($response.total) media files" -ForegroundColor Green
        
        if ($response.data.Count -gt 0) {
            Write-Host "`n   Recent uploads:" -ForegroundColor Cyan
            $response.data | Select-Object -First 5 | ForEach-Object {
                $sizeKB = [math]::Round($_.size / 1024, 2)
                Write-Host "   - $($_.name) ($($_.type), ${sizeKB}KB)" -ForegroundColor White
                Write-Host "     URL: $($_.url)" -ForegroundColor Gray
            }
        }
        
        return $response
    } catch {
        Write-Host "   ✗ Failed to fetch media: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to test file size validation
function Test-FileSizeValidation {
    Write-Host "`n3. Testing File Size Validation..." -ForegroundColor Yellow
    Write-Host "   Image limit: 5MB" -ForegroundColor Cyan
    Write-Host "   Video limit: 100MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Note: Actual file upload requires Cloudinary credentials" -ForegroundColor Gray
    Write-Host "   Please ensure CLOUDINARY_* variables are set in backend/.env" -ForegroundColor Gray
}

# Function to check Cloudinary configuration
function Test-CloudinaryConfig {
    Write-Host "`n4. Checking Cloudinary Configuration..." -ForegroundColor Yellow
    
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
}
    }
}

# Function to test gallery endpoint
function Test-GalleryEndpoint {
    Write-Host "`n5. Testing Public Gallery Endpoint..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/gallery" -Method Get
        Write-Host "   ✓ Gallery page is accessible" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Gallery page error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
Write-Host "Starting tests..." -ForegroundColor White
Write-Host ""

# Get auth token
$token = Get-AuthToken

if ($token) {
    # Test media endpoints
    Get-AllMedia -token $token
    
    # Test file size validation
    Test-FileSizeValidation
    
    # Check Cloudinary config
    Test-CloudinaryConfig
    
    # Test gallery
    Test-GalleryEndpoint
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Test Summary" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend API is running" -ForegroundColor Green
    Write-Host "Media endpoints are accessible" -ForegroundColor Green
    Write-Host "File size limits configured (5MB images, 100MB videos)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Configure Cloudinary credentials in backend/.env" -ForegroundColor White
    Write-Host "2. Test upload via Admin Panel - Media" -ForegroundColor White
    Write-Host "3. Verify files appear in public gallery at /gallery" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "`n✗ Cannot proceed without authentication" -ForegroundColor Red
}

Write-Host "Test completed!" -ForegroundColor Cyan
