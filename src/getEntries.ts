// src/getEntries.ts

import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

/**
 * Fetch all journal entries for a specific user from Firestore.
 * @param userId - The authenticated user's ID.
 * @returns Array of entry objects with id, content, poem, created_at, and userId, sorted by date (newest first).
 */
export async function getEntries(userId: string) {
  try {
    // Try to get entries with sorting (requires index)
    const q = query(
      collection(db, 'entries'),
      where('userId', '==', userId),
      orderBy('created_at', 'desc') // Sort by date, newest first
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    // Fallback to unsorted query if index doesn't exist
    console.warn('Using fallback query without sorting. Please create the required index in Firebase console.');
    const q = query(
      collection(db, 'entries'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);

    // Sort the results in memory instead
    const entries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by created_at in descending order (newest first)
    return entries.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  }
}
