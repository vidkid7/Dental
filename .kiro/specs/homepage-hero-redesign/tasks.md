# Implementation Plan

- [x] 1. Refactor HeroSection component to full-width layout




  - Remove the two-column grid layout (`grid lg:grid-cols-2`)
  - Remove container-custom class constraint
  - Implement full-width container with `w-full min-h-screen`
  - Remove decorative elements (floating cards, stats badges, gallery button)
  - Create centered content container with max-width constraint
  - _Requirements: 1.1, 1.4, 4.1, 4.2_

- [x] 2. Implement background image layer with gradient overlay





  - Convert team image from inline element to full background
  - Use Next.js Image component with `fill` layout and `object-cover`
  - Set image as priority for LCP optimization
  - Create gradient overlay layer with proper z-indexing
  - Apply `bg-gradient-to-b from-neutral-900/70 via-neutral-900/50 to-neutral-900/30`
  - Ensure proper layering: image (z-0), gradient (z-1), content (z-10)
  - _Requirements: 1.2, 1.3, 1.5_

- [x] 3. Update typography and content layout




  - Increase headline text size to `text-5xl md:text-6xl lg:text-7xl`
  - Apply `font-bold` and `text-white` to headline
  - Center-align all text content
  - Update subtitle to `text-lg md:text-xl lg:text-2xl` with `text-white/90`
  - Add max-width constraint to subtitle (`max-w-3xl`)
  - Adjust spacing between elements (badge, headline, subtitle, CTA)
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 4.3_

- [x] 4. Simplify CTA button section





  - Remove secondary "Call Now" button
  - Keep only primary "Book Appointment" button
  - Apply `btn-lg` styling with `shadow-elevated`
  - Ensure button uses `bg-primary-600 hover:bg-primary-700`
  - Center the button below subtitle
  - Maintain Link to `/appointments/book`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Update CMS integration for new layout





  - Verify API endpoint `/api/v1/content/page/home/hero` compatibility
  - Update state interface to match new simplified content structure
  - Remove stats object from content interface (no longer displayed)
  - Ensure imagePath is used for background image
  - Maintain fallback to default content on API failure
  - Test with existing CMS data
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 6. Implement responsive behavior





  - Add responsive text sizing with Tailwind breakpoints
  - Ensure full-width layout works on all screen sizes
  - Verify image scaling maintains coverage on mobile
  - Test CTA button touch target size (minimum 44x44px)
  - Adjust padding for mobile, tablet, and desktop
  - Test gradient overlay contrast on all devices
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Update animations for new layout





  - Simplify entrance animations for centered content
  - Remove animations for deleted elements (floating cards)
  - Implement fade-in animation for main content container
  - Add staggered animation for badge, headline, subtitle, CTA
  - Ensure all animations complete within 1000ms
  - Add `prefers-reduced-motion` media query support
  - Prevent layout shifts during image loading
  - _Requirements: 7.1, 7.3, 7.4, 7.5_

- [ ]* 8. Write unit tests for HeroSection component
  - Test component renders with default content when API fails
  - Test component applies CMS content when API succeeds
  - Test gradient overlay is present in DOM
  - Test CTA button links to `/appointments/book`
  - Test loading state displays during API call
  - Test image fallback when imagePath is invalid
  - Test decorative elements are removed from DOM
  - Test responsive text classes are applied
  - _Requirements: All_

- [ ]* 9. Write property-based tests for hero section
  - **Property 1: Full-width layout consistency**
  - **Validates: Requirements 1.1, 1.4**

- [ ]* 9.1 Write property test for content visibility
  - **Property 2: Content visibility over gradient**
  - **Validates: Requirements 1.3, 2.2**

- [ ]* 9.2 Write property test for CMS content application
  - **Property 3: CMS content application**
  - **Validates: Requirements 5.2, 5.3**

- [ ]* 9.3 Write property test for graceful degradation
  - **Property 4: Graceful degradation**
  - **Validates: Requirements 5.4**

- [ ]* 9.4 Write property test for responsive text scaling
  - **Property 5: Responsive text scaling**
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 9.5 Write property test for CTA button accessibility
  - **Property 6: CTA button accessibility**
  - **Validates: Requirements 3.1, 6.3**

- [ ]* 9.6 Write property test for animation timing
  - **Property 7: Animation completion timing**
  - **Validates: Requirements 7.3**

- [ ]* 9.7 Write property test for reduced motion
  - **Property 8: Reduced motion respect**
  - **Validates: Requirements 7.4**

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 11. Perform accessibility audit
  - Test keyboard navigation to CTA button
  - Verify screen reader announcements
  - Validate color contrast ratios (WCAG AA)
  - Check touch target sizes on mobile
  - Verify reduced motion preference is respected
  - Test with NVDA/JAWS screen readers
  - _Requirements: 6.3, 7.4_

- [ ]* 12. Conduct visual regression testing
  - Capture screenshots at mobile (375px), tablet (768px), desktop (1440px)
  - Compare against design specifications
  - Verify gradient overlay appearance
  - Verify text positioning and sizing
  - Test with different hero images
  - _Requirements: All visual requirements_

- [ ] 13. Final checkpoint - Verify production readiness
  - Ensure all tests pass, ask the user if questions arise.
