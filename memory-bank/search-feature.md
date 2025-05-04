# Search Feature Documentation

## Overview
The search feature in Gorlea's Ink allows users to dynamically search through both journal entries and poems. It features a sleek, animated search bar that expands when clicked and displays real-time results as the user types.

## Components

### 1. SearchBar.tsx
- Animated search icon that expands into a full search input when clicked
- Uses Framer Motion for smooth animations
- Positioned in the top-right corner of the AppBar
- Expands to the left to avoid page stretching
- Includes a clear button (X) to reset the search
- Supports keyboard navigation (Escape key to close)

### 2. SearchResults.tsx
- Displays matching results in a dropdown below the search bar
- Highlights matching text in both entries and poems
- Shows a preview of content with proper truncation
- Includes date information for each result
- Animated appearance and disappearance
- Limited height with scrolling for many results

### 3. SearchContext.tsx
- Manages search state across components
- Handles the search logic for filtering entries
- Maintains the list of all entries and filtered results
- Provides functions for refreshing entries and clearing search
- Tracks the selected entry for highlighting in the results list

## User Experience
1. User clicks the search icon in the top-right corner
2. Search bar expands to the left with a smooth animation
3. As user types, results should appear in real-time below the search bar
4. Matching text is highlighted in the results
5. Clicking a result scrolls to and highlights that entry in the main list
6. Search can be cleared by clicking the X button or pressing Escape

## Implementation Details
- Uses Framer Motion for all animations
- Search is performed on both entry content and poems
- Results are displayed in a scrollable area with a maximum height
- The search bar is responsive and works on all screen sizes
- Search results are positioned to avoid UI conflicts

## Mobile Responsiveness
- On mobile devices, the search bar expands to an appropriate width to avoid UI conflicts
- When the search bar is expanded on mobile, the Gorlea logo is temporarily hidden to prevent overlap
- The search icon maintains consistent positioning when the search bar is closed
- The search bar can be closed by clicking outside of it, providing a more intuitive user experience

## Implementation Details
- Uses a click-outside detection mechanism to close the search when clicking elsewhere on the page
- Responsive design adjusts the search bar width based on screen size
- Handles proper animation sequencing to ensure smooth transitions
- Uses CSS transitions for the logo visibility to provide a smooth experience
- Maintains proper z-index layering to ensure search results appear above other content

## Current Status
- Search functionality is fully implemented and working
- Results appear in real-time as the user types
- The search bar expands and collapses with smooth animations
- Mobile view properly handles UI element positioning to prevent overlaps
- Search can be closed by clicking the X button, pressing Escape, or clicking outside the search area
