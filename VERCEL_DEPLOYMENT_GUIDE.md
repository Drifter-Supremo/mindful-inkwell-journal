# Vercel Deployment Guide for Gorlea's Ink

This guide provides simple steps to deploy Gorlea's Ink to Vercel and troubleshoot common issues.

## Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "Fix API environment variables and add CORS headers"
git push
```

## Step 2: Check Environment Variables in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Click "Settings" in the top navigation
4. Select "Environment Variables" from the left sidebar
5. Make sure you have a `DEEPSEEK_API_KEY` variable (without the VITE_ prefix)
6. If not, add it:
   - Click "Add New"
   - Enter `DEEPSEEK_API_KEY` as the name
   - Enter your DeepSeek API key as the value
   - Select all environments (Production, Preview, Development)
   - Click "Save"

## Step 3: Redeploy Your Application

1. In the Vercel dashboard, click on your project
2. Go to the "Deployments" tab
3. Click "Redeploy" on your latest deployment

## Step 4: Test the API

After deployment is complete:

1. Visit `https://your-vercel-url.vercel.app/api/hello`
   - This should display: `{"message":"Hello from Gorlea's Ink API!"}`
   - If this works, it means your API routes are working correctly

2. If the hello endpoint works but poem generation still doesn't:
   - Check the Vercel logs for errors (see Step 5)
   - Make sure your DeepSeek API key is correct
   - Try using a different DeepSeek API key if possible

## Step 5: Check Vercel Logs

To view logs for your API functions:

1. In the Vercel dashboard, click on your project
2. Click "Logs" in the top navigation
3. Look for logs related to the `/api/generate-poem` function
4. Check for any error messages

## Common Issues and Solutions

### Blank White Screen

If the main site shows a blank white screen:

1. Check the browser console for JavaScript errors
2. Make sure all your environment variables are set correctly
3. Try clearing your browser cache or using incognito mode

### API Errors

If you're getting API errors:

1. Make sure the `DEEPSEEK_API_KEY` environment variable is set correctly
2. Check if the DeepSeek API is working by testing with a different tool
3. Look for CORS errors in the browser console

## Need More Help?

If you're still having issues after following these steps, please provide:

1. Screenshots of any error messages from the browser console
2. The output from the Vercel function logs
3. Your Vercel deployment URL
