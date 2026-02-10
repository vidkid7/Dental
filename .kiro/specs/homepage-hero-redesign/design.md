# Design Document

## Overview

This design document outlines the transformation of the Om Chabahil Dental Hospital homepage hero section from a two-column layout with decorative elements to a modern, full-width institutional healthcare design. The redesign emphasizes trust, professionalism, and clarity through a large background image, centered content, and prominent call-to-action, while maintaining integration with the existing content management system.

## Architecture

### Component Structure

The redesigned hero section will maintain the existing React component architecture but with significant layout and styling changes:

```
HeroSection (Client Component)
├── Full-width container (viewport width)
├── Background image layer
├── Gradient overlay layer
├── Centered content container
│   ├── Badge (optional, from CMS)
│   ├── Headline text
│   ├── Subtitle text
│   └── CTA button group
└── Loading state
```

### Data Flow

1. Component mounts and initiates API call to `/api/v1/content/page/home/hero`
2. While loading, display default content with loading state
3. On successful API response, update state with CMS content
4. Render hero with fetched or default content
5. Apply animations after content is ready

### Integration Points

- **CMS API**: Existing endpoint at `/api/v1/content/page/home/hero`
- **Image Service**: Backend media service for serving uploaded images
- **Routing**: Next.js Link component for navigation to `/appointments/book`
- **Animation Library**: Framer Motion for entrance animations

## Components and Interfaces

### HeroSection Component

**File**: `frontend/src/components/home/HeroSection.tsx`

**Props**: None (self-contained component)

**State Interface**:
```typescript
interface HeroContent {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  imagePath?: string;
}
```

**Key Responsibilities**:
- Fetch hero content from CMS API
- Manage loading and error states
- Render full-width hero layout
- Apply gradient overlay
- Handle responsive behavior
- Implement entrance animations

### Layout Structure

**Full-Width Container**:
- Remove `container-custom` class constraint
- Use `w-full` for full viewport width
- Minimum height: `100vh` (full viewport height)
- Position: `relative` for layering

**Background Image Layer**:
- Use Next.js `Image` component with `fill` layout
- Object-fit: `cover` for full coverage
- Priority loading for LCP optimization
- Z-index: `0` (bottom layer)

