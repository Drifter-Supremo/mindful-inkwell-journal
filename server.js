import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// DeepSeek/OpenAI setup
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
- When user memories are provided, subtly incorporate them into your poem in a natural, non-obvious way.
- Never explicitly mention that you're using their memories - weave them in organically.
- If the user has a preferred name, use it naturally in the poem when appropriate.
- Treat memories as inspiration, not requirements - only use what fits the emotional tone of the entry.

The frontend will automatically add your signature, so focus solely on creating a beautiful poem.
`;

// API endpoint for poem generation
app.post('/api/generate-poem', async (req, res) => {
  const { entry, memories } = req.body;
  if (!entry || typeof entry !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid entry' });
  }

  try {
    // Combine the system prompt with user memories if available
    let systemPrompt = GORLEA_SYSTEM_PROMPT;
    if (memories && typeof memories === 'string') {
      systemPrompt = `${GORLEA_SYSTEM_PROMPT}\n\n${memories}`;
    }

    const params = {
      model: 'deepseek-chat',
      temperature: 1.5,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: entry },
      ],
      max_tokens: 512,
    };
    const response = await deepseek.chat.completions.create(params);
    const poem = response.choices[0]?.message?.content?.trim() || '';
    res.status(200).json({ poem });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to generate poem.' });
  }
});

// Proxy all other requests to Vite dev server
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:5173', // Default Vite dev server
    changeOrigin: true,
    ws: true,
  })
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log('Proxying frontend to Vite dev server at http://localhost:5173');
});
