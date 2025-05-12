// Calls the Vercel serverless function to generate a poem securely
import { getUserMemories, formatMemoriesForPrompt } from './getUserMemories';

export async function generatePoem(entry: string, userId: string): Promise<string> {
  // Fetch user memories
  const memories = await getUserMemories(userId);
  const formattedMemories = formatMemoriesForPrompt(memories);

  const response = await fetch('/api/generate-poem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entry,
      memories: formattedMemories
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate poem');
  }
  const data = await response.json();
  return data.poem || '';
}
