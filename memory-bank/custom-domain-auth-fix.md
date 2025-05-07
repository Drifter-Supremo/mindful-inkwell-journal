# Custom Domain Authentication Fix

## Issue Description

After changing the app name to "Gorlea Dot Ink" in Google OAuth settings and adding custom domains (`https://www.gorlea.ink` and `https://gorlea.ink`) to the Authorized JavaScript origins, users encountered a 404 error when trying to authenticate. The error occurred at the URL:

```
gorlea.ink/__/auth/handler?apiKey=...
```

## Root Cause Analysis

The issue occurs because of a conflict between:

1. The custom domain being used to access the application (gorlea.ink)
2. The Firebase authentication flow which expects to use the original Firebase auth domain (gorlea-todo-list.firebaseapp.com)

When the auth domain in the Firebase configuration was changed to match the custom domain, it broke the authentication flow because Firebase's authentication handlers are still hosted on the original Firebase domain.

## Solution

The solution involves:

1. Keep using the original Firebase auth domain in the .env file:
   ```
   VITE_FIREBASE_AUTH_DOMAIN=gorlea-todo-list.firebaseapp.com
   ```

2. Explicitly set the auth_domain parameter in the GoogleAuthProvider to ensure the authentication flow uses the correct domain:
   ```javascript
   provider.setCustomParameters({
     prompt: 'select_account',
     // Force the auth domain to use the Firebase project's domain for authentication
     auth_domain: 'gorlea-todo-list.firebaseapp.com'
   });
   ```

3. Add detailed logging to help diagnose authentication issues:
   ```javascript
   console.log("Auth domain:", auth.config.authDomain);
   console.log("Provider settings:", provider.customParameters);
   console.log("Current URL:", window.location.href);
   console.log("Attempting sign-in with popup...");
   ```

## Technical Explanation

Firebase Authentication with custom domains works as follows:

1. The initial authentication request comes from your custom domain (gorlea.ink)
2. Firebase redirects to the OAuth provider (Google)
3. After successful authentication, Google redirects back to a Firebase-hosted handler URL
4. This handler URL must be on the original Firebase domain (gorlea-todo-list.firebaseapp.com)
5. The handler then redirects back to your application

If you try to change the auth domain to your custom domain, the redirect chain breaks because Firebase's authentication handlers aren't hosted on your custom domain.

## Implementation Details

### 1. .env File Configuration

```
# Firebase configuration
VITE_FIREBASE_API_KEY=AIzaSyBCEK1mHTrONx1S-oQH6Wmq5vZDhp5gCxM
VITE_FIREBASE_AUTH_DOMAIN=gorlea-todo-list.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gorlea-todo-list
VITE_FIREBASE_STORAGE_BUCKET=gorlea-todo-list.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=54337012537
VITE_FIREBASE_APP_ID=1:54337012537:web:35aae6ccb2d7d064a8dee8
VITE_FIREBASE_MEASUREMENT_ID=G-ZZX5DH3K2D
```

### 2. Auth.tsx Provider Configuration

```javascript
const provider = new GoogleAuthProvider();
// Add custom parameters for Google sign-in
provider.setCustomParameters({
  prompt: 'select_account',
  // Force the auth domain to use the Firebase project's domain for authentication
  auth_domain: 'gorlea-todo-list.firebaseapp.com'
});
```

## Google OAuth Configuration

Ensure your Google OAuth configuration includes:

1. Authorized JavaScript origins:
   - `https://gorlea.ink`
   - `https://www.gorlea.ink`
   - `https://gorlea-todo-list.firebaseapp.com`
   - `http://localhost:5000` (for development)

2. Authorized redirect URIs:
   - `https://gorlea-todo-list.firebaseapp.com/__/auth/handler`

## Testing

To verify the fix:
1. Deploy the changes to Vercel
2. Visit gorlea.ink
3. Click "Sign in with Google"
4. Check the browser console for the detailed logs
5. Verify successful authentication and redirect to the entries page

## Future Considerations

If you want to completely migrate away from the original Firebase domain in the future, you would need to:

1. Set up a custom authentication flow using Firebase Admin SDK
2. Create your own authentication handlers on your custom domain
3. Update the authentication flow to use your custom handlers

However, for most applications, using the approach described in this document (keeping the original Firebase auth domain for authentication) is simpler and more reliable.
