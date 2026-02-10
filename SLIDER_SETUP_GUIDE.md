# Hero Slider Setup Guide

## Quick Start

The hero slider is now active with 3 default images! You should see:

1. **On the Homepage (`/`)**
   - 3 images rotating every 5 seconds
   - Previous/Next arrow buttons on the sides
   - Dot indicators at the bottom
   - Smooth fade transitions between images

2. **Default Images Being Used**
   - Image 1: `/images/team.jpg`
   - Image 2: `/images/clinic-1.jpg`
   - Image 3: `/images/clinic-2.jpg`

## How to See the Slider

### Option 1: View Immediately
Just refresh your homepage - the slider should now be visible with the 3 default images!

### Option 2: Customize Images via Admin Panel

1. **Navigate to Admin Panel**
   ```
   Go to: /admin/content/home-images
   ```

2. **You'll See 3 Image Slots**
   - Hero Image 1
   - Hero Image 2
   - Hero Image 3

3. **Upload Your Own Images**
   - Click "Upload New Image" on any slot
   - Select your image (JPG/PNG, max 5MB)
   - Image is auto-saved immediately

4. **Add or Remove Slots**
   - Click "Add Image Slot" to add more (max 3 total)
   - Click the X button to remove a slot (min 1 required)

## Slider Features

### Auto-Rotation
- Images change automatically every 5 seconds
- Smooth fade transition (1 second)
- Continuous loop

### Manual Navigation
- **Previous Button**: Left arrow on the left side
- **Next Button**: Right arrow on the right side
- **Dot Indicators**: Click any dot to jump to that image

### Responsive Design
- Works on mobile, tablet, and desktop
- Touch-friendly controls
- Adapts to all screen sizes

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- Respects `prefers-reduced-motion` setting

## Troubleshooting

### "I don't see the slider controls"
- **Cause**: You only have 1 image configured
- **Solution**: Add more images via admin panel or check that default images loaded

### "Images aren't changing"
- **Cause**: JavaScript might be disabled or there's a console error
- **Solution**: Check browser console for errors, refresh the page

### "I see broken images"
- **Cause**: Image paths are incorrect
- **Solution**: Make sure images exist at:
  - `/public/images/team.jpg`
  - `/public/images/clinic-1.jpg`
  - `/public/images/clinic-2.jpg`

### "Slider is too fast/slow"
- **Cause**: Default timing is 5 seconds
- **Solution**: Edit `HeroSection.tsx` line 92, change `5000` to desired milliseconds

## Testing Checklist

- [ ] Homepage loads without errors
- [ ] 3 images are visible in rotation
- [ ] Previous/Next buttons work
- [ ] Dot indicators work
- [ ] Auto-rotation happens every 5 seconds
- [ ] Smooth fade transitions
- [ ] Mobile responsive
- [ ] Admin panel shows 3 image slots

## Next Steps

1. **Replace Default Images**
   - Upload your own professional photos
   - Recommended size: 1920x1080px or 1200x800px
   - Use high-quality images

2. **Test on Different Devices**
   - Desktop browser
   - Mobile phone
   - Tablet

3. **Customize Timing** (Optional)
   - Edit auto-rotation speed
   - Adjust transition duration
   - Modify animation effects

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify image files exist in `/public/images/`
3. Clear browser cache and refresh
4. Check that backend API is running

The slider should now be working! Refresh your homepage to see it in action.
