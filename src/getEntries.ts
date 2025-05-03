// src/getEntries.ts

import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Fetch all journal entries for a specific user from Firestore.
 * @param userId - The authenticated user's ID.
 * @returns Array of entry objects with id, content, poem, created_at, and userId.
 */
export async function getEntries(userId: string) {
  const q = query(collection(db, 'entries'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
