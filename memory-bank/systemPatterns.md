# System Patterns

## System Architecture

- **Frontend:** Built with React (Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, React Router).
- **Backend:** Firebase (Firestore for data storage, Firebase Auth for authentication; Supabase is no longer used).
- **AI Services:** OpenAI GPT-4o-mini for speech-to-text (real voice-to-text transcription now live), GPT-4.1-mini for entry enhancement and poetry generation.
- **Voice Recording:** RecordRTC for capturing audio, integrated with OpenAI transcription. Voice entries (via the microphone button in EntriesList) are now transcribed, saved to Firestore, and behave like manual entries.

## Secure AI API Integration

- All sensitive AI API calls (DeepSeek) are handled server-side via Express backend
- Vite proxy is used for seamless local development
- Robust error handling on both frontend and backend
- System prompt ensures non-rhyming, reflective poetry
- Personalized poem presentation with Gorlea signature
- Removed "AI-Generated Poem" label for a more personal experience

## Key Technical Decisions

- **Simple State Management:** Uses React's `useState` for local state; may consider more advanced solutions as complexity grows.
- **Component-Driven UI:** Core features are encapsulated in modular components (EntriesList, NewEntryModal, NewEntry).
- **Collapsible Entry Cards:** Entries are displayed in collapsible cards for clarity and organization.
- **Floating Action Buttons:** Used for quick access to new entry creation.
- **Responsive Design:** Tailwind CSS ensures the UI adapts to all screen sizes.
- **Authentication:** Google Sign-In via Firebase Auth for secure, user-friendly login. All authentication and user state is managed via Firebase; Supabase has been fully removed.
- **User Data Scoping:** All Firestore entry operations (save, fetch) are scoped to the authenticated user's `uid`.
- **Logout Accessibility:** A "Log Out" button is always available in the FilterDrawer for authenticated users.
- **Toast Placement:** Toast notifications are positioned in the top-right to avoid UI overlap.

## Design Patterns

- **Separation of Concerns:** UI, data handling, and AI integrations are separated into distinct components and modules.
- **Integration Points:** Clear boundaries between frontend, backend, and AI services.
- **Feedback Loops:** Real-time notifications and visual cues (Sonner) for user actions, always positioned for unobstructed access.
- **Voice Note Handling:** Voice notes are now fully transcribed using OpenAI and saved to Firestore as real entries.

## Component Relationships

- **EntriesList.tsx:** Displays all journal entries for the authenticated user, triggers new entry creation. The microphone button captures real voice entries, transcribes them using OpenAI, persists them to Firestore, and refreshes the list. Poems are displayed with a personal Gorlea signature.
- **NewEntryModal.tsx:** Handles text entry creation with validation and feedback.
- **NewEntry.tsx:** Manages both text and voice input, integrates with AI for transcription and poetry. Includes a preview of how Gorlea will respond to journal entries.
- **FilterDrawer.tsx:** Provides filter options and a persistent "Log Out" button for authenticated users.
- **UI Components:** Shared components (from shadcn/ui) provide consistent styling and behavior across the app.

## Integration Overview

- **Firestore:** Stores entries, poems, timestamps, and user IDs. All queries are filtered by the authenticated user's `uid`. Voice entries are transcribed and saved identically to manual entries.
- **OpenAI:** Handles speech-to-text transcription for voice entries.
- **DeepSeek:** Generates personalized poetry based on journal entries through a secure Express backend.
- **RecordRTC:** Captures audio for voice entries.

## Environment & Data Patterns

- **Environment Variables:** Sensitive credentials (Firebase, OpenAI) are managed via a `.env` file and accessed in code through Vite's import.meta.env. `.env` is excluded from version control via `.gitignore`.
- **Data Abstraction:** The `saveEntry` function in `src/saveEntry.ts` abstracts Firestore writes, ensuring all entries include content, poem, created_at, and userId fields. The `getEntries` function in `src/getEntries.ts` abstracts Firestore reads and is used to refresh UI state after saving, always filtered by userId.
- **Security:** Firestore security rules are set and published in the Firebase Console, and will be updated to restrict access to each user's own entries based on `request.auth.uid`.

This architecture supports modularity, scalability, and a seamless user experience.
