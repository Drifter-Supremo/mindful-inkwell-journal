# Tech Context

## Technologies Used

- **Frontend**
  - React (with Vite)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Lucide React (icons)
  - React Router
- **Backend**
  - Firebase (Firestore, Firebase Auth; Supabase previously used for auth, now fully removed)
  - Vercel Serverless Functions (API endpoints)
- **AI Services**
  - OpenAI GPT-4o-mini (real-time speech-to-text, fully integrated)
  - DeepSeek API (poetry generation)
- **Other Libraries**
  - RecordRTC (voice recording)
  - date-fns (date utilities for formatting and filtering)
  - Sonner (toast notifications)

## Development Setup

- Uses Vite for fast development and build tooling.
- TypeScript for type safety and maintainability.
- Tailwind CSS for utility-first, responsive styling.
- shadcn/ui for reusable, accessible UI components.
- Lucide React for iconography.
- React Router for client-side routing.
- Firebase for backend services (authentication and data storage; all authentication and user state is managed via Firebase Auth with email/password authentication; Google sign-in has been replaced). Password reset functionality includes a user-friendly success state with clear feedback.
- OpenAI APIs for AI-powered features.
- Environment variables are used for API keys and sensitive configuration:
  - In development: stored in a `.env` file excluded from git via `.gitignore`
  - In production: configured in the Vercel dashboard
- `src/config.ts` loads credentials from environment variables.
- `src/saveEntry.ts` abstracts Firestore writes for journal entries.
- `src/getEntries.ts` abstracts Firestore reads for fetching journal entries.
- `src/lib/dateFilters.ts` provides date range filtering functionality using date-fns.
- `EntriesList.tsx`, `NewEntryModal.tsx`, and `NewEntry.tsx` are integrated with Firestore for real data, always scoped to the authenticated user's `uid`. Voice entries are now transcribed in real time using OpenAI and saved as text entries.
- `FilterDrawer.tsx` provides date-based filtering options with consistent UI behavior.
- `api/generate-poem.ts` provides serverless function for poem generation using DeepSeek API.
- Deployment configured for Vercel with serverless functions for API endpoints.

## Technical Constraints

- All sensitive keys (DeepSeek API, Firebase) must be stored in environment variables, not committed to the repository.
- All authentication and data access is handled by Firebase Auth (email/password authentication) and Firestore, with all entry operations scoped to the authenticated user's `uid`.
- The app must remain responsive and accessible across devices.
- AI features depend on external API availability and rate limits.
- Date filtering relies on date-fns library for consistent date handling across browsers.
- Initial state management is local (React useState); may evolve as complexity increases.
- Serverless functions must be stateless and follow Vercel's deployment model.
- API routes must be properly configured in vercel.json for correct routing.

## Dependencies

- See package.json for a complete list of dependencies and versions.
- Key dependencies: react, react-dom, vite, typescript, tailwindcss, shadcn/ui, lucide-react, firebase, openai, recordrtc, date-fns, sonner, framer-motion.
- Development dependencies: @vercel/node for Vercel serverless function types.

This context ensures a clear understanding of the technical foundation and constraints for ongoing development.
