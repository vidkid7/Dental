# About Us Images Management Feature

## Overview
This feature allows administrators to update images for the About Us page and Home page About section through the admin panel.

## Features Implemented

### 1. Admin Panel - About Images Management Page
**Location:** `/admin/content/about-images`

**Functionality:**
- Upload and manage 6 images total:
  - 1 main team photo for About Us page (Our Story section)
  - 4 clinic images for About Us page (Services section)
  - 1 image for Home page About section

**Features:**
- Real-time image preview
- Drag & drop or click to upload
- Image validation (type and size)
- Automatic image optimization
- Save all changes at once
- Loading states and error handling

### 2. Dynamic Image Loading
**Pages Updated:**
- `/about` - About Us page
- `/` - Home page (AboutSection component)

**Implementation:**
- Images are loaded from the database via API
- Fallback to default images if API fails
- Client-side rendering for dynamic content

### 3. Backend Integration
**API Endpoints Used:**
- `GET /content/page/about/main` - Get About page main section
- `GET /content/page/about/services-overview` - Get About page services section
- `GET /content/page/home/about` - Get Home page about section
- `PUT /content/page/{pageSlug}/{sectionKey}` - Update content
- `POST /media/upload` - Upload images

## File Structure

### Frontend Files Created/Modified

#### New Files:
```
frontend/src/app/admin/content/about-images/page.tsx
```

#### Modified Files:
```
frontend/src/app/admin/content/page.tsx
frontend/src/app/about/page.tsx
frontend/src/components/home/AboutSection.tsx
```

### Backend Files (Existing - No Changes Required)
```
backend/src/modules/content/content.controller.ts
backend/src/modules/content/content.service.ts
backend/src/modules/content/entities/content.entity.ts
backend/src/modules/media/media.controller.ts
backend/src/modules/media/media.service.ts
```

## How to Use

### For Administrators:

1. **Access the Admin Panel**
   - Login to admin panel at `/admin/login`
   - Navigate to "Content Management" from the sidebar
   - Click on "About Images" in the sections menu

2. **Upload Images**
   - Click "Upload New Image" button for any image section
   - Select an image file (JPG, PNG, WebP)
   - Image will be automatically uploaded and preview updated
   - Repeat for all images you want to change

3. **Save Changes**
   - Click "Save All Changes" button at the top
   - Wait for success confirmation
   - Changes will be immediately visible on the public pages

### Image Guidelines:
- **Recommended Dimensions:** 1200x800px
- **Maximum File Size:** 5MB
- **Supported Formats:** JPG, PNG, WebP
- **Aspect Ratios:**
  - Main team photo: 4:3 (landscape)
  - Clinic images: 1:1 (square)

## Database Schema

### page_content Table
```sql
{
  "pageSlug": "about",
  "sectionKey": "main",
  "content": {
    "title": "Our Story",
    "paragraph1": "...",
    "paragraph2": "...",
    "paragraph3": "...",
    "address": "...",
    "imagePath": "/uploads/about-images/team-photo.jpg"
  }
}

{
  "pageSlug": "about",
  "sectionKey": "services-overview",
  "content": {
    "title": "Our Services",
    "description": "...",
    "services": [...],
    "imagePaths": [
      "/uploads/about-images/clinic-1.jpg",
      "/uploads/about-images/clinic-2.jpg",
      "/uploads/about-images/clinic-3.jpg",
      "/uploads/about-images/clinic-4.jpg"
    ]
  }
}

{
  "pageSlug": "home",
  "sectionKey": "about",
  "content": {
    "badgeLabel": "About Us",
    "title": "...",
    "paragraph1": "...",
    "paragraph2": "...",
    "imagePath": "/uploads/about-images/home-about.jpg",
    "features": [...]
  }
}
```

## API Flow

### Image Upload Flow:
1. User selects image file
2. Frontend validates file (type, size)
3. POST request to `/media/upload` with FormData
4. Backend saves file and returns URL
5. Frontend updates state with new URL
6. User clicks "Save All Changes"
7. PUT requests to update content in database
8. Success toast notification

### Image Loading Flow:
1. Page component mounts
2. useEffect hook triggers API calls
3. GET requests to content endpoints
4. Parse response and extract image URLs
5. Update state with new URLs
6. Images re-render with new sources
7. Fallback to defaults if API fails

## Error Handling

### Upload Errors:
- Invalid file type → Toast error message
- File too large → Toast error message
- Network error → Toast error message
- Server error → Toast error message with details

### Loading Errors:
- API unavailable → Use default images
- Invalid response → Use default images
- Network timeout → Use default images
- Console logging for debugging

## Security Considerations

1. **Authentication Required:**
   - Only authenticated admins can access upload page
   - JWT token required for API calls
   - Role-based access control (SUPER_ADMIN, ADMIN)

2. **File Validation:**
   - Client-side: File type and size validation
   - Server-side: Additional validation in media service
   - Sanitized file names
   - Secure file storage

3. **API Security:**
   - CORS configuration
   - Rate limiting
   - Input sanitization
   - SQL injection prevention (TypeORM)

## Performance Optimizations

1. **Image Optimization:**
   - Next.js Image component for automatic optimization
   - Lazy loading
   - Responsive images
   - WebP format support

2. **Caching:**
   - Browser caching for images
   - API response caching (if implemented)
   - CDN integration (if available)

3. **Loading States:**
   - Skeleton loaders
   - Progressive image loading
   - Optimistic UI updates

## Testing Checklist

### Functional Testing:
- [ ] Upload image successfully
- [ ] Upload multiple images
- [ ] Save changes successfully
- [ ] Images display on About page
- [ ] Images display on Home page
- [ ] Error handling for invalid files
- [ ] Error handling for large files
- [ ] Loading states work correctly
- [ ] Fallback to defaults works

### UI/UX Testing:
- [ ] Responsive design on mobile
- [ ] Responsive design on tablet
- [ ] Responsive design on desktop
- [ ] Image previews are clear
- [ ] Upload buttons are accessible
- [ ] Success/error messages are clear
- [ ] Loading indicators are visible

### Security Testing:
- [ ] Unauthorized access blocked
- [ ] File type validation works
- [ ] File size validation works
- [ ] XSS prevention
- [ ] CSRF protection

## Troubleshooting

### Images Not Uploading:
1. Check network tab for errors
2. Verify API endpoint is accessible
3. Check file size and type
4. Verify authentication token
5. Check server logs

### Images Not Displaying:
1. Check browser console for errors
2. Verify image URLs are correct
3. Check CORS configuration
4. Verify API responses
5. Check Next.js image configuration

### Save Not Working:
1. Check network tab for failed requests
2. Verify all required fields are present
3. Check authentication status
4. Verify database connection
5. Check server logs

## Future Enhancements

1. **Bulk Upload:**
   - Upload multiple images at once
   - Drag and drop multiple files
   - Progress bar for uploads

2. **Image Editing:**
   - Crop images before upload
   - Resize images
   - Apply filters
   - Add text overlays

3. **Image Library:**
   - Browse previously uploaded images
   - Reuse images across pages
   - Image search and filtering
   - Image categories

4. **Advanced Features:**
   - Image compression options
   - Alt text management
   - SEO optimization
   - Image analytics

## Support

For issues or questions:
1. Check this documentation
2. Review console logs
3. Check API responses
4. Contact development team

## Version History

- **v1.0.0** (Current) - Initial implementation
  - Basic image upload functionality
  - About page integration
  - Home page integration
  - Admin panel interface
