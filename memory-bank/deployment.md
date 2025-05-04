# Deployment Guide for Gorlea's Ink

This document outlines the deployment process and configuration for Gorlea's Ink journal application.

## Deployment Platform

Gorlea's Ink is designed to be deployed on [Vercel](https://vercel.com), a cloud platform for static sites and serverless functions.

## Application Architecture

The application consists of:

1. **Frontend**: React application built with Vite
2. **Backend**: Serverless functions for API endpoints
3. **Database**: Firebase Firestore for storing journal entries
4. **Authentication**: Firebase Authentication for user login
5. **External API**: DeepSeek API for poem generation

## Deployment Configuration

### Vercel Configuration

The `vercel.json` file configures how the application is built and deployed on Vercel:

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

This configuration:
- Builds the frontend using the Vite build process
- Deploys API routes as serverless functions
- Routes API requests to the appropriate functions
- Routes all other requests to the single-page application

### Environment Variables

The following environment variables are required:

#### Frontend Variables (with VITE_ prefix)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

#### Backend Variables
- `DEEPSEEK_API_KEY` - For poem generation via the DeepSeek API

### API Routes

The application uses serverless functions for API endpoints:

- `/api/generate-poem` - Generates a poem based on a journal entry using DeepSeek API

## Deployment Process

1. Push code to a Git repository
2. Connect the repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy the application

## Development vs. Production

### Development Environment
- Uses separate frontend (Vite) and backend (Express) servers
- Run with `npm run dev:full` command
- Environment variables loaded from local `.env` file

### Production Environment
- Single unified deployment on Vercel
- Frontend and API routes deployed together
- Environment variables configured in Vercel dashboard

## Monitoring and Maintenance

- Monitor API usage and limits for DeepSeek
- Check Firebase console for authentication and database usage
- Review Vercel logs for deployment and runtime issues

## Updating the Deployment

To update the deployed application:
1. Push changes to the connected Git repository
2. Vercel will automatically detect changes and redeploy
3. Monitor deployment logs for any issues
