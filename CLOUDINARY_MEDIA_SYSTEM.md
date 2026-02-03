# Cloudinary Media Upload System

## Overview
The media upload system has been configured to use Cloudinary for cloud storage instead of local filesystem storage. This provides better scalability and reduces server storage requirements.

## Features Implemented

### 1. File Size Limits
- **Images**: Maximum 5MB per file
- **Videos**: Maximum 100MB per file
- Files exceeding these limits are rejected with clear error messages

### 2. Cloudinary Integration
- All media files are uploaded to Cloudinary cloud storage
- Files are organized in folders: `dental-clinic/{folder-name}`
- Automatic resource type detection (image/video/document)
- Secure URLs generated for all uploaded files

### 3. Database Storage
- Only metadata is stored in the database:
  - File name, URL, public ID
  - Type, MIME type, size
  - Width/height (for images)
  - Folder, alt text, caption
- Actual files are stored on Cloudinary servers

### 4. Treatment Gallery Integration
- Public gallery page displays all uploaded media
- Supports both images and videos
- Filter by category/folder
- Lightbox view with navigation
- Responsive grid layout

## Configuration

### Backend Environment Variables
Update your `backend/.env` file with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### How to Get Cloudinary Credentials
1. Sign up at https://cloudinary.com (free tier available)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Paste them into your `.env` file

## Usage

### Admin Panel - Upload Media
1. Navigate to Admin Panel → Media
2. Click "Upload Files" button
3. Select one or multiple files
4. Files are validated for size limits:
   - Images: max 5MB
   - Videos: max 100MB
5. Files are uploaded to Cloudinary
6. Success/error messages displayed for each file

### Public Gallery
1. Visit `/gallery` page
2. All uploaded media is displayed
3. Filter by category (All, Clinic, Team, Treatments, Events)
4. Click any item to view in lightbox
5. Navigate between items with arrow buttons

## File Size Validation

### Frontend Validation
- Checks file size before upload
- Shows error toast if file exceeds limit
- Continues uploading valid files

### Backend Validation
- Double-checks file size on server
- Returns 400 Bad Request if limit exceeded
- Error message includes the specific limit

## API Endpoints

### Upload File
```
POST /api/v1/media/upload
Content-Type: multipart/form-data

Body:
- file: File (required)
- folder: string (optional, default: "general")

Response: MediaFile object
```

### Get All Media
```
GET /api/v1/media

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

Response: void (204 No Content)
```

## Benefits of Cloudinary

1. **Scalability**: No server storage limits
2. **Performance**: CDN delivery for fast loading
3. **Optimization**: Automatic image/video optimization
4. **Transformations**: Can resize/crop images on-the-fly
5. **Backup**: Files are backed up by Cloudinary
6. **Cost-effective**: Free tier includes 25GB storage

## File Organization

Files are organized in Cloudinary folders:
- `dental-clinic/general` - Default folder
- `dental-clinic/treatments` - Treatment photos/videos
- `dental-clinic/clinic` - Clinic facility images
- `dental-clinic/team` - Team member photos
- `dental-clinic/events` - Event photos/videos

## Testing

### Test Upload
1. Go to Admin Panel → Media
2. Try uploading:
   - Small image (< 5MB) ✓ Should succeed
   - Large image (> 5MB) ✗ Should fail with error
   - Small video (< 100MB) ✓ Should succeed
   - Large video (> 100MB) ✗ Should fail with error

### Test Gallery
1. Upload some media files
2. Visit `/gallery` page
3. Verify all files are displayed
4. Test category filters
5. Test lightbox view
6. Test video playback

## Troubleshooting

### Upload Fails
- Check Cloudinary credentials in `.env`
- Verify file size is within limits
- Check network connection
- Check Cloudinary dashboard for quota limits

### Gallery Not Loading
- Check browser console for errors
- Verify backend API is running
- Check database has media records
- Verify Cloudinary URLs are accessible

### Images Not Displaying
- Check Cloudinary URLs are valid
- Verify CORS settings if needed
- Check browser network tab for failed requests

## Migration from Local Storage

If you have existing files in local storage:
1. Files in `frontend/public/images` and `frontend/public/video` are no longer used
2. You can manually upload them through the admin panel
3. Or write a migration script to bulk upload to Cloudinary
4. Old local files can be deleted after migration

## Security

- File uploads require authentication (JWT token)
- Only ADMIN and STAFF roles can upload
- File size limits prevent abuse
- Cloudinary provides secure URLs
- Public gallery is read-only (no authentication required)

## Future Enhancements

Possible improvements:
- Image transformation (resize, crop, filters)
- Video thumbnails
- Bulk upload with progress bar
- Drag-and-drop upload
- Advanced search and filtering
- Tags and categories
- Image editing tools
