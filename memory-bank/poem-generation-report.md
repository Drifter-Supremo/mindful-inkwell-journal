# DeepSeek & Poem Generation Setup Report

This report documents all files related to DeepSeek API integration and poem generation functionality to aid in replicating the local setup on Vercel.

## Table of Contents
1. [Key Source Files](#key-source-files)
2. [API Implementation Files](#api-implementation-files)
3. [Frontend Integration](#frontend-integration)
4. [Configuration Files](#configuration-files)
5. [Documentation References](#documentation-references)
6. [Environment Variables](#environment-variables)

---

## Key Source Files

### api/generate-poem.js (Full Content)
```javascript
const OpenAI = require("openai");

module.exports = async function handler(req, res) {
  try {
    const { entry } = req.body ?? {};
    if (!entry) return res.status(400).json({ error: "missing-entry" });

    const openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY, // use DeepSeek key
      baseURL: "https://api.deepseek.com/v1"
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "Write a short poem based on the user's journal entry." },
        { role: "user", content: entry }
      ]
    });

    return res.status(200).json({ poem: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("Poem API error:", err);
    return res.status(500).json({ error: "poem-generation-failed" });
  }
};
```

### src/api/generate-poem.ts (Full Content)
```typescript
// Simple Vite serverless function for DeepSeek poem generation
import OpenAI from 'openai';

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// The system prompt for Gorlea, our AI poet
const GORLEA_SYSTEM_PROMPT = `You are Gorlea, an AI poet with a reflective, thoughtful voice. 
Create a short, evocative poem inspired by the journal entry.
The poem should:
- Be 4-8 lines long
- Have a contemplative, introspective tone
- Use vivid imagery related to the journal content
- Not use rhyming patterns (free verse)
- Capture the emotional essence of the entry
- Be original and avoid clichés

Your style is thoughtful and nuanced, focusing on emotional truth rather than formal structure.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { entry } = req.body;
  if (!entry || typeof entry !== 'string') {
    res.status(400).json({ error: 'Missing or invalid entry' });
    return;
  }
  try {
    const params = {
      model: 'deepseek-chat',
      temperature: 1.5,
      messages: [
        { role: 'system', content: GORLEA_SYSTEM_PROMPT },
        { role: 'user', content: entry },
      ] as any,
      max_tokens: 512,
    };
    const response = await deepseek.chat.completions.create(params);
    const poem = response.choices[0]?.message?.content?.trim() || '';
    res.status(200).json({ poem });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate poem.' });
  }
}
```

### src/generatePoem.ts (Full Content)
```typescript
export async function generatePoem(entry: string) {
  const response = await fetch('/api/generate-poem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entry }),
  });
  
  return await response.json();
}
```

### server.js (Lines 1-30)
```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// DeepSeek/OpenAI setup
const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.VITE_DEEPSEEK_API_KEY,
});

// Gorlea system prompt
const GORLEA_SYSTEM_PROMPT = `You are Gorlea, an AI poet with a reflective, thoughtful voice. 
Create a short, evocative poem inspired by the journal entry.
The poem should:
- Be 4-8 lines long
- Have a contemplative, introspective tone
- Use vivid imagery related to the journal content
- Not use rhyming patterns (free verse)
- Capture the emotional essence of the entry
- Be original and avoid clichés`;
```

### server.js (Lines 25-55, around generate-poem endpoint)
```javascript
const GORLEA_SYSTEM_PROMPT = `You are Gorlea, an AI poet with a reflective, thoughtful voice. 
Create a short, evocative poem inspired by the journal entry.
The poem should:
- Be 4-8 lines long
- Have a contemplative, introspective tone
- Use vivid imagery related to the journal content
- Not use rhyming patterns (free verse)
- Capture the emotional essence of the entry
- Be original and avoid clichés`;

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/generate-poem', async (req, res) => {
  const { entry } = req.body;
  if (!entry || typeof entry !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid entry' });
  }
  try {
    const params = {
      model: 'deepseek-chat',
      temperature: 1.5,
      messages: [
        { role: 'system', content: GORLEA_SYSTEM_PROMPT },
        { role: 'user', content: entry },
      ],
      max_tokens: 512,
    };
    
    const response = await deepseek.chat.completions.create(params);
    const poem = response.choices[0]?.message?.content?.trim() || '';
    
    return res.status(200).json({ poem });
  } catch (error) {
    console.error('Failed to generate poem:', error);
    return res.status(500).json({ error: 'Failed to generate poem' });
  }
});
```

### src/config.ts (Full Content)
```typescript
// src/config.ts

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

