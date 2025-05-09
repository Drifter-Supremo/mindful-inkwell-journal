# TASKS.md — Mindful Inkwell Journal (MVP Edition)

A weekend project to create a journal app with voice-to-text and AI-generated poems, using Firebase and OpenAI, deployed on GitHub Pages.

---

## 🔧 PHASE 0: CLONE REPO AND LOCAL SETUP

### 0.1 Clone the Repository
- [x] Open your terminal (e.g., Terminal on macOS/Linux, Command Prompt/PowerShell on Windows).
- [x] Run the following command to clone the repository:
  ```bash
  git clone https://github.com/Drifter-Supremo/mindful-inkwell-journal.git
  ```
- [x] Navigate into the project directory:
  ```bash
  cd mindful-inkwell-journal
  ```

### 0.2 Install Node.js and npm (if not already installed)
- [x] Check if Node.js is installed by running:
  ```bash
  node -v
  ```
- [x] If not installed, download and install it from [nodejs.org](https://nodejs.org/). (npm comes with Node.js.)
- [x] Verify npm installation:
  ```bash
  npm -v
  ```

### 0.3 Install Project Dependencies
- [x] Install all required dependencies listed in `package.json`:
  ```bash
  npm install
  ```
- [x] Install additional dependencies for Firebase, OpenAI, and RecordRTC:
  ```bash
  npm install firebase openai recordrtc
  ```

### 0.4 Verify Setup
- [x] Run the development server to ensure everything is working:
  ```bash
  npm run dev
  ```
- [x] Open your browser and go to `http://localhost:5173` (or the port specified in the terminal) to confirm the app loads.

---

## 🔧 PHASE 1: PROJECT SETUP AND CONFIGURATION

### 1.1 Initialize Project
- [x] Verify the Vite + React project is set up correctly in the cloned repo (`mindful-inkwell-journal`).
- [x] Check that all dependencies (`firebase`, `openai`, `recordrtc`) are listed in `package.json` and installed in `node_modules`.

### 1.2 Set Up Configuration
- [x] Create a `config.ts` file in the `src` directory:
  ```typescript
  export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  export const openaiApiKey = "YOUR_OPENAI_API_KEY";
  ```
- [x] Sign up/log in to [Firebase](https://firebase.google.com/) and create a new project.
- [x] Copy your Firebase project credentials into `firebaseConfig`.
- [x] Sign up at [OpenAI](https://platform.openai.com/) and generate an API key, then add it to `openaiApiKey`.
- [x] Commit this file for now (secure it later with environment variables).

---

## 🗄️ PHASE 2: FIREBASE INTEGRATION FOR JOURNAL ENTRIES

### 2.1 Set Up Firebase Project
- [x] In the Firebase Console, go to your project and enable Firestore:
  - [x] Click "Firestore Database" > "Create Database" > Select "Start in test mode" > Choose a region > Click "Enable".
- [x] Set basic security rules in the "Rules" tab:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```
- [x] Click "Publish" to save the rules.

### 2.2 Create Firestore Collection
- [x] In your code, initialize Firebase in `main.tsx` or a similar entry file:
  ```typescript
  import { initializeApp } from 'firebase/app';
  import { getFirestore } from 'firebase/firestore';
  import { firebaseConfig } from './config';

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  ```
- [x] Create a collection named `entries` with this schema:
  - `id`: string (auto-generated by Firestore)
  - `content`: string (journal text)
  - `poem`: string (AI-generated poem)
  - `created_at`: timestamp (date of entry)
  - `userId`: string (added later with authentication)

### 2.3 Data Functions
- [x] Write a function to save an entry to Firestore in a `firebase.ts` file:
  ```typescript
  import { db } from './main';
  import { collection, addDoc } from 'firebase/firestore';

  export async function saveEntry(content: string, poem: string) {
    const entry = {
      content,
      poem,
      created_at: new Date().toISOString(),
    };
    await addDoc(collection(db, 'entries'), entry);
  }
  ```
- [x] Write a function to fetch entries:
  ```typescript
  import { collection, getDocs } from 'firebase/firestore';

  export async function getEntries() {
    const querySnapshot = await getDocs(collection(db, 'entries'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  ```
- [x] Update `EntriesList.tsx` to fetch and display Firestore data:
  ```typescript
  import { getEntries } from '../firebase';

  const [entries, setEntries] = useState([]);
  useEffect(() => {
    getEntries().then(setEntries);
  }, []);
  ```
- [x] Update `NewEntryModal.tsx` and `NewEntry.tsx` to save to Firestore:
  ```typescript
  import { saveEntry } from '../firebase';

  const handleSave = async (content: string, poem: string) => {
    await saveEntry(content, poem);
  };
  ```

---

## 🔐 PHASE 3: FIREBASE AUTHENTICATION WITH GOOGLE SIGN-IN

### 3.1 Enable Authentication
- [x] In the Firebase Console, go to "Authentication" > "Sign-in method".
- [x] Enable "Google" as a sign-in provider and configure it (add your OAuth credentials if prompted).

### 3.2 Add Google Sign-In Button
- [x] Create or update a login component (e.g., `Login.tsx`):
  ```typescript
  import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

  const provider = new GoogleAuthProvider();
  const handleLogin = async () => {
    const auth = getAuth();
    await signInWithPopup(auth, provider);
  };

  return <button onClick={handleLogin}>Sign in with Google</button>;
  ```
- [x] Add Firebase Auth initialization to `main.tsx`:
  ```typescript
  import { getAuth } from 'firebase/auth';

  export const auth = getAuth(app);
  ```

### 3.3 Handle User State
- [x] Add user state management in your app (e.g., in `App.tsx`):
  ```typescript
  import { onAuthStateChanged } from 'firebase/auth';
  import { auth } from './main';

  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => setUser(user));
  }, []);
  ```
- [x] Update `saveEntry` to include `userId`:
  ```typescript
  export async function saveEntry(content: string, poem: string, userId: string) {
    const entry = {
      content,
      poem,
      created_at: new Date().toISOString(),
      userId,
    };
    await addDoc(collection(db, 'entries'), entry);
  }
  ```
- [x] Filter entries by `userId` in `getEntries`:
  ```typescript
  import { query, where } from 'firebase/firestore';

  export async function getEntries(userId: string) {
    const q = query(collection(db, 'entries'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  ```

### 3.4 Secure Firestore Rules
- [x] Update Firestore security rules to restrict access:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /entries/{entryId} {
        allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      }
    }
  }
  ```
- [x] Publish the updated rules in the Firebase Console.

---

## 🎤 PHASE 4: IMPLEMENT VOICE RECORDING

### 4.1 Voice Recording
- [x] Simulate voice entry creation via the microphone button in `EntriesList.tsx` (no real audio yet).
- [x] Save simulated voice entries to Firestore and ensure they persist after refresh, matching manual entries.
- [x] Provide UI feedback for recording, transcription, and save.
- [x] Integrate real voice-to-text transcription using OpenAI (Live and tested!)

---

## 🗣️ PHASE 5: INTEGRATE OPENAI'S SPEECH-TO-TEXT

### 5.1 Transcription
- [x] Send audio blob to OpenAI in `NewEntry.tsx`:
  ```typescript
  import { Configuration, OpenAIApi } from 'openai';
  import { openaiApiKey } from '../config';

  const configuration = new Configuration({ apiKey: openaiApiKey });
  const openai = new OpenAIApi(configuration);

  const transcribeAudio = async (blob: Blob) => {
    const file = new File([blob], 'audio.wav', { type: 'audio/wav' });
    const response = await openai.createTranscription(file, 'whisper-1');
    return response.data.text;
  };

  const stopRecording = () => {
    recorder?.stopRecording(async () => {
      const blob = recorder?.getBlob();
      const text = await transcribeAudio(blob);
      setContent(text); // Assuming content state exists
    });
  };
  ```
- [x] Add a loading state:
  ```typescript
  const [isLoading, setIsLoading] = useState(false);
  const stopRecording = async () => {
    setIsLoading(true);
    recorder?.stopRecording(async () => {
      const blob = recorder?.getBlob();
      const text = await transcribeAudio(blob);
      setContent(text);
      setIsLoading(false);
    });
  };
  ```

---

## ✍️ PHASE 6: INTEGRATE DEEPSEEK API FOR POEM GENERATION

### 6.1 Poem Generation
- [x] Generate a poem when saving an entry using DeepSeek API:
  ```typescript
  // Calls the backend API route to generate a poem securely
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

  const handleSave = async () => {
    const poem = await generatePoem(content);
    await saveEntry(content, poem, auth.currentUser?.uid);
  };
  ```
- [x] Display the poem in `EntriesList.tsx` with a personal touch:
  ```typescript
  {isExpanded && entry.poem && (
    <div className="mt-4 pt-4 border-t border-primary/20 animate-fade-in">
      <p className="text-primary-foreground/90 italic whitespace-pre-wrap">
        {entry.poem}
        {entry.poem && (
          <span className="block text-right text-accent/80 text-sm mt-2">~ Gorlea</span>
        )}
      </p>
    </div>
  )}
  ```

---

## 🌐 PHASE 7: DEPLOYMENT ON VERCEL

### 7.1 Prepare for Vercel Deployment
- [x] Create a Vercel configuration file (vercel.json):
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
- [x] Add a vercel-build script to package.json:
  ```json
  "scripts": {
    "vercel-build": "vite build"
  }
  ```
- [x] Create serverless API function for poem generation:
  ```typescript
  // api/generate-poem.ts
  import { VercelRequest, VercelResponse } from '@vercel/node';
  import { OpenAI } from 'openai';

  export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Poem generation logic
  }
  ```
- [x] Install Vercel Node.js types:
  ```bash
  npm install --save-dev @vercel/node
  ```
- [x] Create environment variable documentation (.env.example)
- [x] Create deployment guide (DEPLOYMENT.md)

### 7.2 Deploy to Vercel
- [x] Push changes to GitHub repository
- [x] Connect repository to Vercel
- [x] Configure environment variables in Vercel dashboard
- [x] Deploy the application
- [x] Verify the app at the Vercel-provided URL

---

## 🧼 PHASE 8: TESTING AND BUG FIXES

### 8.1 Test Features
- [x] Test manual text entry creation and display.
- [x] Test voice recording and transcription.
- [x] Integrate DeepSeek API for poetry generation and display.
- [x] Personalize poem display with Gorlea signature.
- [x] Implement chronological sorting of entries with newest first.
- [x] Add smart date formatting (relative for recent entries, date format for older entries).
- [x] Verify Google Sign-In and data security.
- [x] Implement and test search functionality with mobile responsiveness improvements.
- [x] Test mobile UI improvements (button spacing, animations).
- [x] Verify poem formatting is natural and human-like.
- [x] Test serverless function for poem generation locally.
- [x] Check deployed site functionality on Vercel.

### 8.2 Fix Issues
- [x] Debug and resolve any errors encountered.

---

## ✅ PHASE 9: DONE WHEN…

- [x] Text and voice entries save to Firestore with `userId`.
- [x] Voice recordings transcribe correctly.
- [x] Poems generate and display with entries with personal Gorlea signature.
- [x] Google Sign-In authentication works.
- [x] Mobile UI is optimized with proper spacing and animations.
- [x] Poem formatting is natural and human-like (no markdown or dashes).
- [x] Vercel deployment configuration is complete.
- [x] App runs smoothly on Vercel.

---

**MVP Status:** Ready for Deployment
**Lead Developer:** Drifter-Supremo
**Start Date:** April 2024
**Target Completion:** May 2024
