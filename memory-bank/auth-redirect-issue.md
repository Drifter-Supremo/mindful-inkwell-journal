# Authentication Redirect Issue

## Problem Description

When attempting to sign in with Google on the custom domain (gorlea.ink), users were encountering a 404 error page. The specific URL that was failing was:

```
gorlea.ink/__/auth/handler?apiKey=...
```

## Root Cause

The issue was caused by a combination of factors:

1. The Google OAuth configuration did not have the custom domain (gorlea.ink) listed in the Authorized JavaScript origins.
2. The custom domain (gorlea.ink) was not properly set up as a redirect URI in the Google OAuth configuration.
3. The Auth.tsx file was attempting to force the auth domain to be 'gorlea-todo-list.firebaseapp.com' which was causing conflicts with the actual domain being used.

## Solution

The solution involved the following changes:

1. Added the custom domains to the Google OAuth configuration:
   - Added `https://gorlea.ink` to Authorized JavaScript origins
   - Added `https://www.gorlea.ink` to Authorized JavaScript origins

2. Modified the Auth.tsx file to remove the forced auth_domain parameter:
   ```javascript
   // Before
   provider.setCustomParameters({
     prompt: 'select_account',
     // Force the OAuth flow to go through gorlea-todo-list.firebaseapp.com
     auth_domain: 'gorlea-todo-list.firebaseapp.com'
   });

   // After
   provider.setCustomParameters({
     prompt: 'select_account'
   });
   ```

3. Ensured the Firebase configuration in .env was using the original Firebase auth domain:
   ```
   VITE_FIREBASE_AUTH_DOMAIN=gorlea-todo-list.firebaseapp.com
   ```

   4. Explicitly set the auth_domain parameter in the GoogleAuthProvider:
   ```javascript
   provider.setCustomParameters({
     prompt: 'select_account',
     // Force the auth domain to use the Firebase project's domain for authentication
     auth_domain: 'gorlea-todo-list.firebaseapp.com'
   });
   ```

   Note: When using a custom domain with Firebase Authentication, it's often more reliable to keep using the original Firebase auth domain for the authentication flow, while ensuring your custom domain is properly added to the authorized JavaScript origins in the Google OAuth settings.

## Technical Details

### How Firebase Authentication Works with Custom Domains

Firebase Authentication uses a two-step process:

1. The authentication request is initiated from the client domain (e.g., gorlea.ink)
2. Firebase redirects to the OAuth provider (Google)
3. After authentication, Google redirects back to the Firebase auth handler URL

For this to work properly:
- The client domain must be in the list of Authorized JavaScript origins
- The Firebase auth handler URL must be in the list of Authorized redirect URIs

### Vercel Configuration

The Vercel configuration includes rewrites to handle client-side routing:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures that all client-side routes are properly handled by the React Router.

## Testing

To verify the fix:
1. Visit gorlea.ink
2. Click "Sign in with Google"
3. Complete the Google authentication flow
4. Confirm successful redirect to the entries page

## Common Issues and Troubleshooting

### 404 Error on Auth Handler Page

If you encounter a 404 error at the URL `gorlea.ink/__/auth/handler?apiKey=...`, it typically indicates one of these issues:

1. The auth domain configuration is causing conflicts between your custom domain and Firebase's authentication flow
2. The domain isn't properly configured in the Google OAuth settings
3. The Vercel configuration doesn't have the proper rewrites to handle the auth callback

To fix this:
1. Use the original Firebase auth domain in your .env file: `VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com`
2. Explicitly set the auth_domain parameter in your GoogleAuthProvider:
   ```javascript
   provider.setCustomParameters({
     prompt: 'select_account',
     auth_domain: 'your-project-id.firebaseapp.com'
   });
   ```
3. Verify all domains are added to the Authorized JavaScript origins in Google OAuth settings
4. Check your Vercel configuration includes the proper rewrites for client-side routing
5. Add detailed console logging to help diagnose authentication issues

## Future Considerations

If additional domains are added in the future, remember to:
1. Add them to the Google OAuth configuration (both JavaScript origins and redirect URIs if needed)
2. Ensure the Firebase project settings are updated to include the new domains
3. Update the `VITE_FIREBASE_AUTH_DOMAIN` in your .env file if you're changing the primary domain
