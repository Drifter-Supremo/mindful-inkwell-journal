// src/saveEntry.ts

import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Save a journal entry to Firestore.
 * @param content - The journal text.
 * @param poem - The AI-generated poem.
 * @param userId - The authenticated user's ID.
 */
export async function saveEntry(content: string, poem: string, userId: string) {
  const entry = {
    content,
    poem,
    created_at: new Date().toISOString(),
    userId,
  };
  await addDoc(collection(db, 'entries'), entry);
}
