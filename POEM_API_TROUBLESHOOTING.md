# Poem Generation API Troubleshooting Guide

This guide will help you troubleshoot issues with the poem generation API in Gorlea's Ink.

## Recent Changes Made

1. Updated `vercel.json` to include proper build configuration for API routes
2. Fixed environment variable references in API files:
   - Changed from `process.env.VITE_DEEPSEEK_API_KEY` to `process.env.DEEPSEEK_API_KEY`
3. Added debug endpoints to help diagnose issues

## Verifying Your Vercel Environment Variables

The most common cause of API failures is incorrect environment variables. Please follow these steps:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on "Settings" in the top navigation
4. Select "Environment Variables" from the left sidebar
5. Verify that you have a `DEEPSEEK_API_KEY` variable (without the VITE_ prefix)
6. If it doesn't exist, add it:
   - Click "Add New"
   - Enter `DEEPSEEK_API_KEY` as the name
   - Enter your DeepSeek API key as the value
   - Select all environments (Production, Preview, Development)
   - Click "Save"
7. After adding or updating environment variables, redeploy your application:
   - Go to the "Deployments" tab
   - Click "Redeploy" on your latest deployment

## Testing the API

I've added a test page to help diagnose issues. After redeploying, follow these steps:

1. Visit `https://your-vercel-url.vercel.app/test.html`
2. Click the "Debug Info" button to see if your environment variables are set correctly
   - Look for `DEEPSEEK_API_KEY_EXISTS: true` in the response
3. Click the "Test API" button to verify that basic API functionality works
4. Click the "Generate Poem" button to test the poem generation API

## Common Issues and Solutions

### 1. 500 Internal Server Error

If you get a 500 error when generating a poem, it could be due to:

- **Missing API Key**: Ensure `DEEPSEEK_API_KEY` is set in Vercel
- **Invalid API Key**: Verify your DeepSeek API key is correct
- **DeepSeek API Limits**: Check if you've exceeded your API usage limits
- **Network Issues**: DeepSeek API might be temporarily unavailable

### 2. 404 Not Found Error

If you get a 404 error when accessing the API endpoint:

- **Deployment Issue**: Ensure your API files are properly deployed
- **Path Issue**: Verify the API endpoint path is correct
- **Vercel Configuration**: Check your `vercel.json` configuration

### 3. CORS Errors

If you see CORS errors in the console:

- This is unlikely with Vercel's default configuration
- If it occurs, you may need to add CORS headers to your API responses

## Next Steps

If you're still experiencing issues after following these steps:

1. Check the Vercel function logs for detailed error messages:
   - Go to your Vercel dashboard
   - Select your project
   - Click on "Logs" in the top navigation
   - Filter for "Function Logs" to see API-related errors

2. Try a different API key or create a new one if possible

3. Consider temporarily using a different AI service for testing purposes

## Contact Support

If you continue to experience issues, please provide:

1. Screenshots of any error messages
2. The output from the debug endpoint
3. Your Vercel deployment URL

This will help us diagnose and resolve the issue more quickly.
