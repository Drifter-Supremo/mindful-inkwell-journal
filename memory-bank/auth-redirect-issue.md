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

3. Ensured the Firebase configuration in .env was using the correct auth domain:
   ```
   VITE_FIREBASE_AUTH_DOMAIN=www.gorlea.ink
   ```

   Note: When changing the app name in Google OAuth settings, it's important to also update the auth domain in the .env file to match the custom domain being used.

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

1. The auth domain in your Firebase configuration doesn't match the domain you're using
2. The domain isn't properly configured in the Google OAuth settings
3. The Vercel configuration doesn't have the proper rewrites to handle the auth callback

To fix this:
1. Ensure the `VITE_FIREBASE_AUTH_DOMAIN` in your .env file matches your custom domain (e.g., `www.gorlea.ink`)
2. Verify all domains are added to both Authorized JavaScript origins and Authorized redirect URIs in Google OAuth settings
3. Check your Vercel configuration includes the proper rewrites for client-side routing

## Future Considerations

If additional domains are added in the future, remember to:
1. Add them to the Google OAuth configuration (both JavaScript origins and redirect URIs if needed)
2. Ensure the Firebase project settings are updated to include the new domains
3. Update the `VITE_FIREBASE_AUTH_DOMAIN` in your .env file if you're changing the primary domain
