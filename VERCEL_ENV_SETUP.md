# Setting Up Environment Variables in Vercel

This guide provides step-by-step instructions for setting up environment variables in Vercel for Gorlea's Ink.

## Why Environment Variables Are Important

Environment variables store sensitive information like API keys that shouldn't be committed to your repository. They allow your application to access these values securely during runtime.

## Required Environment Variables

For Gorlea's Ink, you need the following environment variables:

1. **Firebase Configuration**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

2. **DeepSeek API Key**:
   - `DEEPSEEK_API_KEY` (for serverless functions)

## Step-by-Step Guide

### 1. Access Environment Variables in Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (Gorlea's Ink)
3. Click on "Settings" in the top navigation
4. Select "Environment Variables" from the left sidebar

### 2. Add Environment Variables

For each required variable:

1. Click "Add New"
2. Enter the variable name (e.g., `DEEPSEEK_API_KEY`)
3. Enter the variable value (your actual API key)
4. Select the environments where this variable should be available:
   - Production (for the live site)
   - Preview (for preview deployments)
   - Development (for local development with Vercel CLI)
5. Click "Save"

### 3. Verify Environment Variables

After adding all variables:

1. Go to the "Deployments" tab
2. Create a new deployment by clicking "Redeploy" on your latest deployment
3. This will rebuild your project with the new environment variables

### 4. Important Notes

- Variables with the `VITE_` prefix are exposed to the client-side code
- `DEEPSEEK_API_KEY` doesn't have the `VITE_` prefix because it's only used in serverless functions and should not be exposed to the client
- Environment variables are encrypted and securely stored by Vercel

### 5. Troubleshooting

If your application can't access the environment variables:

1. **Check Variable Names**: Ensure the names match exactly (they are case-sensitive)
2. **Redeploy After Changes**: Any changes to environment variables require a new deployment
3. **Check Access Method**: Client-side code can only access variables with the `VITE_` prefix using `import.meta.env.VARIABLE_NAME`
4. **Serverless Functions**: Serverless functions access variables using `process.env.VARIABLE_NAME`

### 6. Local Development

For local development, create a `.env.local` file in your project root with the same variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
DEEPSEEK_API_KEY=your_deepseek_api_key
```

This file should not be committed to your repository (it's already in `.gitignore`).
