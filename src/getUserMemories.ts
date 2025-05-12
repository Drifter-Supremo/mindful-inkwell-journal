// src/getUserMemories.ts

import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Memory } from './components/MemoriesModal';

/**
 * Fetch a user's memories from Firestore.
 * @param userId - The authenticated user's ID.
 * @returns The user's memories or null if not found.
 */
export async function getUserMemories(userId: string): Promise<Memory | null> {
  try {
    const memoryDoc = await getDoc(doc(db, 'memories', userId));
    
    if (memoryDoc.exists()) {
      return memoryDoc.data() as Memory;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user memories:', error);
    return null;
  }
}

/**
 * Format user memories for inclusion in the poem generation prompt.
 * @param memories - The user's memories.
 * @returns A formatted string of memories for the prompt.
 */
export function formatMemoriesForPrompt(memories: Memory | null): string {
  if (!memories) {
    return '';
  }
  
  let promptText = 'USER MEMORIES (subtly incorporate these details when appropriate):\n';
  
  // Add name preference
  if (memories.namePreference) {
    promptText += `- The user prefers to be called "${memories.namePreference}"\n`;
  }
  
  // Add personal details
  if (memories.personalDetails.length > 0) {
    promptText += '\nPersonal Details:\n';
    memories.personalDetails.forEach(detail => {
      if (detail.answer.trim()) {
        promptText += `- ${detail.question}: ${detail.answer}\n`;
      }
    });
  }
  
  // Add important connections
  if (memories.importantConnections.length > 0) {
    promptText += '\nImportant Connections:\n';
    memories.importantConnections.forEach(connection => {
      if (connection.name.trim() || connection.relationship.trim() || connection.details.trim()) {
        promptText += `- ${connection.name}${connection.relationship ? ` (${connection.relationship})` : ''}: ${connection.details}\n`;
      }
    });
  }
  
  // Add freeform memories
  if (memories.freeformMemories.length > 0) {
    promptText += '\nAdditional Memories:\n';
    memories.freeformMemories.forEach(memory => {
      promptText += `- ${memory}\n`;
    });
  }
  
  return promptText;
}