**Gradient Overlay**:
- Position: `absolute` covering full hero
- Gradient: Dark to transparent (top to bottom or center radial)
- Background: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3))`
- Z-index: `1` (above image, below content)

**Content Container**:
- Position: `relative` with z-index `10`
- Centered: `flex items-center justify-center`
- Max-width: `1200px` for content readability
- Padding: Responsive padding for all screen sizes
- Text-align: `center`

## Data Models

### CMS Response Model

```typescript
interface HeroApiResponse {
  content: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    imagePath?: string;
  };
}
```

### Default Content Model

```typescript
const DEFAULT_HERO_CONTENT: HeroContent = {
  badgeText: 'Open 7 Days a Week - Quality Dental Care',
  title: 'Your Trusted Healthcare Partner',
  subtitle: 'Om Chabahil Dental Hospital - Providing quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.',
  ctaText: 'Book Appointment',
  imagePath: '/images/team.jpg'
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Full-width layout consistency

*For any* viewport width, the hero section should span the entire width without horizontal scrollbars or gaps.

**Validates: Requirements 1.1, 1.4**

### Property 2: Content visibility over gradient

*For any* background image loaded, the text content should remain readable with sufficient contrast provided by the gradient overlay.

**Validates: Requirements 1.3, 2.2**

### Property 3: CMS content application

*For any* valid API response containing hero content fields, those fields should replace the corresponding default content values in the rendered component.

**Validates: Requirements 5.2, 5.3**

### Property 4: Graceful degradation

*For any* API failure or missing content fields, the system should display default content without breaking the layout or user experience.

**Validates: Requirements 5.4**

### Property 5: Responsive text scaling

*For any* viewport width below 768px, the headline text size should scale down proportionally while maintaining readability.

**Validates: Requirements 6.1, 6.2**

### Property 6: CTA button accessibility

*For any* screen size, the Book Appointment button should maintain a minimum touch target size of 44x44 pixels for accessibility.

**Validates: Requirements 3.1, 6.3**

### Property 7: Animation completion timing

*For any* entrance animation, the animation duration should not exceed 1000ms to ensure content is quickly visible.

**Validates: Requirements 7.3**

### Property 8: Reduced motion respect

*For any* user with `prefers-reduced-motion` enabled, animations should be disabled or significantly reduced.

**Validates: Requirements 7.4**

## Error Handling

### API Failure Scenarios

1. **Network Error**: Display default content, log error to console
2. **404 Not Found**: Display default content (content not yet configured)
3. **500 Server Error**: Display default content, log error
4. **Timeout**: Display default content after 5-second timeout

### Image Loading Failures

1. **Invalid Image Path**: Fall back to default team image
2. **Image Load Error**: Use Next.js Image component error handling with fallback
3. **Missing Image**: Display default `/images/team.jpg`

### Content Validation

- Check for empty strings and treat as undefined
- Validate image paths start with `/` or `http`
- Sanitize text content to prevent XSS (handled by React)

## Testing Strategy

### Unit Testing

**Framework**: Jest + React Testing Library

**Test Cases**:
1. Component renders with default content when API fails
2. Component applies CMS content when API succeeds
3. Gradient overlay is present in DOM
4. CTA button links to correct appointment page
5. Loading state displays during API call
6. Image fallback works when imagePath is invalid

**Example Test**:
```typescript
describe('HeroSection', () => {
  it('should render with default content on API failure', async () => {
    // Mock API to reject
    jest.spyOn(api, 'get').mockRejectedValue(new Error('API Error'));
    
    render(<HeroSection />);
    
    await waitFor(() => {
      expect(screen.getByText(/Your Trusted Healthcare Partner/i)).toBeInTheDocument();
    });
  });
});
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Property Tests**:

1. **Full-width layout property**: Generate random viewport widths, verify hero spans full width
2. **Content visibility property**: Generate random background colors, verify text contrast ratio meets WCAG AA
3. **CMS content application property**: Generate random valid API responses, verify all fields are applied
4. **Responsive scaling property**: Generate random viewport widths, verify text scales appropriately
5. **Animation timing property**: Verify all animations complete within 1000ms

**Configuration**: Each property test should run minimum 100 iterations

### Integration Testing

1. Test full user flow from homepage load to CTA click
2. Test CMS admin updating hero content and verifying frontend changes
3. Test responsive behavior across device sizes
4. Test image upload and display workflow

### Visual Regression Testing

1. Capture screenshots at key breakpoints (mobile, tablet, desktop)
2. Compare against baseline after changes
3. Verify gradient overlay appearance
4. Verify text positioning and sizing

### Accessibility Testing

1. Keyboard navigation to CTA button
2. Screen reader announcement of hero content
3. Color contrast validation (WCAG AA minimum)
4. Touch target size validation on mobile
5. Reduced motion preference respect

## Design Specifications

### Typography

**Headline**:
- Font: Poppins (heading font)
- Size: `text-5xl md:text-6xl lg:text-7xl` (48px / 60px / 72px)
- Weight: `font-bold` (700)
- Color: `text-white`
- Line height: `leading-tight` (1.25)
- Text align: `text-center`

**Subtitle**:
- Font: Inter (body font)
- Size: `text-lg md:text-xl lg:text-2xl` (18px / 20px / 24px)
- Weight: `font-normal` (400)
- Color: `text-white/90` (90% opacity)
- Line height: `leading-relaxed` (1.625)
- Max width: `max-w-3xl` (768px)
- Text align: `text-center`

**Badge** (optional):
- Font: Inter
- Size: `text-sm` (14px)
- Weight: `font-medium` (500)
- Background: `bg-white/20 backdrop-blur-sm`
- Padding: `px-4 py-2`
- Border radius: `rounded-full`

### Colors

**Gradient Overlay**:
- Primary option: `bg-gradient-to-b from-neutral-900/70 via-neutral-900/50 to-neutral-900/30`
- Alternative: `bg-gradient-to-br from-primary-900/60 via-primary-800/40 to-transparent`

**CTA Button**:
- Background: `bg-primary-600` (#0086c9)
- Hover: `hover:bg-primary-700` (#026aa2)
- Text: `text-white`
- Shadow: `shadow-elevated`
- Size: `btn-lg` (px-8 py-4 text-lg)

### Spacing

**Hero Section**:
- Height: `min-h-screen` (100vh)
- Padding: `px-4 sm:px-6 lg:px-8`

**Content Spacing**:
- Badge to Headline: `mb-6` (24px)
- Headline to Subtitle: `mb-6` (24px)
- Subtitle to CTA: `mb-8` (32px)

### Responsive Breakpoints

- **Mobile** (< 768px): Single column, smaller text, full-width CTA
- **Tablet** (768px - 1024px): Medium text sizes, centered layout
- **Desktop** (> 1024px): Large text sizes, maximum content width

### Animations

**Entrance Animations** (using Framer Motion):

```typescript
// Content fade-in
const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

// Staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};
```

## Implementation Notes

### Removed Elements

The following elements from the current hero section will be removed:
- Two-column grid layout
- Floating certification card (left side)
- Floating patient care card (right side)
- Gallery tour button overlay
- Stats badges at bottom (Years Experience, Expert Dentists, Happy Patients)
- Decorative background blur circles
- Rounded image container with shadow
- Secondary "Call Now" button

### Preserved Elements

- CMS integration for content management
- Framer Motion animations
- Next.js Image optimization
- Responsive design principles
- Loading states
- Error handling with fallbacks

### New Elements

- Full-width background image
- Gradient overlay layer
- Centered content layout
- Larger, more prominent typography
- Single prominent CTA button
- Cleaner, more institutional aesthetic

### Performance Considerations

1. **Image Optimization**: Use Next.js Image with priority loading
2. **LCP Optimization**: Hero image is LCP element, ensure fast loading
3. **Animation Performance**: Use CSS transforms for animations (GPU accelerated)
4. **Bundle Size**: Remove unused decorative components
5. **API Caching**: Consider caching CMS responses for faster subsequent loads

### Accessibility Considerations

1. **Semantic HTML**: Use `<section>` with appropriate ARIA labels
2. **Alt Text**: Provide descriptive alt text for hero image
3. **Color Contrast**: Ensure WCAG AA compliance (4.5:1 for text)
4. **Keyboard Navigation**: CTA button must be keyboard accessible
5. **Screen Readers**: Proper heading hierarchy (h1 for main headline)
6. **Reduced Motion**: Respect `prefers-reduced-motion` media query

## Migration Strategy

### Phase 1: Component Refactoring
- Update HeroSection component with new layout
- Remove decorative elements
- Implement full-width design

### Phase 2: Styling Updates
- Apply new typography scales
- Implement gradient overlay
- Update button styling

### Phase 3: Testing
- Run unit tests
- Run property-based tests
- Perform visual regression testing
- Conduct accessibility audit

### Phase 4: Deployment
- Deploy to staging environment
- Conduct user acceptance testing
- Deploy to production
- Monitor performance metrics

### Rollback Plan

If issues arise post-deployment:
1. Revert to previous HeroSection component version
2. Investigate issues in staging environment
3. Apply fixes and re-test
4. Re-deploy when stable

## Future Enhancements

1. **Video Background**: Support for video backgrounds in CMS
2. **Multiple CTAs**: Support for secondary CTA buttons
3. **A/B Testing**: Implement variant testing for hero designs
4. **Parallax Effect**: Add subtle parallax scrolling effect
5. **Dynamic Gradients**: Allow CMS to configure gradient colors
6. **Animated Text**: Add typewriter or fade-in text effects
