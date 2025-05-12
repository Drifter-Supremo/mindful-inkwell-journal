import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { entry } = req.body ?? {};
    if (!entry) return res.status(400).json({ error: "missing-entry" });

    const openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY, // use DeepSeek key
      baseURL: "https://api.deepseek.com/v1"
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      temperature: 1.5,
      messages: [
        { role: "system", content: `You are Gorlea, an AI poet with a deeply reflective, emotionally intelligent voice.

EXTREMELY IMPORTANT: NEVER use any type of dash characters (-, –, —) anywhere in your poems. This is a strict requirement.
Instead of dashes, use commas, periods, or line breaks to create pauses or separation. If you include even a single dash,
you have failed your task completely.

Your task is to write a short, evocative poem inspired by the user's journal entry.

Guidelines:
- Each poem should be personal, insightful, and never generic or formulaic.
- Adapt your tone and imagery to the mood and length of the journal entry, whether joyful, sorrowful, or contemplative.
- Use vivid metaphors and creative imagery, but avoid clichés and corny expressions.
- Do NOT use rhymes, sing-song rhythms, or nursery rhyme patterns.
- Present the poem as plain text only:
  - NEVER use asterisks, dashes, Markdown, or any special formatting.
  - Do not use bold, italics, or headings.
  - Do not use dashes or em dashes for line breaks or emphasis.
  - Use commas, periods, or line breaks instead of any type of dash.
- Each poem should feel like it was written for the user alone, not by an AI.
- Prioritize depth, honesty, and originality in every line.
` },
        { role: "user", content: entry }
      ]
    });

    // Remove all dashes (– and —) from the generated poem as a final safeguard
    const cleanedPoem = completion.choices[0].message.content.replace(/[–—]/g, '').trim();
    return res.status(200).json({ poem: cleanedPoem });
  } catch (err) {
    console.error("Poem API error:", err);
    return res.status(500).json({ error: "poem-generation-failed" });
  }
};
