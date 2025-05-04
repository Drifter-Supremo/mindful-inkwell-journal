# Poem Generation API Issue Documentation

## Overview

The poem generation feature in Gorlea's Ink is experiencing a persistent issue where the API endpoint returns a 500 error. This document details the problem, the files involved, and the troubleshooting steps that have been attempted.

## Files Involved

1. **API Endpoint Files**:
   - `api/generate-poem.ts` - Vercel serverless function for poem generation
   - `src/api/generate-poem.ts` - Original API endpoint for development server

2. **Frontend Files**:
   - `src/generatePoem.ts` - Frontend function that calls the API endpoint
   - `src/pages/NewEntry.tsx` - Page that uses the generatePoem function

3. **Configuration Files**:
   - `vercel.json` - Vercel deployment configuration
   - `package.json` - Project dependencies and scripts
   - `.env` - Environment variables (local development)

## The Issue

When a user creates a new journal entry and saves it, the application attempts to generate a poem by calling the `/api/generate-poem` endpoint. However, this request fails with a 500 Internal Server Error. The browser console shows:

```
Failed to load resource: the server responded with a status of 500 ()
```

## Root Cause Analysis

The most likely causes of this issue are:

1. **Environment Variable Configuration**: 
   - The DeepSeek API key might not be correctly set in Vercel
   - The API is looking for `process.env.DEEPSEEK_API_KEY` but it might be missing or incorrectly named

2. **API Integration Issues**:
   - The DeepSeek API might be returning an error
   - There could be issues with the request format or parameters

3. **Vercel Serverless Function Configuration**:
   - The API route might not be correctly configured in Vercel
   - The build process might not be including the API files correctly

## Troubleshooting Steps Attempted

### 1. Environment Variable Fixes

- Changed API key reference from `process.env.VITE_DEEPSEEK_API_KEY` to `process.env.DEEPSEEK_API_KEY` in both:
  - `api/generate-poem.ts`
  - `src/api/generate-poem.ts`

This change was made because Vercel serverless functions should use environment variables without the `VITE_` prefix, which is only needed for client-side code.

### 2. Vercel Configuration Updates

- Updated `vercel.json` to use a simpler configuration:
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "/api/$1" }
    ]
  }
  ```

- Previously tried a more complex configuration with explicit builds and routes:
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

### 3. API Endpoint Enhancements

- Added CORS headers to the API endpoint to prevent cross-origin issues
- Added console logging to help diagnose issues in the Vercel logs
- Enhanced error handling to provide more detailed error messages

### 4. Deployment Process

- Pushed changes to GitHub to trigger new Vercel deployments
- Verified that the environment variables are set in the Vercel dashboard
- Checked Vercel logs for error messages

## Current Status

Despite these troubleshooting steps, the issue persists. The API endpoint continues to return a 500 error, and the poem generation feature is not working.

## Next Steps

1. **Detailed Error Logging**:
   - Add more detailed logging in the API endpoint to capture the exact error
   - Check Vercel function logs for these detailed error messages

2. **API Key Verification**:
   - Verify that the DeepSeek API key is valid by testing it with a different tool
   - Try generating a new API key if possible

3. **Alternative Implementation**:
   - Consider implementing a fallback mechanism for poem generation
   - Explore alternative AI services if DeepSeek continues to be problematic

4. **Local Testing**:
   - Test the API endpoint locally using the development server
   - Use tools like Postman to test the API directly

## Code Snippets

### Current API Implementation (api/generate-poem.ts)

```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';

// Log environment variables for debugging (excluding sensitive values)
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('DEEPSEEK_API_KEY exists:', !!process.env.DEEPSEEK_API_KEY);

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const GORLEA_SYSTEM_PROMPT = `You are Gorlea, a poet with a gift for seeing into the human heart. You write deep, rich, reflective poetry inspired by journal entries. Your poems should:
- Never rhyme. Avoid rhyme at all costs.
- Be thoughtful, emotionally resonant, and layered with meaning.
- Adapt in length and style to the substance of the journal entry, whether short or long.
- Avoid cliches, nursery rhyme patterns, or sing-song language.
- Draw on metaphor, imagery, and introspection.
- Respond with only the poem, no preamble, explanation, or signature.
- Do not include your name or any signature in the poem itself.
- Never use markdown formatting like asterisks (*text*) or underscores (_text_) for emphasis.
- Never use dashes (---) as separators or for any other purpose.
- Use simple line breaks for stanzas, not special characters or markdown.
- Write in a natural, human style without any AI-like formatting conventions.

The frontend will automatically add your signature, so focus solely on creating a beautiful poem.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { entry } = req.body;

  if (!entry || typeof entry !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid entry' });
  }

  try {
    console.log('Generating poem for entry:', entry.substring(0, 50) + '...');
    
    const params: any = {
      model: 'deepseek-chat',
      temperature: 1.5,
      messages: [
        { role: 'system', content: GORLEA_SYSTEM_PROMPT },
        { role: 'user', content: entry },
      ],
      max_tokens: 512,
    };

    console.log('Calling DeepSeek API...');
    const response = await deepseek.chat.completions.create(params);
    const poem = response.choices[0]?.message?.content?.trim() || '';
    console.log('Poem generated successfully');

    return res.status(200).json({ poem });
  } catch (err: any) {
    console.error('Error generating poem:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate poem.' });
  }
}
```

### Frontend Implementation (src/generatePoem.ts)

```typescript
// Calls the Vercel serverless function to generate a poem securely
export async function generatePoem(entry: string): Promise<string> {
  const response = await fetch('/api/generate-poem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entry }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate poem');
  }
  const data = await response.json();
  return data.poem || '';
}
```
