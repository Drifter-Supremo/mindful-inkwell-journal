# Active Context

## Current Work Focus

- Firebase Authentication (Google sign-in) is fully integrated.
- All Supabase authentication code and configuration have been removed.
- Firestore data functions and UI integration for journal entries are complete and securely scoped to the authenticated user.
- Real voice-to-text transcription using OpenAI (via the microphone button in EntriesList) is now fully integrated, with transcribed entries saved to Firestore and persisting after refresh, matching manual entry persistence.
- Documentation and checklist are kept up to date as development continues.

## Recent Changes

- Migrated authentication from Supabase to Firebase Auth (Google sign-in).
- Removed all Supabase-related code and configuration.
- Updated `AuthContext` to use Firebase Auth and provide user state.
- Updated `Auth.tsx` to use Google sign-in via Firebase.
- Updated `EntriesList.tsx` and `NewEntry.tsx` to use the authenticated Firebase userId for all entry operations.
- Updated `getEntries` to filter by userId.
- Added a "Log Out" button to the FilterDrawer with improved styling for visibility.
- Moved toast notifications to the top-right corner to prevent overlap with UI controls.
- Real voice-to-text transcription is now live: voice notes are transcribed using OpenAI, saved to Firestore, and persist after refresh, just like manual entries.
- All authentication and UI/UX issues resolved.
- Marked all Phase 3 authentication tasks as complete in tasks.md.
- DeepSeek poetry generation live (backend API, Vite proxy, error handling)

## Next Steps

- Continue testing and refining the OpenAI voice-to-text transcription integration as needed.
- Continue updating documentation as new features are developed or changes occur.
- Testing and quality review of DeepSeek poetry generation.

## Active Decisions and Considerations

- All credentials are managed via environment variables and excluded from version control.
- Firestore collections are created automatically on first write.
- Firestore security rules will be updated to restrict access to authenticated users and their own entries.
- Placeholder voice notes are not persisted until full voice-to-text and saving are implemented.
- UI/UX improvements are prioritized for accessibility and usability.
- Memory Bank documentation will be updated after each significant change or upon user request.