### src/components/EntriesList.tsx (Lines 110-140, around OPENAI_API_KEY usage)
```typescript
const saveRecord = async (audioURL: string) => {
  try {
    setIsTranscribing(true);
    const response = await fetch(audioURL);
    const blob = await response.blob();
    
    // Transcribe the audio using OpenAI Whisper
    const transcript = await transcribeAudio(blob);
    
    // Create a new journal entry with the transcription
    await createEntry(transcript);
    setIsTranscribing(false);
    setShowRecorder(false);
  } catch (err) {
    console.error('Error saving recording:', err);
    setIsTranscribing(false);
  }
};

// Transcribe audio blob using OpenAI Whisper
const transcribeAudio = async (blob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('file', blob, 'recording.webm');
  formData.append('model', 'gpt-4o-mini-transcribe');
  formData.append('response_format', 'text');
  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` },
    body: formData
  });
  const text = await res.text();
  return text;
};
```

## Documentation References

### VERCEL_ENV_SETUP.md (Lines 70-85, around DEEPSEEK_API_KEY)
```
## Example `.env` File Format

Here's an example of how your final `.env` file should look:

```env
# Firebase Project Settings
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"

# DeepSeek API Key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### README.md (Lines 170-190, around API keys)
```markdown
## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Config
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# OpenAI API Key
VITE_OPENAI_API_KEY=your_openai_api_key

# DeepSeek API Key
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```
```

### DEPLOYMENT.md (Lines 20-35, around environment variables)
```markdown
## Environment Variables for Vercel

When deploying to Vercel, ensure the following environment variables are set:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `DEEPSEEK_API_KEY`
- `VITE_OPENAI_API_KEY`

These can be added through the Vercel dashboard under "Settings" > "Environment Variables".
```

### VERCEL_TROUBLESHOOTING.md (Lines 1-20, around API endpoint)
```markdown
# Vercel Deployment Troubleshooting

This document contains common issues and solutions for deploying this application on Vercel.

## API Endpoints

**Issue**: The `/api/generate-poem` endpoint returns a 404 error.

**Solutions**:

- **Check Environment Variables**: Ensure `DEEPSEEK_API_KEY` is correctly set in Vercel's environment variables.
  - Check that the variable name is exactly correct
  - Add or verify `DEEPSEEK_API_KEY` with your DeepSeek API key
  - Redeploy after making changes

- **Verify API Files**: Make sure the `api/generate-poem.ts` file is properly deployed.
  - Check your repository to ensure it's committed
  - Check Vercel logs for any build errors
```

## Environment Variables

Based on the files analyzed, the following environment variables are required:

1. `DEEPSEEK_API_KEY` - Used in serverless functions for DeepSeek API access
2. `VITE_DEEPSEEK_API_KEY` - Used in development environment for DeepSeek API access
3. `VITE_OPENAI_API_KEY` - Used for OpenAI services (audio transcription)
4. Various Firebase configuration variables (not directly related to poem generation)

### Variable Usage:

- **DEEPSEEK_API_KEY**: Used in `api/generate-poem.js` and `src/api/generate-poem.ts` as `process.env.DEEPSEEK_API_KEY`
- **VITE_DEEPSEEK_API_KEY**: Used in `server.js` as `process.env.VITE_DEEPSEEK_API_KEY`
- **VITE_OPENAI_API_KEY**: Used in `src/components/EntriesList.tsx` and exposed in `src/config.ts`

### Vercel Setup Note:

When deploying to Vercel, only `DEEPSEEK_API_KEY` needs to be set as a server-side environment variable. The `VITE_` prefixed variables should be client-side variables if they're needed on the client.

---

*Report generated on: 2025-05-04*
