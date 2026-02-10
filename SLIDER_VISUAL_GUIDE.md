# Hero Slider Visual Guide

## What You Should See on the Homepage

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ◄ [Previous]                              [Next] ►        │
│                                                             │
│                    ┌─────────────────┐                     │
│                    │                 │                     │
│                    │  HERO IMAGE     │                     │
│                    │  (Full Width)   │                     │
│                    │                 │                     │
│                    │  With Gradient  │                     │
│                    │  Overlay        │                     │
│                    │                 │                     │
│                    │  ┌───────────┐  │                     │
│                    │  │  Badge    │  │                     │
│                    │  └───────────┘  │                     │
│                    │                 │                     │
│                    │   HEADLINE      │                     │
│                    │                 │                     │
│                    │   Subtitle      │                     │
│                    │                 │                     │
│                    │  ┌───────────┐  │                     │
│                    │  │   Book    │  │                     │
│                    │  │Appointment│  │                     │
│                    │  └───────────┘  │                     │
│                    │                 │                     │
│                    └─────────────────┘                     │
│                                                             │
│                    ● ○ ○  (Dot Indicators)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Slider Controls Explained

### 1. Previous/Next Buttons
```
◄ [Previous]                                    [Next] ►
   └─ Click to go to previous image    Click to go to next image ─┘
```

### 2. Dot Indicators
```
● ○ ○
│ │ │
│ │ └─ Image 3 (inactive)
│ └─── Image 2 (inactive)
└───── Image 1 (active - filled dot)
```

### 3. Auto-Rotation Timeline
```
0s ────► 5s ────► 10s ────► 15s ────► (loops back to 0s)
│        │         │         │
Image 1  Image 2   Image 3   Image 1
```

## Admin Panel View

When you go to `/admin/content/home-images`, you'll see:

```
┌─────────────────────────────────────────────────────────────┐
│  Hero Section Slider (Up to 3 Images)    [Add Image Slot]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Hero     │  │ Hero     │  │ Hero     │                 │
│  │ Image 1  │  │ Image 2  │  │ Image 3  │                 │
│  │          │  │          │  │          │                 │
│  │ [Image]  │  │ [Image]  │  │ [Image]  │                 │
│  │          │  │          │  │          │                 │
│  │ [Upload] │  │ [Upload] │  │ [Upload] │                 │
│  │          │  │          │  │          │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│       [X]           [X]           [X]                      │
│                                                             │
│  3 images will rotate automatically in the hero section.   │
└─────────────────────────────────────────────────────────────┘
```

## Interaction Flow

### User Clicks Previous Button
```
Before:  Image 2 (visible)
         ↓
Action:  User clicks ◄
         ↓
After:   Image 1 (visible with fade transition)
```

### User Clicks Dot Indicator
```
Before:  Image 1 (● ○ ○)
         ↓
Action:  User clicks third dot
         ↓
After:   Image 3 (○ ○ ●)
```

### Auto-Rotation
```
Time: 0s
Image 1 visible (● ○ ○)
         ↓
Time: 5s (auto-advance)
Image 2 visible (○ ● ○)
         ↓
Time: 10s (auto-advance)
Image 3 visible (○ ○ ●)
         ↓
Time: 15s (auto-advance, loops back)
Image 1 visible (● ○ ○)
```

## Mobile View

On mobile devices (< 768px):

```
┌─────────────────────┐
│                     │
│  ◄            ►     │
│                     │
│   ┌─────────┐       │
│   │         │       │
│   │  IMAGE  │       │
│   │         │       │
│   │ Badge   │       │
│   │         │       │
│   │Headline │       │
│   │         │       │
│   │Subtitle │       │
│   │         │       │
│   │ [Book]  │       │
│   │         │       │
│   └─────────┘       │
│                     │
│      ● ○ ○          │
│                     │
└─────────────────────┘
```

## Animation Sequence

When page loads:

```
Step 1: Image fades in (0-1s)
        ↓
Step 2: Badge appears (0.15-0.6s)
        ↓
Step 3: Headline appears (0.27-0.72s)
        ↓
Step 4: Subtitle appears (0.39-0.84s)
        ↓
Step 5: CTA button appears (0.51-0.96s)
        ↓
Total: ~1 second for full animation
```

## Expected Behavior

✅ **What Should Happen:**
- Images change smoothly every 5 seconds
- Previous/Next buttons change images immediately
- Dot indicators show current image
- Clicking dots jumps to that image
- Smooth fade transitions
- No layout shifts

❌ **What Should NOT Happen:**
- Abrupt image changes
- Broken images
- Missing controls
- Layout jumping
- Slow loading

## Quick Test

1. Open homepage
2. Wait 5 seconds → Image should change
3. Click next button → Image should change immediately
4. Click a dot → Should jump to that image
5. Wait 5 seconds → Auto-rotation should resume

If all these work, your slider is functioning correctly!
