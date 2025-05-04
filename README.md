
# AI Journal App - Frontend Documentation

This document provides information for developers who want to understand or extend the frontend of the AI Journal application.

## Overview

The AI Journal is a React-based web application that allows users to create journal entries either by typing or through voice recording. The application includes a feature where AI generates a poem based on the journal entry content.

## Tech Stack

### Frontend
- **React**: Frontend library for building user interfaces
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Lucide React**: Icon library
- **React Router**: Client-side routing
- **date-fns**: Date manipulation library
- **Sonner**: Toast notification system

### Backend
- **Express**: Node.js web application framework for the API server
- **Firebase**: Authentication and Firestore database for data storage
- **DeepSeek AI**: AI service for generating poetry based on journal entries
- **OpenAI**: AI service for speech-to-text transcription

## Architecture

### Main Pages

- **`/entries`**: Displays all journal entries with collapsible cards
- **`/new`**: Page for creating a new journal entry with text input and voice recording option

### Backend Services

- **Express Server**: Runs on port 3001 and provides the `/api/generate-poem` endpoint for DeepSeek AI poem generation
- **Vite Dev Server**: Runs on port 8080 and serves the React frontend

### Key Components

#### `EntriesList.tsx`
Displays all journal entries in collapsible card format. Features:
- Toggle expansion of entries
- AI-generated poem section
- Timestamp display
- Floating action buttons for new text entry and voice recording

#### `NewEntryModal.tsx`
Modal dialog for creating a new text journal entry. Features:
- Text input area
- Form validation
- Success notifications

#### `NewEntry.tsx`
Full-page interface for creating journal entries. Features:
- Text input area
- Voice recording button that works as a toggle (press to start, press again to stop)
- Visual feedback during recording
- Preview of AI-generated poem placeholder

### State Management

The application uses React's built-in state management with `useState` hooks. In a production environment, you might want to replace this with a more robust solution like React Query or Redux.

## Integration Points for Backend

### Voice Recording

The frontend currently includes UI for voice recording but uses placeholder functionality. To implement actual voice recording:

1. Replace the `toggleRecording` function in both `EntriesList.tsx` and `NewEntry.tsx` with real recording logic using the Web Audio API or a similar library
2. Implement sending the audio data to your backend for processing

### AI Processing

Two main integration points for AI:

1. **Voice-to-Text Transcription**:
   - When a voice recording is completed, the audio file is sent to OpenAI's API
   - OpenAI's GPT-4o-mini model transcribes the audio to text
   - The transcribed text populates the journal entry

2. **Poem Generation**:
   - When a journal entry is saved, the content is sent to the `/api/generate-poem` endpoint
   - The Express server forwards the request to DeepSeek's API with the system prompt for Gorlea (the AI poet)
   - DeepSeek generates a poem based on the journal entry
   - The poem is returned and displayed alongside the journal entry

### Data Persistence

Currently, the app uses mock data stored in memory. To implement real data persistence:

1. Create API endpoints for CRUD operations on journal entries
2. Modify the state management code in `EntriesList.tsx` and other components to use these endpoints
3. Implement authentication if required

## Adding Backend Integration

To add backend integration:

1. Create an API client service (consider using Axios or Fetch API)
2. Define endpoints for:
   - Retrieving journal entries
   - Creating new text entries
   - Creating new voice entries (including audio upload)
   - Processing journal entries with AI for poem generation

3. Replace the mock data and placeholders with real API calls

## API Interface

Here's a suggested API interface structure:

```typescript
// Journal Entry Interface
interface JournalEntry {
  id: string;
  content: string;
  poem: string | null;
  created_at: string;
}

// API Endpoints
// GET /api/entries - Get all entries
// POST /api/entries - Create new text entry
// POST /api/entries/voice - Create new voice entry (multipart form)
// GET /api/entries/:id - Get specific entry
```

## Development Notes

- The app uses a dark theme with primary colors defined in `tailwind.config.ts`
- Toast notifications are used for user feedback
- Animations are applied for better user experience
- All components are designed to be responsive

## Downloading the Project

You can download all files from this project by:

1. Using the "Download" button in the Lovable interface
2. Cloning the project repository if you've connected it to GitHub
3. Using the Lovable CLI if available

## Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server only (without poem generation)
npm run dev

# Start Express server only (for poem generation API)
npm run server

# Start both servers together (recommended)
npm run dev:full
```

### Setting Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Firebase Configuration
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

Replace the placeholder values with your actual API keys.

## Deployment

The project can be deployed through the Lovable platform or to any static hosting service like Netlify, Vercel, or GitHub Pages.
