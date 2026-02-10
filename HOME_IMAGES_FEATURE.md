# Home Page Images Management Feature

## Overview
Complete admin panel for managing all images on the home page, with auto-save functionality and proper API integration.

## What Was Implemented

### 1. New Admin Page: Home Images Management
**Location:** `/admin/content/home-images`

**Features:**
- Manage Hero Section image (1 image)
- Manage About Section images (4 images)
- Auto-save after upload
- Manual save button for batch updates
- Image preview with upload buttons
- File validation (type and size)
- Loading states and error handling

### 2. Updated Home Page Components

#### Hero Section (`frontend/src/components/home/HeroSection.tsx`)
- Added state for hero image
- Loads image from API endpoint: `GET /api/v1/content/page/home/hero`
- Displays uploaded image or falls back to default

#### About Section (`frontend/src/components/home/AboutSection.tsx`)
- Updated to load ALL 4 images from API
- Loads images from API endpoint: `GET /api/v1/content/page/home/about`
- Expects `imagePaths` array with 4 image URLs
- Falls back to default images on error

### 3. Admin Navigation
- Added "Home Images" link in Content Management sidebar
- Separated from "About Images" for clarity

## API Endpoints Used

### Hero Section
- `GET /api/v1/content/page/home/hero` - Get hero content including image
- `PUT /api/v1/content/page/home/hero` - Update hero content with new image
  ```json
  {
    "content": {
      "imagePath": "/uploads/hero-image.jpg",
      ...other hero content
    }
  }
  ```

### About Section
- `GET /api/v1/content/page/home/about` - Get about content including images
- `PUT /api/v1/content/page/home/about` - Update about content with new images
  ```json
  {
    "content": {
      "imagePaths": [
        "/uploads/clinic-1.jpg",
        "/uploads/clinic-2.jpg",
        "/uploads/clinic-3.jpg",
        "/uploads/clinic-4.jpg"
      ],
      ...other about content
    }
  }
  ```

### Image Upload
- `POST /api/v1/media/upload` - Upload image file
  - Returns: `{ "url": "/uploads/filename.jpg" }`

## How to Use

### For Admins:
1. Navigate to `/admin/content/home-images`
2. Click "Upload New Image" on any image card
3. Select an image file (JPG/PNG, max 5MB)
4. Image is automatically uploaded and saved
5. Refresh the home page to see changes

### Image Sections:

#### Hero Section
- **Location:** Top of home page
- **Images:** 1 main team/clinic image
- **Recommended Size:** 1200x1200px (square)

#### About Section
- **Location:** Middle of home page
- **Images:** 4 clinic/facility images in a grid
- **Recommended Size:** 1200x800px each
- **Layout:** 2x2 grid with staggered heights

## Technical Details

### Auto-Save Implementation
When an image is uploaded:
1. File is uploaded to `/api/v1/media/upload`
2. Returned URL is immediately saved to database via PUT request
3. Component state is updated to show new image
4. No page refresh needed

### Error Handling
- File type validation (images only)
- File size validation (max 5MB)
- API error handling with toast notifications
- Fallback to default images if API fails
- Loading states during upload

### Image Storage
- Images are stored in `/backend/uploads/` directory
- URLs are relative: `/uploads/filename.jpg`
- Images are served by the backend static file server

## Files Modified

### New Files:
- `frontend/src/app/admin/content/home-images/page.tsx` - Admin panel for home images

### Modified Files:
- `frontend/src/components/home/HeroSection.tsx` - Added image loading from API
- `frontend/src/components/home/AboutSection.tsx` - Updated to load all 4 images from API
- `frontend/src/app/admin/content/page.tsx` - Added navigation link

## Testing Checklist

- [x] Admin panel loads existing images
- [x] Image upload works for hero section
- [x] Image upload works for about section (all 4 images)
- [x] Auto-save persists images to database
- [x] Home page hero section displays uploaded image
- [x] Home page about section displays all 4 uploaded images
- [x] Images persist after page refresh
- [x] Error handling works for invalid files
- [x] Loading states display correctly
- [x] Navigation link works in admin sidebar

## Browser Console Logs

The About Section includes detailed logging for debugging:
- `[Home About Section] Loading images from API...`
- `[Home About Section] API URL: <url>`
- `[Home About Section] Response status: <status>`
- `[Home About Section] Full response data: <json>`
- `[Home About Section] Setting all images to: <array>`

Check these logs if images aren't loading correctly.

## Next Steps

If you want to add more image sections:
1. Add new section to admin panel
2. Create API endpoint for that section
3. Update frontend component to load from API
4. Follow the same auto-save pattern

## Notes

- All images are automatically optimized by Next.js Image component
- Images use lazy loading for better performance
- The admin panel uses the same upload mechanism as the About Images page
- Both admin panels can be accessed from the Content Management sidebar
