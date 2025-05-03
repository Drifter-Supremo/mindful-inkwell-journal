// src/getEntries.ts

import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Fetch all journal entries from Firestore.
 * @returns Array of entry objects with id, content, poem, created_at, and userId.
 */
export async function getEntries() {
  const querySnapshot = await getDocs(collection(db, 'entries'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
