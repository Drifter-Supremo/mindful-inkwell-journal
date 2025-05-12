# Recent Fixes (July 2025)

## 1. Enhanced Gorlea's System Prompt to Prevent Dashes

### Issue
Gorlea was still using dashes in her poems despite previous instructions not to use them.

### Solution
The system prompt was updated in three locations to strongly emphasize never using dashes:

1. In `server.js` (development server)
2. In `src/api/generate-poem.ts` (API endpoint)
3. In `api/generate-poem.js` (Vercel serverless function)

The updated prompt includes:

```
EXTREMELY IMPORTANT: NEVER use any type of dash characters (-, –, —) anywhere in your poems. This is a strict requirement.
Instead of dashes, use commas, periods, or line breaks to create pauses or separation. If you include even a single dash,
you have failed your task completely.
```

This stronger language should prevent Gorlea from using dashes in her poems.

## 2. Fixed Password Reset UI

### Issue
After submitting an email for password reset, the page would get stuck in a loading state indefinitely, even though the reset email was successfully sent.

### Solution
The password reset flow was improved to:

1. Show a success message with a checkmark icon after the reset email is sent
2. Display a clear message instructing the user to check their inbox
3. Provide a "Return to Sign In" button to navigate back to the login screen
4. Reset all relevant state variables when toggling between different auth screens

### Implementation Details

- Added a new state variable `isResetEmailSent` to track when the reset email has been sent
- Updated the password reset form to conditionally render either the email input form or the success message
- Added a "Return to Sign In" button on the success screen
- Ensured all state variables are properly reset when switching between auth modes
- Added the CheckCircle icon from Lucide React for visual feedback

### User Experience Improvements

- Clear visual feedback when the reset email is sent
- No more indefinite loading state
- Easy navigation back to the login screen
- Consistent animation transitions between states

This implementation follows the user's preference for smooth animations and clear user feedback throughout the application.
