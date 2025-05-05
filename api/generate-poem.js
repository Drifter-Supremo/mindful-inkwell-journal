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
      messages: [
        { role: "system", content: "Write a short poem based on the user's journal entry." },
        { role: "user", content: entry }
      ]
    });

    return res.status(200).json({ poem: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("Poem API error:", err);
    return res.status(500).json({ error: "poem-generation-failed" });
  }
};
