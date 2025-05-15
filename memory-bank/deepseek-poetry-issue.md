# Code Audit & Issue Report: Claude 3.7 Sonnet Poetry Generation & Firebase Integration

> **Note:** This document has been updated to reflect the migration from DeepSeek to Claude 3.7 Sonnet for poetry generation.
>
> **Update (May 14, 2025):** The poetry generation issue has been resolved by migrating from DeepSeek to Claude 3.7 Sonnet. See the [claude-migration-and-ui-fixes.md](./claude-migration-and-ui-fixes.md) file for details on the implementation.

## 1. **Observed Issue**
- **Error:** `Failed to load resource: the server responded with a status of 404 (Not Found)` for `api/generate-poem`.
- **Context:** This occurs when attempting to generate poetry from a journal entry in the Mindful Inkwell app.
- **Expected:** The frontend should be able to call an API endpoint (likely `/api/generate-poem`) to generate a poem using Claude 3.7 Sonnet AI, and receive a result.
- **Actual:** The endpoint is not found (404), so poem generation fails.

## 2. **Current Setup Overview**

### **Frontend**
- Built with Vite + React, located in the project root (`src/` for source code).
- Calls `/api/generate-poem` expecting a backend API to handle poem generation requests.
- Uses Firebase for authentication and Firestore for journal entry storage.

### **Backend / Claude 3.7 Sonnet API Integration**
- An Express server (`server.js` in root) was intended to:
    - Provide a `/api/generate-poem` endpoint.
    - Proxy requests from the frontend to Anthropic's Claude 3.7 Sonnet API using a secure server-side API key (from `.env`).
    - Prevent the Anthropic API key from being exposed to the frontend.
- The backend is **not being found** by the frontend at `/api/generate-poem`.
    - Possible reasons: backend not running, not listening on the right port, not correctly proxying requests, or frontend not configured to send requests to the correct server/port.

### **Firebase**
- Used for authentication (Google sign-in) and Firestore database for storing journal entries and poems.
- Integration appears to be working (journal entries display correctly, no auth errors in screenshot).

## 3. **Root Causes for the 404 Issue**
- The Express backend (`server.js`) may not be running, or may not be set up to serve `/api/generate-poem`.
- The frontend may be sending requests to the wrong URL or port (e.g., Vite runs on 5173, backend on 3001 or similar).
- There may be a missing or misconfigured proxy (e.g., Vite config or Express not proxying requests as expected).
- After git reset, backend setup may have been lost or reverted.

## 4. **Summary of Claude 3.7 Sonnet API & Firebase Setup**

### **Claude 3.7 Sonnet API**
- Intended to be called from the backend only (never expose API key to frontend).
- API key stored in `.env` and loaded by Express backend.
- Backend endpoint `/api/generate-poem` should accept journal text, call Claude 3.7 Sonnet API, and return the generated poem.

### **Firebase**
- Handles user authentication and Firestore data storage.
- All journal entries and poems are stored per user in Firestore.
- No direct involvement with poem generation API calls.

## 5. **Recommendations (No Coding, Just Review)**
- Ensure the backend server (`server.js`) is present, up-to-date, and running.
- Confirm that `/api/generate-poem` endpoint exists and is reachable from the frontend.
- Check Vite config (proxy) if frontend and backend run on different ports.
- After any git reset, verify backend files and setup are restored as needed.

---

**This file documents the ongoing 404 issue for poetry generation, the intended DeepSeek and Firebase setup, and the likely causes. Use this as a reference for debugging and communication.**
