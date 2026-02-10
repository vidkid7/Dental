# Website Image Update Fix - Debugging Guide

## Issue
Images upload successfully in admin panel and save to database, but don't appear on the public website (About page and Home page).

## Root Causes Identified

### 1. API URL Configuration
**Problem:** The `.env.local` file had incorrect API URL
- Was: `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Should be: `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`

**Fix Applied:** Updated `.env.local` with correct API endpoint including `/api/v1` prefix.

### 2. Missing Debug Logging
**Problem:** No visibility into what's happening when pages load
**Fix Applied:** Added comprehensive console logging to track:
- API URL being used
- HTTP response status
- Data received from API
- Image URLs being set

### 3. Port Configuration
**Problem:** Frontend URL was set to port 3000 but actually runs on 3002
**Fix Applied:** Updated `NEXT_PUBLIC_SITE_URL` to `http://localhost:3002`

## Changes Made

### 1. Environment Variables (`frontend/.env.local`)
```env
# Before
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# After
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

### 2. About Page (`frontend/src/app/about/page.tsx`)
Added debug logging:
```tsx
useEffect(() => {
  const loadImages = async () => {
    try {
      console.log('Loading images from API...');
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      const mainResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/page/about/main`);
      console.log('Main image response status:', mainResponse.status);
      
      if (mainResponse.ok) {
        const data = await mainResponse.json();
        console.log('Main image data:', data);
        
        if (data?.content?.imagePath) {
          console.log('Setting main image to:', data.content.imagePath);
          setMainImage(data.content.imagePath);
        }
      }
      
      // Similar logging for services images...
    } catch (error) {
      console.error('Failed to load images', error);
    }
  };
  
  loadImages();
}, []);
```

### 3. Home About Section (`frontend/src/components/home/AboutSection.tsx`)
Added debug logging with section prefix:
```tsx
console.log('[Home About Section] Loading images from API...');
console.log('[Home About Section] API URL:', process.env.NEXT_PUBLIC_API_URL);
// ... more logging
```

## How to Debug

### Step 1: Check Environment Variables
```bash
# In frontend directory
cat .env.local

# Should show:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Step 2: Restart Frontend Server
**IMPORTANT:** Environment variables are loaded at build time, so you MUST restart:
```bash
# Stop the frontend server (Ctrl+C)
cd frontend
npm run dev
```

### Step 3: Open Browser Console
1. Open your website: `http://localhost:3002`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Navigate to About page or Home page
5. Look for console logs

### Step 4: Check Console Output

**Expected Console Logs:**
```
Loading images from API...
API URL: http://localhost:3001/api/v1
Main image response status: 200
Main image data: { content: { imagePath: "http://localhost:3001/uploads/..." } }
Setting main image to: http://localhost:3001/uploads/about-images/team-photo.jpg
```

**If you see 404 errors:**
```
Main image response status: 404
```
→ API endpoint doesn't exist or backend not running

**If you see CORS errors:**
```
Access to fetch at 'http://localhost:3001/api/v1/content/...' from origin 'http://localhost:3002' has been blocked by CORS policy
```
→ Backend CORS configuration needs updating

**If you see undefined API URL:**
```
API URL: undefined
```
→ Environment variable not loaded (restart frontend!)

### Step 5: Verify Backend is Running
```bash
# Check if backend is responding
curl http://localhost:3001/api/v1/content/page/about/main

# Should return JSON with image data
```

### Step 6: Check Image URLs
In console, verify the image URLs are correct:
```
Setting main image to: http://localhost:3001/uploads/about-images/image.jpg
```

The URL should:
- Start with `http://localhost:3001`
- Include `/uploads/` path
- Point to actual uploaded file

## Common Issues & Solutions

### Issue 1: Images Still Not Showing
**Symptoms:** Console shows correct URLs but images don't display

**Solution:** Check Next.js Image configuration
```javascript
// frontend/next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',  // ✅ Should be present
    },
  ],
  unoptimized: true,  // ✅ Should be true for development
}
```

### Issue 2: 404 on API Calls
**Symptoms:** `Response status: 404`

**Possible Causes:**
1. Backend not running
2. Wrong API URL
3. Content not saved to database

**Solutions:**
```bash
# 1. Check backend is running
curl http://localhost:3001/api/v1/content/page/about/main

# 2. Check database has content
# Connect to your database and query page_content table

# 3. Upload images again in admin panel
```

### Issue 3: CORS Errors
**Symptoms:** CORS policy blocking requests

**Solution:** Check backend CORS configuration
```typescript
// backend/src/main.ts
app.enableCors({
  origin: ['http://localhost:3002', 'http://localhost:3000'],
  credentials: true,
});
```

### Issue 4: Environment Variables Not Loading
**Symptoms:** `API URL: undefined` in console

**Solutions:**
1. Restart frontend server (MUST DO after .env changes)
2. Check .env.local file exists in frontend directory
3. Verify variable name starts with `NEXT_PUBLIC_`
4. Clear Next.js cache: `rm -rf .next`

### Issue 5: Old Images Still Showing
**Symptoms:** Uploaded new images but old ones still display

**Solutions:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check if new URLs are in console logs
4. Verify database has new URLs

## Testing Checklist

After applying fixes, test in this order:

### 1. Environment Check
- [ ] `.env.local` has correct `NEXT_PUBLIC_API_URL`
- [ ] Frontend server restarted after .env changes
- [ ] Backend server is running

### 2. Admin Panel Test
- [ ] Login to admin panel
- [ ] Navigate to About Images page
- [ ] Upload a test image
- [ ] See "Image uploaded and saved successfully" message
- [ ] Refresh admin page - image persists

### 3. API Test
- [ ] Open browser console
- [ ] Navigate to About page
- [ ] See console logs showing API calls
- [ ] See 200 response status
- [ ] See image URLs in console

### 4. Visual Test
- [ ] About page shows uploaded team photo
- [ ] About page shows uploaded clinic images (4 images)
- [ ] Home page About section shows uploaded image
- [ ] Images load without errors
- [ ] No broken image icons

### 5. Persistence Test
- [ ] Hard refresh About page (Ctrl+Shift+R)
- [ ] Images still show correctly
- [ ] Hard refresh Home page
- [ ] Images still show correctly

## Quick Fix Commands

```bash
# 1. Update environment variables
cd frontend
# Edit .env.local file (already done)

# 2. Restart frontend
# Press Ctrl+C to stop
npm run dev

# 3. Clear Next.js cache if needed
rm -rf .next
npm run dev

# 4. Test API endpoint
curl http://localhost:3001/api/v1/content/page/about/main

# 5. Check backend logs
cd backend
# Look at terminal output for any errors
```

## Expected Behavior After Fix

### Admin Panel
1. Upload image → Success message
2. Refresh page → Image persists
3. Check console → No errors

### About Page
1. Load page → Console shows API calls
2. Console shows 200 responses
3. Console shows image URLs
4. Images display correctly
5. Hard refresh → Images still show

### Home Page
1. Load page → Console shows API calls
2. About section shows correct image
3. Hard refresh → Image still shows

## Verification Steps

### 1. Check Console Logs
```
✅ Loading images from API...
✅ API URL: http://localhost:3001/api/v1
✅ Main image response status: 200
✅ Main image data: { content: { imagePath: "..." } }
✅ Setting main image to: http://localhost:3001/uploads/...
```

### 2. Check Network Tab
1. Open Developer Tools → Network tab
2. Filter by "Fetch/XHR"
3. Look for requests to `/content/page/about/main`
4. Should show Status 200
5. Preview tab should show JSON with imagePath

### 3. Check Elements Tab
1. Open Developer Tools → Elements tab
2. Find `<img>` tags
3. Check `src` attribute
4. Should show uploaded image URL
5. Right-click image → "Open in new tab"
6. Image should load successfully

## Still Not Working?

If images still don't show after all fixes:

### 1. Collect Debug Information
```bash
# Check environment
echo $NEXT_PUBLIC_API_URL  # Should show API URL

# Test API directly
curl http://localhost:3001/api/v1/content/page/about/main

# Check if image file exists
ls backend/uploads/about-images/
```

### 2. Check Browser Console
- Copy all console logs
- Copy all network errors
- Copy any CORS errors

### 3. Check Backend Logs
- Look for any errors in backend terminal
- Check if API endpoints are being hit
- Verify database queries are successful

### 4. Nuclear Option - Full Restart
```bash
# Stop everything
# Ctrl+C on both frontend and backend

# Clear caches
cd frontend
rm -rf .next
rm -rf node_modules/.cache

# Restart backend
cd backend
npm run start:dev

# Restart frontend (in new terminal)
cd frontend
npm run dev

# Hard refresh browser
Ctrl+Shift+R
```

## Summary

**Key Changes:**
1. ✅ Fixed API URL in `.env.local`
2. ✅ Added comprehensive debug logging
3. ✅ Fixed port configuration
4. ✅ Added troubleshooting guide

**Next Steps:**
1. Restart frontend server
2. Open browser console
3. Navigate to About page
4. Check console logs
5. Verify images display

**Status:** Ready for testing with full debugging support

---

**Created:** February 10, 2026
**Priority:** High
**Impact:** Critical - User-facing feature
**Testing Required:** Yes
