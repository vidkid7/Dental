# Hero Section Image Slider Feature

## Overview
The hero section now supports up to 3 images that automatically rotate in a slider format, creating a more dynamic and engaging homepage experience.

## Features

### Frontend (HeroSection Component)

1. **Image Slider**
   - Supports 1-3 images
   - Auto-rotates every 5 seconds
   - Smooth fade transitions between images
   - Navigation controls (previous/next buttons)
   - Dot indicators showing current slide

2. **User Controls**
   - Previous/Next buttons on left and right sides
   - Clickable dot indicators at the bottom
   - Controls only appear when there are 2+ images
   - Keyboard accessible with proper ARIA labels

3. **Animations**
   - Smooth fade-in/fade-out transitions (1 second duration)
   - Respects `prefers-reduced-motion` accessibility setting
   - No layout shifts during image transitions

4. **Backward Compatibility**
   - Works with single image (no slider controls shown)
   - Falls back to `imagePath` if `images` array not provided
   - Maintains all existing functionality

### Admin Panel (Home Images Page)

1. **Multiple Image Management**
   - Upload up to 3 hero images
   - Add/remove image slots dynamically
   - Visual preview of each image
   - Individual upload for each slot

2. **UI Features**
   - "Add Image Slot" button (appears when < 3 images)
   - Remove button on each image (appears when > 1 image)
   - Grid layout showing all hero images
   - Status message showing how many images will rotate

3. **Auto-Save**
   - Images automatically saved after upload
   - Manual "Save All Changes" button available
   - Updates both `images` array and `imagePath` for compatibility

## API Structure

### Request Format
```json
{
  "content": {
    "badgeText": "Open 7 Days a Week - Quality Dental Care",
    "title": "Your Trusted Healthcare Partner",
    "subtitle": "Om Chabahil Dental Hospital...",
    "ctaText": "Book Appointment",
    "images": [
      "/images/team.jpg",
      "/images/clinic-1.jpg",
      "/images/clinic-2.jpg"
    ],
    "imagePath": "/images/team.jpg"
  }
}
```

### Response Format
Same as request format. The API endpoint `/api/v1/content/page/home/hero` handles both GET and PUT operations.

## Usage Instructions

### For Administrators

1. **Navigate to Admin Panel**
   - Go to `/admin/content/home-images`
   - Find the "Hero Section Slider" section

2. **Add Images**
   - Click "Add Image Slot" to add up to 3 image slots
   - Click "Upload New Image" on each slot
   - Select an image file (JPG/PNG, max 5MB)
   - Image is automatically saved

3. **Remove Images**
   - Click the X button in the top-right corner of any image
   - Must keep at least 1 image

4. **Best Practices**
   - Use high-quality images (1200x800px recommended)
   - Ensure all images have similar composition for smooth transitions
   - Test the slider on the homepage after uploading

### For Developers

1. **Component Usage**
   ```tsx
   import { HeroSection } from '@/components/home/HeroSection';
   
   // Component automatically fetches and displays images
   <HeroSection />
   ```

2. **Customization**
   - Auto-rotate interval: Change `5000` in the `setInterval` (line 62)
   - Transition duration: Modify `imageVariants` animation durations
   - Control button styling: Update button classes in JSX

3. **Testing**
   - Test with 1, 2, and 3 images
   - Verify auto-rotation works
   - Test manual navigation (prev/next buttons)
   - Test dot indicator clicks
   - Verify accessibility (keyboard navigation, ARIA labels)

## Technical Details

### State Management
- `heroImages`: Array of image URLs (max 3)
- `currentImageIndex`: Current slide index
- `isContentReady`: Controls animation trigger

### Animation Timing
- Image fade-in: 1 second
- Image fade-out: 0.5 seconds
- Auto-rotate interval: 5 seconds
- Content stagger: 0.12 seconds between elements

### Accessibility
- ARIA labels on all controls
- Keyboard navigation support
- Respects `prefers-reduced-motion`
- Minimum touch target size (44x44px)

### Performance
- First image loaded with `priority` flag
- Subsequent images lazy-loaded
- AnimatePresence prevents memory leaks
- Smooth GPU-accelerated transitions

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Touch-friendly controls
- Fallback for older browsers (single image)

## Future Enhancements
- Pause on hover
- Swipe gestures for mobile
- Custom transition effects
- Video support
- Configurable auto-rotate speed from admin panel
