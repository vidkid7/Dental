# Quick Start: Cloudinary Media System

## 🚀 Get Started in 3 Steps

### Step 1: Get Cloudinary Credentials (5 minutes)

1. Go to https://cloudinary.com
2. Click "Sign Up" (free account)
3. After signup, you'll see your Dashboard
4. Copy these three values:
   - **Cloud Name**: (e.g., "dxyz123abc")
   - **API Key**: (e.g., "123456789012345")
   - **API Secret**: (e.g., "abcdefghijklmnopqrstuvwxyz")

### Step 2: Configure Backend (2 minutes)

1. Open `backend/.env` file
2. Find these lines:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Replace with your actual values:
   ```env
   CLOUDINARY_CLOUD_NAME=dxyz123abc
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   ```
4. Save the file

### Step 3: Restart Backend (1 minute)

**Option A: If backend is running in terminal**
- Press `Ctrl+C` to stop
- Run `npm run start:dev` to restart

**Option B: If using VS Code/Kiro**
- Stop the backend process
- Start it again

## ✅ Test It Works

### Test 1: Upload an Image
1. Open browser: http://localhost:3000/admin/media
2. Login if needed
3. Click "Upload Files"
4. Select a small image (< 5MB)
5. Should see success message
6. Image appears in the grid

### Test 2: Check Gallery
1. Open browser: http://localhost:3000/gallery
2. Should see your uploaded image
3. Click image to view in lightbox
4. Works! 🎉

### Test 3: File Size Limits
1. Try uploading image > 5MB
2. Should see error: "Image size exceeds maximum limit of 5MB"
3. Try uploading video > 100MB
4. Should see error: "Video size exceeds maximum limit of 100MB"

## 📋 File Size Limits

| File Type | Maximum Size | Validation |
|-----------|--------------|------------|
| Images    | 5MB          | Frontend + Backend |
| Videos    | 100MB        | Frontend + Backend |

## 🎯 What Changed

### Before (Local Storage)
- Files saved to `frontend/public/images` and `frontend/public/video`
- Takes up server disk space
- Limited by server storage
- No CDN delivery

### After (Cloudinary)
- Files uploaded to Cloudinary cloud
- No server disk space used
- Unlimited scalability
- Fast CDN delivery worldwide
- Automatic optimization

## 🔧 Troubleshooting

### "Upload failed" error
**Check:**
- Cloudinary credentials are correct in `.env`
- Backend server is restarted after changing `.env`
- File size is within limits

### Images not showing in gallery
**Check:**
- Backend API is running (http://localhost:4000)
- Browser console for errors (F12)
- Database has media records

### "401 Unauthorized" from Cloudinary
**Fix:**
- Double-check API Key and API Secret
- Make sure no extra spaces in `.env` file
- Verify account is active on Cloudinary

## 📁 Where Files Are Stored

### Cloudinary Folders
All files are organized in Cloudinary:
```
dental-clinic/
  ├── general/       (default folder)
  ├── treatments/    (treatment photos/videos)
  ├── clinic/        (facility images)
  ├── team/          (team photos)
  └── events/        (event photos/videos)
```

### Database
Only metadata is stored in PostgreSQL:
- File name, URL, size
- Type, MIME type
- Width, height
- Folder, alt text, caption

## 🎨 Admin Panel Features

### Upload
- Click "Upload Files" button
- Select multiple files at once
- Automatic size validation
- Progress feedback
- Error messages for failed uploads

### Manage
- View all media in grid or list
- Search by filename
- Filter by type (image/video)
- Copy URL to clipboard
- Delete files (removes from Cloudinary too)

### Organize
- Set folder when uploading
- Add alt text for accessibility
- Add captions for display

## 🌐 Public Gallery Features

### View
- All uploaded media displayed
- Responsive grid layout
- Category filters
- Smooth animations

### Lightbox
- Click any item to view full size
- Navigate with arrow buttons
- Play videos inline
- Close with X or click outside

## 💰 Cloudinary Free Tier

What you get for free:
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Video**: 500MB storage, 1GB bandwidth

This is enough for:
- ~5,000 high-quality images
- ~50 hours of video
- Thousands of visitors per month

## 📞 Need Help?

### Documentation
- Full docs: `CLOUDINARY_MEDIA_SYSTEM.md`
- Implementation details: `CLOUDINARY_IMPLEMENTATION_COMPLETE.md`

### Common Issues
1. **Upload fails**: Check Cloudinary credentials
2. **Gallery empty**: Upload some files first
3. **Size error**: Compress files before upload
4. **Slow upload**: Check internet connection

### Test Script
Run the test script to verify setup:
```powershell
.\test-cloudinary.ps1
```

## ✨ You're All Set!

Your media system is now:
- ✅ Using Cloudinary cloud storage
- ✅ Validating file sizes (5MB images, 100MB videos)
- ✅ Displaying in public gallery
- ✅ Accessible from admin panel
- ✅ Scalable and fast

**Next**: Upload some photos and videos to test it out!
