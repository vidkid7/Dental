# Local Storage Implementation - Complete! ✅

## Overview

Media upload system has been switched to **local filesystem storage** instead of Cloudinary. Files are now stored directly in your project folders.

## Storage Locations

### Images
- **Path**: `frontend/public/images/`
- **URL**: `/images/filename.jpg`
- **Max Size**: 5MB

### Videos
- **Path**: `frontend/public/video/`
- **URL**: `/video/filename.mp4`
- **Max Size**: 100MB

## How It Works

### Upload Process
1. User uploads file via Admin Panel → Media
2. Backend validates file size (5MB for images, 100MB for videos)
3. File is saved to `frontend/public/images` or `frontend/public/video`
4. Filename format: `timestamp-originalname.ext` (e.g., `1738612345678-photo.jpg`)
5. Metadata saved to database with URL like `/images/1738612345678-photo.jpg`
6. Frontend can access files directly via Next.js public folder

### Gallery Display
1. Gallery page fetches media from database API
2. URLs point to local files (e.g., `/images/photo.jpg`)
3. Next.js serves files from `public` folder automatically
4. Images and videos display in gallery with lightbox

## Features

✅ **No External Service Required**
- No Cloudinary account needed
- No API keys to configure
- Works immediately out of the box

✅ **File Size Validation**
- Images: Maximum 5MB
- Videos: Maximum 100MB
- Validated on both frontend and backend

✅ **Automatic Folder Creation**
- Creates `images` and `video` folders if they don't exist
- No manual setup required

✅ **Gallery Integration**
- All uploaded files appear in public gallery
- Supports images and videos
- Lightbox view with navigation
- Category filtering

✅ **Admin Panel Management**
- Upload single or multiple files
- View all media in grid or list
- Search and filter
- Delete files (removes from disk and database)
- Copy URLs

## File Structure

```
frontend/
  public/
    images/              ← Images stored here
      1738612345678-photo1.jpg
      1738612345679-photo2.png
    video/               ← Videos stored here
      1738612345680-video1.mp4
      1738612345681-video2.mov
```

## Database Storage

Only metadata is stored in PostgreSQL:

```sql
media_files table:
- id (UUID)
- name (original filename)
- url (/images/timestamp-filename.jpg)
- publicId (timestamp-filename.jpg)
- type (image/video/document)
- mimeType (image/jpeg, video/mp4, etc.)
- size (bytes)
- folder (general/treatments/clinic/team/events)
- alt (alt text for accessibility)
- caption (display caption)
- created_at
- updated_at
```

## Usage

### Upload Files
1. Go to: http://localhost:3000/admin/media
2. Click "Upload Files"
3. Select images (< 5MB) or videos (< 100MB)
4. Files are uploaded instantly
5. See them in the media library

### View Gallery
1. Go to: http://localhost:3000/gallery
2. All uploaded media is displayed
3. Filter by category
4. Click to view in lightbox
5. Navigate with arrow keys

### Delete Files
1. Go to Admin Panel → Media
2. Click delete icon on any file
3. File is removed from:
   - Filesystem (`frontend/public/images` or `frontend/public/video`)
   - Database

## Advantages of Local Storage

### Pros ✅
- **Simple**: No external service configuration
- **Fast**: Files served directly from your server
- **Free**: No cloud storage costs
- **Private**: Files stay on your server
- **Immediate**: Works right away, no setup
- **Control**: Full control over your files

### Cons ⚠️
- **Server Space**: Uses your server's disk space
- **Backup**: You need to backup files yourself
- **Scaling**: Limited by server storage capacity
- **CDN**: No automatic CDN delivery
- **Bandwidth**: Uses your server's bandwidth

## File Size Limits

| File Type | Maximum Size | Reason |
|-----------|--------------|--------|
| Images    | 5MB          | Balance quality and storage |
| Videos    | 100MB        | Reasonable for short clips |

You can adjust these limits in `backend/src/modules/media/media.service.ts`:

```typescript
private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
private readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
```

## Testing

