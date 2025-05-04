# Deploying Gorlea's Ink to Vercel

This document provides instructions for deploying the Gorlea's Ink journal application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Firebase](https://firebase.google.com) project (for authentication and database)
3. [DeepSeek](https://deepseek.com) API key (for poem generation)

## Deployment Steps

### 1. Fork or Clone the Repository

First, ensure you have the latest version of the code from the repository.

### 2. Set Up Environment Variables

Before deploying, you'll need to set up the following environment variables in the Vercel dashboard:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `DEEPSEEK_API_KEY`

Note: The `VITE_` prefix is required for variables that need to be accessible in the client-side code.

### 3. Deploy to Vercel

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
5. Add the environment variables mentioned above
6. Click "Deploy"

### 4. Verify the Deployment

After deployment is complete:

1. Test the application by navigating to the provided Vercel URL
2. Verify that you can sign in with Google
3. Test creating a journal entry and generating a poem
4. Check that all features are working correctly

## Troubleshooting

If you encounter issues during deployment:

1. Check the Vercel deployment logs for errors
2. Verify that all environment variables are correctly set
3. Ensure the Firebase project has Google authentication enabled
4. Check that the DeepSeek API key is valid and has sufficient credits

## Custom Domain (Optional)

To use a custom domain:

1. Go to your project settings in the Vercel dashboard
2. Navigate to the "Domains" section
3. Add your custom domain and follow the instructions to configure DNS settings

## Updating the Deployment

To update the deployed application:

1. Push changes to your repository
2. Vercel will automatically detect changes and redeploy the application
3. Monitor the deployment logs to ensure successful updates
