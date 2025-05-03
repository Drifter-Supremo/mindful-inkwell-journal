// Calls the backend API route to generate a poem securely
export async function generatePoem(entry: string): Promise<string> {
  const response = await fetch('/api/generate-poem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entry }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate poem');
  }
  const data = await response.json();
  return data.poem || '';
}
