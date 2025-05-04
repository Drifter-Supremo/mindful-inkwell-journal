# Vercel Deployment Troubleshooting Guide

This guide addresses common issues when deploying Gorlea's Ink to Vercel.

## Common Issues and Solutions

### 1. API Endpoint 404 Errors

**Issue**: The `/api/generate-poem` endpoint returns a 404 error.

**Solutions**:

- **Check Environment Variables**: Ensure `DEEPSEEK_API_KEY` is correctly set in Vercel's environment variables.
  - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
  - Add or verify `DEEPSEEK_API_KEY` with your DeepSeek API key

- **Verify API Files**: Make sure the `api/generate-poem.ts` file is properly deployed.
  - The file should be in the root `api` directory, not inside `src/api`

- **Check Vercel Configuration**: Verify your `vercel.json` has the correct configuration:
  ```json
  {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/static-build",
        "config": {
          "distDir": "dist"
        }
      },
      {
        "src": "api/**/*.ts",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/api/$1"
      },
      {
        "src": "/(.*)",
        "dest": "/index.html"
      }
    ]
  }
  ```

### 2. TypeScript Errors During Build

**Issue**: TypeScript errors prevent successful deployment.

**Solutions**:

- **Type Annotations**: Add proper type annotations to resolve TypeScript errors:
  - In `api/generate-poem.ts`, use `const params: any = { ... }` to avoid type errors

- **Update Dependencies**: Make sure `@vercel/node` is installed as a dev dependency:
  ```bash
  npm install --save-dev @vercel/node
  ```

### 3. MIME Type Errors

**Issue**: Browser console shows MIME type errors for JavaScript files.

**Solutions**:

- **Check Build Output**: Ensure the build process is generating the correct files
  - Run `npm run build` locally to verify the build works
  - Check the `dist` directory for the expected output files

- **Verify Routes**: Make sure the Vercel routes are correctly configured to serve static assets

### 4. Message Port Closure Errors

**Issue**: Browser console shows "message port closed before a response was received" errors.

**Solutions**:

- **Check for Race Conditions**: This often happens when a component unmounts before an async operation completes
  - Add proper cleanup in useEffect hooks
  - Use AbortController for fetch requests

### 5. Deployment Fails with "No Framework Detected"

**Issue**: Vercel fails to detect the framework or build configuration.

**Solutions**:

- **Specify Framework**: In the Vercel dashboard, manually select "Vite" as the framework
- **Check package.json**: Ensure it has the correct build commands:
  ```json
  "scripts": {
    "build": "vite build",
    "vercel-build": "vite build"
  }
  ```

## Redeploying After Fixes

After making any changes:

1. Commit and push your changes to GitHub
2. Vercel will automatically start a new deployment
3. Monitor the deployment logs for any new issues
4. Test the application thoroughly after deployment

## Getting Additional Help

If you continue to experience issues:

1. Check the Vercel deployment logs for specific error messages
2. Review the Vercel documentation for serverless functions
3. Inspect the browser console for client-side errors
4. Consider reaching out to Vercel support for persistent deployment issues
