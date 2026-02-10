# Home Images Upload Fix

## Problem 1: "No File Provided" Error
When uploading images in the Home Images admin panel, users were getting a "no file provided" error.

### Root Cause
The axios library's default `Content-Type: application/json` header was interfering with FormData uploads, preventing the backend from receiving the file correctly.

### Solution
Replaced the axios-based `post()` call with native `fetch` API for file uploads.

## Problem 2: "Unauthorized" Error
After fixing the file upload, users were getting "unauthorized" errors.

### Root Cause
When switching from axios to fetch, we lost the automatic authentication token that axios was adding via its interceptor.

### Solution
Manually added the authentication token to the fetch request headers:

```typescript
// Get auth token from localStorage
const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

const headers: HeadersInit = {};
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

const uploadRes = await fetch(uploadUrl, {
  method: 'POST',
  headers,
  body: formData,
});
```

## Complete Working Implementation

```typescript
const handleImageUpload = async (file: File, imageId: string, section: string) => {
  // ... validation code ...

  try {
    // Upload image using FormData
    const formData = new FormData();
    formData.append('file', file);

    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    // Use fetch API directly to avoid axios header issues
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const uploadUrl = `${apiUrl}/api/v1/media/upload`;
    
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: formData,
      // Don't set Content-Type - browser will set it with boundary
    });

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json().catch(() => ({}));
      throw new Error(errorData.message || 'Upload failed');
    }

    const uploadResponse = await uploadRes.json();
    const imageUrl = uploadResponse.url;

    // ... rest of the code to save to database ...
  } catch (error) {
    // ... error handling ...
  }
};
```

## Why This Works
1. ✅ Native `fetch` properly handles FormData
2. ✅ Browser automatically sets `Content-Type` with correct boundary
3. ✅ No interference from axios default headers
4. ✅ Authentication token is manually included
5. ✅ Backend can properly parse the file and authenticate the request

## Files Modified
- `frontend/src/app/admin/content/home-images/page.tsx`

## Testing
✅ Hero section image upload works with authentication
✅ About section images upload works (all 4) with authentication
✅ Auto-save persists to database
✅ Images display on home page after upload
✅ Error handling works correctly
✅ Unauthorized users are properly rejected

## Note for Future Development
When using `fetch` instead of the axios-based API helpers, remember to:
1. Manually add the Authorization header with the token
2. Don't set Content-Type for FormData (let browser handle it)
3. Handle errors properly by checking `response.ok`

## Related Files
- `frontend/src/lib/api.ts` - Contains the axios instance with interceptors
- `frontend/src/app/admin/content/about-images/page.tsx` - Similar upload implementation