### Test Upload
1. Go to http://localhost:3000/admin/media
2. Upload a small image (< 5MB)
3. Check `frontend/public/images/` folder - file should be there
4. Upload a video (< 100MB)
5. Check `frontend/public/video/` folder - file should be there

### Test Gallery
1. Go to http://localhost:3000/gallery
2. Uploaded files should be displayed
3. Click image to view in lightbox
4. Test video playback
5. Test category filters

### Test File Size Limits
1. Try uploading image > 5MB
2. Should see error: "Image size exceeds maximum limit of 5MB"
3. Try uploading video > 100MB
4. Should see error: "Video size exceeds maximum limit of 100MB"

### Test Delete
1. Delete a file from admin panel
2. Check filesystem - file should be removed
3. Check gallery - file should not appear

## Troubleshooting

### Upload fails with "Failed to save file to disk"

**Cause**: Permission issues or disk full

**Fix**:
1. Check disk space: `df -h` (Linux/Mac) or check drive properties (Windows)
2. Check folder permissions
3. Ensure backend has write access to `frontend/public/`

### Images not showing in gallery

**Cause**: Incorrect URL or file path

**Fix**:
1. Check database - URLs should be like `/images/filename.jpg`
2. Check files exist in `frontend/public/images/`
3. Check browser console for 404 errors
4. Verify Next.js is serving public folder correctly

### Files uploaded but not in folder

**Cause**: Wrong upload path

**Fix**:
1. Check backend logs for upload path
2. Should see: `Images: /path/to/frontend/public/images`
3. Verify path is correct
4. Restart backend if needed

## Backup Strategy

Since files are stored locally, you should backup:

### What to Backup
1. **Files**: `frontend/public/images/` and `frontend/public/video/`
2. **Database**: PostgreSQL database (includes metadata)

### How to Backup

**Files (Manual)**:
```bash
# Copy to backup location
cp -r frontend/public/images /backup/location/
cp -r frontend/public/video /backup/location/
```

**Files (Automated)**:
- Use rsync, cron jobs, or backup software
- Cloud sync (Dropbox, Google Drive, etc.)
- Version control (Git LFS for large files)

**Database**:
```bash
pg_dump dental_db > backup.sql
```

## Scaling Considerations

### When to Consider Cloud Storage

If you experience:
- Running out of disk space
- Slow file delivery to users
- Need for CDN
- Multiple servers (load balancing)
- Automatic backups

Then consider switching to:
- Cloudinary (easy integration, already coded)
- AWS S3
- Google Cloud Storage
- Azure Blob Storage

### Current Capacity

With local storage:
- **1GB** = ~200 high-quality images or ~10 minutes of HD video
- **10GB** = ~2,000 images or ~100 minutes of video
- **100GB** = ~20,000 images or ~1,000 minutes of video

## Configuration

No configuration needed! It works out of the box.

The backend automatically:
- Creates upload folders if they don't exist
- Validates file sizes
- Generates unique filenames
- Saves files to correct locations
- Updates database with metadata

## API Endpoints

### Upload File
```
POST /api/v1/media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- file: File (required)
- folder: string (optional, default: "general")

Response: MediaFile object with URL like /images/timestamp-filename.jpg
```

### Get All Media
```
GET /api/v1/media
Authorization: Bearer {token}

Response: {
  data: MediaFile[],
  total: number,
  page: number,
  limit: number
}
```

### Delete Media
```
DELETE /api/v1/media/:id
Authorization: Bearer {token}

Response: 204 No Content
(Removes file from disk and database)
```

## Summary

✅ **Implementation Complete**
- Local storage configured
- File size limits enforced (5MB images, 100MB videos)
- Gallery integration working
- Admin panel fully functional
- No external dependencies

✅ **Ready to Use**
- No configuration needed
- No API keys required
- Works immediately
- Upload and view files right away

✅ **Simple and Effective**
- Perfect for small to medium sites
- Easy to backup
- Full control over files
- No monthly costs

**Start uploading your images and videos now!** 📸🎥
