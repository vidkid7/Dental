# Doctor Photo Removal Fix

## Problem
When removing a doctor's photo in the admin panel, the photo would reappear when editing the doctor again, even though the database was successfully updated with `photo = null`.

## Root Cause Analysis

### The Real Issue: State Management on Page Load

Through console logging, we discovered:
1. ✅ Frontend correctly sends `"photo": ""` (empty string)
2. ✅ Backend correctly converts it to `null` and saves to database
3. ✅ Database is updated successfully with `photo: null`
4. ❌ **BUT** when the edit page loads again, `imagePreview` state was not being cleared

**The bug:** The `useEffect` that loads doctor data only set `imagePreview` when `doctor.photo` was truthy:
```typescript
// OLD CODE (buggy):
if (doctor.photo) {
  setImagePreview(doctor.photo);
}
// If doctor.photo is null, imagePreview keeps its old value!
```

This meant that if a doctor previously had a photo, the `imagePreview` state would retain that value even after the photo was deleted from the database.

## Solution

### Fix in `frontend/src/app/admin/doctors/[id]/edit/page.tsx`:

**Updated the useEffect to explicitly clear imagePreview when photo is null:**

```typescript
// NEW CODE (fixed):
if (doctor.photo) {
  setImagePreview(doctor.photo);
} else {
  setImagePreview(null);  // Explicitly clear preview when no photo
}

// Also reset the deletion flag
setPhotoDeleted(false);
```

## How It Works Now

1. **User removes photo and saves:**
   - Frontend sends `photo: ""`
   - Backend converts to `null` and saves to database ✅
   - User is redirected to doctors list

2. **User edits the same doctor again:**
   - Page loads doctor data from database
   - `doctor.photo` is `null`
   - `imagePreview` is **explicitly set to `null`** (this was the missing piece!)
   - No photo is displayed ✅

3. **State is properly managed:**
   - `photoDeleted` flag is reset to `false` on page load
   - `imagePreview` always reflects the current database state
   - No stale state from previous edits

## Console Log Evidence

From the actual test:
```
Photo marked for deletion - will send empty string
Updating doctor with data: { ..., "photo": "" }
Update response: { ..., "photo": null }  ← Database updated correctly!
```

The backend was working perfectly. The issue was purely frontend state management.

## Files Modified

- `frontend/src/app/admin/doctors/[id]/edit/page.tsx`
  - Added `else` clause to clear `imagePreview` when `doctor.photo` is null
  - Added `setPhotoDeleted(false)` to reset flag on page load

## Testing Checklist

- [x] Remove photo button appears when doctor has a photo
- [x] Clicking remove photo shows confirmation dialog
- [x] After confirming, preview is cleared
- [x] Saving sends empty string to backend
- [x] Backend converts empty string to null
- [x] Database is updated with null value
- [x] After save, doctor list shows no photo
- [x] **Editing the same doctor again shows NO photo** ✅ (This was the bug!)
- [x] Can upload a new photo after removing old one

## Key Takeaway

Always handle both the truthy AND falsy cases when setting state from API responses. Don't assume that not setting a value will clear it - explicitly set it to the desired value (in this case, `null`).
