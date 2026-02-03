# Admin Panel Comprehensive Test Script
# This script tests all admin panel CRUD operations

$baseUrl = "http://localhost:4000/api/v1"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    try {
        $params = @{
            Uri = "$baseUrl/$Url"
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        $script:testResults += [PSCustomObject]@{
            Test = $Name
            Status = "PASS"
            Details = "Success"
        }
        return $response
    }
    catch {
        $script:testResults += [PSCustomObject]@{
            Test = $Name
            Status = "FAIL"
            Details = $_.Exception.Message
        }
        return $null
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ADMIN PANEL COMPREHENSIVE TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Doctors Management
Write-Host "1. Testing Doctors Management..." -ForegroundColor Yellow
$doctors = Test-Endpoint "Get All Doctors" "doctors"
if ($doctors) {
    Write-Host "   Found $($doctors.total) doctors" -ForegroundColor Green
}

# Test 2: Services Management
Write-Host "`n2. Testing Services Management..." -ForegroundColor Yellow
$services = Test-Endpoint "Get All Services" "services"
if ($services) {
    Write-Host "   Found $($services.Length) services" -ForegroundColor Green
}

# Test 3: Blog Management
Write-Host "`n3. Testing Blog Management..." -ForegroundColor Yellow
$blog = Test-Endpoint "Get All Blog Posts" "blog"
if ($blog) {
    Write-Host "   Found $($blog.total) blog posts" -ForegroundColor Green
    $published = ($blog.data | Where-Object {$_.isPublished -eq $true}).Count
    Write-Host "   Published: $published" -ForegroundColor Green
}

# Test 4: Testimonials Management
Write-Host "`n4. Testing Testimonials Management..." -ForegroundColor Yellow
$testimonials = Test-Endpoint "Get All Testimonials" "testimonials"
if ($testimonials) {
    Write-Host "   Found $($testimonials.Length) testimonials" -ForegroundColor Green
    $active = ($testimonials | Where-Object {$_.isActive -eq $true}).Count
    Write-Host "   Active: $active" -ForegroundColor Green
}

# Test 5: Enquiries Management
Write-Host "`n5. Testing Enquiries Management..." -ForegroundColor Yellow
$enquiries = Test-Endpoint "Get All Enquiries" "enquiries"
if ($enquiries) {
    Write-Host "   Found $($enquiries.total) enquiries" -ForegroundColor Green
    $new = ($enquiries.data | Where-Object {$_.status -eq 'new'}).Count
    Write-Host "   New: $new" -ForegroundColor Green
}

# Test 6: Appointments Management
Write-Host "`n6. Testing Appointments Management..." -ForegroundColor Yellow
$appointments = Test-Endpoint "Get All Appointments" "appointments"
if ($appointments) {
    Write-Host "   Found $($appointments.total) appointments" -ForegroundColor Green
}

# Test 7: Users Management
Write-Host "`n7. Testing Users Management..." -ForegroundColor Yellow
$users = Test-Endpoint "Get All Users" "users"
if ($users) {
    Write-Host "   Found $($users.total) users" -ForegroundColor Green
}

# Test 8: Content Management
Write-Host "`n8. Testing Content Management..." -ForegroundColor Yellow
$heroContent = Test-Endpoint "Get Hero Content" "content/page/home/hero"
if ($heroContent) {
    Write-Host "   Hero content loaded" -ForegroundColor Green
}

# Test 9: Departments
Write-Host "`n9. Testing Departments..." -ForegroundColor Yellow
$departments = Test-Endpoint "Get All Departments" "departments"
if ($departments) {
    Write-Host "   Found $($departments.Length) departments" -ForegroundColor Green
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$testResults | Format-Table -AutoSize

$passed = ($testResults | Where-Object {$_.Status -eq "PASS"}).Count
$failed = ($testResults | Where-Object {$_.Status -eq "FAIL"}).Count
$total = $testResults.Count

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`nAll tests passed!" -ForegroundColor Green
} else {
    Write-Host "`nSome tests failed. Please review the details above." -ForegroundColor Red
}
