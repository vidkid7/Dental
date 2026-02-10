# Hero Slider Debugging Guide

## Quick Test

I've created a test page to verify the slider works independently:

**Go to: `/test-slider`**

This page has:
- ✅ Hardcoded 3 images (no API dependency)
- ✅ Auto-slide every 5 seconds
- ✅ Previous/Next buttons
- ✅ Dot indicators
- ✅ Debug information
- ✅ Console logging

## What to Check

### 1. Test Page First
```
Navigate to: http://localhost:3000/test-slider
```

**Expected Behavior:**
- You should see a large image slider
- Image counter at top showing "1 / 3"
- Previous/Next arrow buttons on sides
- Dot indicators at bottom
- After 5 seconds, image should change automatically
- Console logs showing "Auto-advancing from X to Y"

**If test page works:**
✅ Slider code is correct
❌ Issue is with the main homepage API/data

**If test page doesn't work:**
❌ There's a fundamental issue with the slider implementation

### 2. Check Browser Console

Open browser console (F12) and look for:

```javascript
// You should see these logs:
Hero Images: (3) ['/images/team.jpg', '/images/clinic-1.jpg', '/images/clinic-2.jpg']
Hero Images Length: 3
Current Image Index: 0

// After 5 seconds:
Current Image Index: 1

// After 10 seconds:
Current Image Index: 2
```

### 3. Check Network Tab

In browser DevTools > Network tab:
1. Refresh homepage
2. Look for request to: `/api/v1/content/page/home/hero`
3. Check the response

**Expected Response:**
```json
{
  "content": {
    "images": [
      "/images/team.jpg",
      "/images/clinic-1.jpg", 
      "/images/clinic-2.jpg"
    ],
    "imagePath": "/images/team.jpg",
    "title": "...",
    "subtitle": "..."
  }
}
```

### 4. Check Image Files

Verify these files exist in `/public/images/`:
- ✅ `team.jpg`
- ✅ `clinic-1.jpg`
- ✅ `clinic-2.jpg`

If any are missing, you'll see broken images.

## Common Issues & Solutions

### Issue 1: "I don't see any buttons"

**Possible Causes:**
1. Only 1 image is loaded (buttons hidden when < 2 images)
2. Z-index issue (buttons behind other elements)
3. CSS not loaded properly

**Solutions:**
```javascript
// Check in console:
console.log(heroImages.length); // Should be 3

// If it's 1, the API is returning single image
// Go to admin panel and add more images
```

### Issue 2: "Images don't auto-slide"

**Possible Causes:**
1. JavaScript error preventing timer
2. Only 1 image loaded
3. Timer not starting

**Solutions:**
1. Check console for errors
2. Verify `heroImages.length > 1`
3. Look for "Setting up auto-slide interval" log

### Issue 3: "Buttons don't work when clicked"

**Possible Causes:**
1. Event handlers not attached
2. Z-index issue
3. Pointer events disabled

**Solutions:**
```javascript
// Test in console:
document.querySelector('button[aria-label="Next image"]').click();
// Should change image
```

### Issue 4: "API returns single image"

**Cause:** Backend doesn't have multiple images saved

**Solution:**
1. Go to `/admin/content/home-images`
2. You should see 3 image slots
3. Upload images to each slot
4. Click "Save All Changes"
5. Refresh homepage

## Manual Testing Steps

### Step 1: Test Slider Independently
```
1. Go to /test-slider
2. Wait 5 seconds
3. Verify image changes
4. Click arrows
5. Click dots
```

### Step 2: Test Homepage
```
1. Go to /
2. Open console (F12)
3. Look for "Hero Images" logs
4. Check heroImages.length
5. Wait 5 seconds
6. Verify image changes
```

### Step 3: Test Admin Panel
```
1. Go to /admin/content/home-images
2. Verify 3 image slots visible
3. Upload test images
4. Save changes
5. Go back to homepage
6. Verify new images appear
```

## Debug Console Commands

Open browser console and run these:

```javascript
// Check current state
console.log('Images:', heroImages);
console.log('Length:', heroImages.length);
console.log('Current Index:', currentImageIndex);

// Force image change
setCurrentImageIndex(1); // Go to image 2
setCurrentImageIndex(2); // Go to image 3

// Check if buttons exist
console.log('Prev button:', document.querySelector('button[aria-label="Previous image"]'));
console.log('Next button:', document.querySelector('button[aria-label="Next image"]'));

// Check if images exist
console.log('Image elements:', document.querySelectorAll('img[alt*="Om Chabahil"]'));
```

## Expected Timeline

When page loads:

```
0ms:    Page loads, default 3 images set
100ms:  API call starts
500ms:  API response received
600ms:  Images updated (if API has different images)
1000ms: Content animation completes
5000ms: First auto-slide happens (image 1 → 2)
10000ms: Second auto-slide (image 2 → 3)
15000ms: Third auto-slide (image 3 → 1, loops)
```

## Verification Checklist

- [ ] Test page (`/test-slider`) works correctly
- [ ] Console shows "Hero Images: (3) [...]"
- [ ] Console shows "Hero Images Length: 3"
- [ ] Previous/Next buttons are visible
- [ ] Dot indicators are visible (3 dots)
- [ ] After 5 seconds, image changes automatically
- [ ] Clicking arrows changes images
- [ ] Clicking dots changes images
- [ ] Images loop back to first after last
- [ ] No console errors

## Still Not Working?

If you've checked everything above and it still doesn't work:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+Shift+R)
3. **Restart dev server**
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```
4. **Check for build errors**
   ```bash
   npm run build
   ```

## Contact Information

If the test page works but homepage doesn't:
- Issue is with API/data integration
- Check admin panel image configuration

If test page doesn't work:
- Issue is with slider implementation
- Check console for JavaScript errors
- Verify all dependencies installed (framer-motion, react-icons)
