# System Patterns

## System Architecture

- **Frontend:** Built with React (Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, React Router).
- **Backend:** Firebase (Firestore for data storage, Firebase Auth for authentication).
- **AI Services:** OpenAI GPT-4o-mini for speech-to-text, GPT-4.1-mini for entry enhancement and poetry generation.
- **Voice Recording:** RecordRTC for capturing audio, integrated with AI transcription.

## Key Technical Decisions

- **Simple State Management:** Uses React's `useState` for local state; may consider more advanced solutions as complexity grows.
- **Component-Driven UI:** Core features are encapsulated in modular components (EntriesList, NewEntryModal, NewEntry).
- **Collapsible Entry Cards:** Entries are displayed in collapsible cards for clarity and organization.
- **Floating Action Buttons:** Used for quick access to new entry creation.
- **Responsive Design:** Tailwind CSS ensures the UI adapts to all screen sizes.
- **Authentication:** Google Sign-In via Firebase Auth for secure, user-friendly login.

## Design Patterns

- **Separation of Concerns:** UI, data handling, and AI integrations are separated into distinct components and modules.
- **Integration Points:** Clear boundaries between frontend, backend, and AI services.
- **Feedback Loops:** Real-time notifications and visual cues (Sonner) for user actions.

## Component Relationships

- **EntriesList.tsx:** Displays all journal entries, triggers new entry creation.
- **NewEntryModal.tsx:** Handles text entry creation with validation and feedback.
- **NewEntry.tsx:** Manages both text and voice input, integrates with AI for transcription and poetry.
- **UI Components:** Shared components (from shadcn/ui) provide consistent styling and behavior across the app.

## Integration Overview

- **Firestore:** Stores entries, poems, timestamps, and user IDs.
- **OpenAI:** Handles speech-to-text and text generation.
- **RecordRTC:** Captures audio for voice entries.

## Environment & Data Patterns

- **Environment Variables:** Sensitive credentials (Firebase, OpenAI) are managed via a `.env` file and accessed in code through Vite's import.meta.env. `.env` is excluded from version control via `.gitignore`.
- **Data Abstraction:** The `saveEntry` function in `src/saveEntry.ts` abstracts Firestore writes, ensuring all entries include content, poem, created_at, and userId fields.
- **Security:** Firestore security rules are set and published in the Firebase Console.

This architecture supports modularity, scalability, and a seamless user experience.
