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
  - Firebase (Firestore, Firebase Auth)
- **AI Services**
  - OpenAI GPT-4o-mini (speech-to-text)
  - OpenAI GPT-4.1-mini (entry enhancement, poetry generation)
- **Other Libraries**
  - RecordRTC (voice recording)
  - date-fns (date utilities)
  - Sonner (toast notifications)

## Development Setup

- Uses Vite for fast development and build tooling.
- TypeScript for type safety and maintainability.
- Tailwind CSS for utility-first, responsive styling.
- shadcn/ui for reusable, accessible UI components.
- Lucide React for iconography.
- React Router for client-side routing.
- Firebase for backend services (authentication and data storage).
- OpenAI APIs for AI-powered features.
- Environment variables are used for API keys and sensitive configuration, stored in a `.env` file excluded from git via `.gitignore`.
- `src/config.ts` loads credentials from environment variables.
- `src/saveEntry.ts` abstracts Firestore writes for journal entries.
- `src/getEntries.ts` abstracts Firestore reads for fetching journal entries.
- `EntriesList.tsx`, `NewEntryModal.tsx`, and `NewEntry.tsx` are integrated with Firestore for real data.
- Hosted initially on GitHub Pages; Vercel planned for future deployment.

## Technical Constraints

- All sensitive keys (OpenAI, Firebase) must be stored in environment variables, not committed to the repository.
- The app must remain responsive and accessible across devices.
- AI features depend on external API availability and rate limits.
- Initial state management is local (React useState); may evolve as complexity increases.

## Dependencies

- See package.json for a complete list of dependencies and versions.
- Key dependencies: react, react-dom, vite, typescript, tailwindcss, shadcn/ui, lucide-react, firebase, openai, recordrtc, date-fns, sonner.

This context ensures a clear understanding of the technical foundation and constraints for ongoing development.
