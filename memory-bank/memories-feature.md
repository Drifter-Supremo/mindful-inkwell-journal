# Memories Feature

## Overview

The Memories feature allows users to share personal details with Gorlea, which she can subtly incorporate into the poems she generates. This creates a more personalized and intimate experience, making the poems feel tailored specifically to each user.

## Implementation Details

### Data Structure

The Memories feature uses a new Firestore collection called `memories` with documents keyed by the user's UID. Each document contains:

```typescript
interface Memory {
  userId: string;
  namePreference?: string;
  personalDetails: {
    question: string;
    answer: string;
  }[];
  importantConnections: {
    name: string;
    relationship: string;
    details: string;
  }[];
  freeformMemories: string[];
  createdAt: string;
  updatedAt: string;
}
```

### User Interface

1. **Access Point**: Users access the Memories feature through a button in the FilterDrawer component.
2. **Modal Interface**: The MemoriesModal component provides a tabbed interface with three sections:
   - **Personal**: Includes name preference and guided personal questions
   - **Connections**: Allows users to add important people, places, or things
   - **Freeform**: Provides an open text area for any additional memories

### Integration with Poem Generation

1. **Memory Retrieval**: When generating a poem, the system fetches the user's memories from Firestore.
2. **Prompt Enhancement**: The memories are formatted and appended to the system prompt.
3. **Subtle Incorporation**: The AI is instructed to subtly weave these memories into the poem in a natural way.

### Key Files

- `src/components/MemoriesModal.tsx`: The UI for adding and editing memories
- `src/getUserMemories.ts`: Functions for fetching and formatting memories
- `server.js` and `src/api/generate-poem.ts`: Updated to include memories in the system prompt

## User Experience

1. User clicks the "Memories" button in the drawer
2. Modal opens with tabs for different types of memories
3. User fills in details about themselves, important connections, and other memories
4. User saves their memories
5. When the user creates a journal entry, Gorlea subtly incorporates these memories into the generated poem

## Technical Considerations

1. **Performance**: Memories are fetched only when needed for poem generation
2. **Privacy**: Memories are stored securely in Firestore with proper user scoping
3. **Flexibility**: The system is designed to work even if no memories are provided
4. **Natural Integration**: The AI is instructed to incorporate memories only when appropriate to the journal entry's content and tone

## Future Enhancements

Potential future enhancements for the Memories feature include:

1. **Memory Categories**: Add more structured categories for different types of memories
2. **Memory Tags**: Allow users to tag memories with emotions or themes
3. **Memory Strength**: Let users indicate how important certain memories are
4. **Memory Review**: Periodically remind users to review and update their memories
5. **Memory Analytics**: Show users which memories are most frequently referenced in poems

## Implementation Notes

The Memories feature was designed to be:

1. **Simple**: Easy to understand and use
2. **Personal**: Creates a more intimate connection between the user and Gorlea
3. **Subtle**: Memories are incorporated naturally, not forced into poems
4. **Flexible**: Works with as much or as little information as the user wants to provide

The feature enhances the core value proposition of the app by making the AI-generated poems feel more personal and tailored to each user's unique life and experiences.
