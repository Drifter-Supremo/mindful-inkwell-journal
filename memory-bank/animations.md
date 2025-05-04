# Animations in Gorlea's Ink

This document outlines the animation system implemented in Gorlea's Ink, including available animations, how to use them, and best practices.

## Animation Implementation

Animations in Gorlea's Ink are implemented using:

1. **Framer Motion**: A React animation library that provides components and hooks for creating smooth animations
2. **CSS Animations**: Custom keyframe animations defined in `index.css` and `tailwind.config.ts`
3. **Tailwind CSS**: Utility classes for simple animations and transitions

## Animation Approach

The animation approach in Gorlea's Ink focuses on subtle, purposeful animations that enhance the user experience without being distracting. Key principles include:

1. **Subtlety**: Animations are kept subtle and minimal to avoid overwhelming the user
2. **Purpose**: Each animation serves a specific purpose, such as providing feedback or guiding attention
3. **Performance**: Animations are optimized for performance, using GPU-accelerated properties when possible
4. **Consistency**: Similar elements use similar animations throughout the app

## Animation Utilities

### Framer Motion Components

The app uses Framer Motion components for most animations:

- **motion.div**: For animated containers and elements
- **AnimatePresence**: For handling exit animations
- **motion.button**: For animated buttons

### Animation Properties

Common animation properties used throughout the app:

- **initial**: The starting state of an animation
- **animate**: The final state of an animation
- **exit**: The state when an element is removed
- **transition**: Controls the timing and easing of animations
- **whileHover**: Animation that plays on hover
- **whileTap**: Animation that plays when an element is clicked

### CSS Animations

Custom keyframe animations defined in `index.css`:

- **highlight-pulse**: For highlighting search results
- **fade-in**: For fading in elements
- **slide-up**: For sliding elements up
- **slide-in-left**: For sliding elements in from the left
- **slide-in-right**: For sliding elements in from the right
- **scale-in**: For scaling elements in
- **bounce**: For bouncing elements

### Tailwind Animations

Custom animations defined in `tailwind.config.ts`:

- **fade-in/fade-out**: For fading elements in and out
- **slide-in-up/slide-in-down**: For sliding elements in from top or bottom
- **slide-in-left/slide-in-right**: For sliding elements in from left or right
- **scale-in/scale-out**: For scaling elements in and out
- **pulse-scale**: For pulsing elements

## Animated Components

The following components have been enhanced with animations:

1. **Auth Page**:
   - Smooth entrance animations for elements
   - Loading animation during sign-in
   - Exit animation when navigating to Entries page

2. **AppBar**:
   - Logo hover animation with subtle scale effect
   - Menu button hover effect
   - Search bar expansion animation

3. **FilterDrawer**:
   - Sign-out button loading animation
   - Filter button hover effects

4. **EntriesList**:
   - Subtle entry card animations with staggered timing
   - Gentle hover effect on cards (slight elevation)
   - Smooth poem reveal animation
   - Action button hover effects
   - Empty state animations

5. **Modals**:
   - Modal entrance and exit animations
   - Button hover effects

6. **NewEntry Page**:
   - Form element animations
   - Button hover effects
   - Poem preview animation

## Key Animation Features

1. **Sign-in/Sign-out Animations**:
   - Loading spinner during sign-in process
   - Smooth transition between auth states

2. **Card Hover Effects**:
   - Subtle elevation effect (slight translation upward)
   - Gentle shadow enhancement
   - No excessive scaling or movement

3. **Button Feedback**:
   - Subtle scale effects on hover
   - Visual feedback on click
   - Loading states for async operations

4. **Content Transitions**:
   - Smooth height transitions for expanding/collapsing content
   - Fade effects for content appearance/disappearance

## Best Practices

1. **Performance**:
   - Use transform and opacity for animations when possible
   - Keep animations short and efficient
   - Use hardware-accelerated properties

2. **Accessibility**:
   - Keep animations subtle and non-distracting
   - Avoid rapid flashing or excessive movement
   - Consider users who may prefer reduced motion

3. **Consistency**:
   - Use similar animation patterns for similar interactions
   - Maintain consistent timing and easing across the app
   - Use transition durations between 0.2s and 0.5s for most animations

4. **Implementation**:
   - Use Framer Motion for complex animations
   - Use CSS transitions for simple hover effects
   - Use Tailwind's transition utilities for basic animations

## Adding New Animations

When adding new animations to the app:

1. Keep them subtle and purposeful
2. Test on different devices and screen sizes
3. Ensure they don't interfere with functionality
4. Match the existing animation style

## Animation Examples

### Simple Hover Effect
```jsx
<div className="hover:translate-y-[-2px] transition-transform duration-300">
  Content
</div>
```

### Framer Motion Fade In
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Animated Content Reveal
```jsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>
```
