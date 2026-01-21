# Work Cards Animation Features

## Overview
The project cards now feature beautiful, Framer Motion-inspired animations powered by **Motion One** - a lightweight vanilla JavaScript animation library.

## Features Implemented

### 🎨 Beautiful Entrance Animations
- **Staggered Sequential Appearance**: Cards appear one after another with a smooth stagger effect
- **Multi-layered Animation**: Each card animates with:
  - Opacity fade-in (0 → 1)
  - Scale transformation (0.9 → 1)
  - Vertical slide (80px → 0)
  - Blur effect (10px → 0) on desktop
  - 3D rotation (rotateX: 10deg → 0) on desktop

### ⚡ Internal Element Animations (Desktop Only)
Each card's internal elements animate separately with their own timing:
- **Icon**: Bounces in with spring-like physics (scale + rotate)
- **Title**: Slides in from the left
- **Description**: Fades and slides up
- **Tags**: Pop in sequentially with stagger

### 📱 Mobile Optimizations
- Simplified animations for better performance on mobile devices
- Removes blur and 3D transforms on screens < 768px
- Skips internal element animations on mobile
- Faster animation duration (0.6s vs 0.8s)

### ♿ Accessibility
- Respects `prefers-reduced-motion` preference
- Immediately shows content without animation if user prefers reduced motion
- All animations are GPU-accelerated for smooth 60fps performance

### 🔄 Scroll-Triggered Animations
- Cards below the fold animate when scrolled into view
- Uses Intersection Observer API for efficient scroll detection
- Each card maintains its index-based delay

### 🛡️ Fallback Support
- Gracefully degrades if Motion One library fails to load
- Uses simple CSS transitions as fallback
- Console warning for debugging

## Technical Details

### Animation Timing
- **Stagger delay**: 0.12s between cards
- **Start delay**: 0.2s initial delay
- **Easing**: Custom cubic-bezier(0.22, 0.61, 0.36, 1)
- **Spring easing**: cubic-bezier(0.34, 1.56, 0.64, 1) for bouncy effects

### Performance Optimizations
- Uses `will-change` CSS property for GPU acceleration
- Animates only transform and opacity properties
- Lazy animations for off-screen cards
- Reduced complexity on mobile devices
- Respects system performance preferences

### Libraries Used
- **Motion One v11.11.13**: Modern animation library for vanilla JavaScript
- Loaded via CDN from jsdelivr.net
- No build step required
- ~6KB gzipped

## CSS Classes
- `.project-card`: Main card container with initial hidden state
- `.animated`: Applied when animation completes (for future reference)

## Browser Support
- Modern browsers with CSS transforms and animations
- Fallback for older browsers via progressive enhancement
- Works without JavaScript (cards appear immediately)

## Future Enhancements
- Hover animations with magnetic cursor effects
- Parallax effects on scroll
- Interactive particle systems
- Theme-based animation variations
