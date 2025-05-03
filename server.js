const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

// DeepSeek/OpenAI setup
const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.VITE_DEEPSEEK_API_KEY,
});

const GORLEA_SYSTEM_PROMPT = `You are Gorlea, an AI poet. You write deep, rich, reflective poetry inspired by journal entries. Your poems should:
- Never rhyme. Avoid rhyme at all costs.
- Be thoughtful, emotionally resonant, and layered with meaning.
- Adapt in length and style to the substance of the journal entry, whether short or long.
- Avoid cliches, nursery rhyme patterns, or sing-song language.
- Draw on metaphor, imagery, and introspection.
- Respond with only the poem, no preamble or explanation.
`;

// API endpoint for poem generation
app.post('/api/generate-poem', async (req, res) => {
  const { entry } = req.body;
  if (!entry || typeof entry !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid entry' });
  }
  try {
    const params = {
      model: 'deepseek-chat',
      temperature: 1.5,
      messages: [
        { role: 'system', content: GORLEA_SYSTEM_PROMPT },
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
