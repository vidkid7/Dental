# Media Upload - Local Filesystem Storage

## Changes Made

Updated the media upload system to save files to the **local filesystem** instead of Cloudinary cloud storage.

## Implementation

### File Storage Locations

**Images:** `frontend/public/images/`
**Videos:** `frontend/public/video/`

### How It Works

1. **Upload Process:**
   - Admin uploads image/video through Media or Gallery admin panel
   - Backend receives the file
   - File is saved to `frontend/public/images/` or `frontend/public/video/`
   - Filename format: `{timestamp}-{sanitized-original-name}`
   - Database stores the public URL (e.g., `/images/1234567890-photo.jpg`)

2. **Display in Gallery:**
   - Files saved in `frontend/public/` are automatically accessible
   - URL `/images/photo.jpg` maps to `frontend/public/images/photo.jpg`
   - Gallery page can display these images directly

3. **Delete Process:**
   - When admin deletes media, file is removed from filesystem
   - Database record is also deleted

### File Naming

**Before:** `photo.jpg`
**After:** `1707123456789-photo.jpg`

This prevents filename conflicts and maintains original names.

### Benefits

✅ **No cloud storage costs** - Files stored locally
✅ **Fast uploads** - No network latency to cloud
✅ **Simple setup** - No API keys needed
✅ **Full control** - Files stay on your server
✅ **Easy backup** - Just backup the folders

### Folder Structure

```
frontend/public/
├── images/           ← Images uploaded here
│   ├── 1707123456789-clinic.jpg
│   ├── 1707123457890-treatment.jpg
│   └── ...
└── video/            ← Videos uploaded here
    ├── 1707123458901-tour.mp4
    └── ...
```

### Database Storage

The database only stores:
- File metadata (name, size, type, mime type)
- Public URL path (e.g., `/images/photo.jpg`)
- Folder/category information
- Upload timestamp

**NOT stored in database:**
- Actual file content (stored on disk)
- Large binary data

### Usage

**Admin Panel:**
1. Go to **Admin → Media** or **Admin → Gallery**
2. Click **Upload Files**
3. Select images or videos
4. Files are automatically saved to `frontend/public/images/` or `frontend/public/video/`
5. Files appear in the media library immediately

**Public Gallery:**
- Uploaded images automatically available at `/images/filename.jpg`
- Can be displayed in the public gallery page
- Next.js serves files from `public/` folder automatically

### Configuration

No configuration needed! The system automatically:
- Creates `images/` and `video/` folders if they don't exist
- Determines file type from MIME type
- Saves to appropriate folder
- Generates unique filenames

### Security Notes

✅ **Filename sanitization** - Special characters removed
✅ **Type validation** - Only images/videos accepted
✅ **Unique names** - Timestamp prevents conflicts
✅ **Admin-only** - Upload requires authentication

### Migration from Cloudinary

**Old system:**
- Files uploaded to Cloudinary
- Required API keys
- Stored in cloud

**New system:**
- Files uploaded to local filesystem
- No API keys needed
- Stored on your server

**No migration needed** - Existing Cloudinary URLs will continue to work if you have them.

## Status

✅ **IMPLEMENTED AND WORKING**

Files now upload to local filesystem and are immediately accessible in the gallery!

---

**Updated by:** Kiro AI Assistant  
**Date:** February 3, 2026  
**Status:** ✅ LOCAL STORAGE ACTIVE
