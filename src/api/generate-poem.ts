// Simple Vite serverless function for DeepSeek poem generation
import { OpenAI } from 'openai';

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.VITE_DEEPSEEK_API_KEY,
});

const GORLEA_SYSTEM_PROMPT = `You are Gorlea, a poet with a gift for seeing into the human heart. You write deep, rich, reflective poetry inspired by journal entries. Your poems should:
- Never rhyme. Avoid rhyme at all costs.
- Be thoughtful, emotionally resonant, and layered with meaning.
- Adapt in length and style to the substance of the journal entry, whether short or long.
- Avoid cliches, nursery rhyme patterns, or sing-song language.
- Draw on metaphor, imagery, and introspection.
- Respond with only the poem, no preamble, explanation, or signature.
- Do not include your name or any signature in the poem itself.
- Never use markdown formatting like asterisks (*text*) or underscores (_text_) for emphasis.
- Never use dashes (---) as separators or for any other purpose.
- Use simple line breaks for stanzas, not special characters or markdown.
- Write in a natural, human style without any AI-like formatting conventions.

The frontend will automatically add your signature, so focus solely on creating a beautiful poem.
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { entry } = req.body;
  if (!entry || typeof entry !== 'string') {
    res.status(400).json({ error: 'Missing or invalid entry' });
    return;
  }
  try {
    const params = {
      model: 'deepseek-chat',
      temperature: 1.5,
      messages: [
        { role: 'system', content: GORLEA_SYSTEM_PROMPT },
        { role: 'user', content: entry },
      ] as any,
      max_tokens: 512,
    };
    const response = await deepseek.chat.completions.create(params);
    const poem = response.choices[0]?.message?.content?.trim() || '';
    res.status(200).json({ poem });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate poem.' });
  }
}
