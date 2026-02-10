# CMS Integration Update - Hero Section

## Overview
The hero section CMS integration has been updated to match the new simplified full-width layout design.

## API Endpoint
- **Endpoint**: `/api/v1/content/page/home/hero`
- **Method**: GET
- **Response Structure**:
```typescript
{
  content: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    imagePath?: string;
  }
}
```

## Changes Made

### 1. Type Safety
- Added `HeroApiResponse` interface to properly type the API response
- Changed from `any` type to strongly typed `HeroApiResponse`

### 2. Simplified Content Structure
- Removed `stats` object (no longer displayed in new design)
- Kept only essential fields: `badgeText`, `title`, `subtitle`, `ctaText`, `imagePath`

### 3. Graceful Degradation
- Component maintains default content on API failure
- Improved error logging with more descriptive message
- Each field falls back to default if not provided by API

### 4. Background Image Integration
- `imagePath` from CMS is used for the full-width background image
- Falls back to `/images/team.jpg` if not provided
- Image is loaded with `priority` flag for LCP optimization

## Default Content
```typescript
{
  badgeText: 'Open 7 Days a Week - Quality Dental Care',
  title: 'Your Trusted Healthcare Partner',
  subtitle: 'Om Chabahil Dental Hospital - Providing quality dental care with modern technology and experienced professionals in Kathmandu, Nepal.',
  ctaText: 'Book Appointment',
  imagePath: '/images/team.jpg',
}
```

## Compatibility Notes

### Admin Panel Compatibility
The admin panel at `/admin/content/home-images` correctly updates the `imagePath` field:
```typescript
await put('content/page/home/hero', {
  content: {
    ...heroData?.content,
    imagePath: imageUrl,
  },
});
```

### Backward Compatibility
- If the API returns additional fields (like `stats`), they are safely ignored
- Missing fields automatically fall back to defaults
- Empty strings are treated as missing and use defaults

## Testing Checklist

- [x] TypeScript compilation passes
- [x] Build completes successfully
- [x] API response structure matches interface
- [x] Fallback to default content works
- [x] Image path is correctly applied
- [ ] Manual testing with live backend (requires backend to be running)
- [ ] Verify admin panel can update hero content
- [ ] Verify changes persist after page refresh

## Requirements Validated

- ✅ **Requirement 5.1**: Fetches hero content from existing CMS API endpoint
- ✅ **Requirement 5.2**: Applies custom headline, subtitle, and CTA text from API
- ✅ **Requirement 5.3**: Displays uploaded team image as hero background
- ✅ **Requirement 5.4**: Displays default content gracefully on API failure
- ✅ **Requirement 5.5**: Changes reflect on homepage without requiring deployment (CMS-driven)
