import OpenAI from "openai";

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse entry from body (handle both JSON and urlencoded)
  let entry = undefined;
  if (req.headers["content-type"]?.includes("application/json")) {
    try {
      ({ entry } = req.body ?? {});
    } catch {
      return res.status(400).json({ error: "Invalid JSON" });
    }
  } else if (req.body && typeof req.body === "object") {
    entry = req.body.entry;
  }

  if (!entry || typeof entry !== "string") {
    return res.status(400).json({ error: "Missing or invalid entry" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Write a short poem based on the user's journal entry." },
        { role: "user", content: entry }
      ]
    });
    const poem = completion.choices?.[0]?.message?.content?.trim() ?? "";
    return res.status(200).json({ poem });
  } catch (err) {
    console.error("Poem API error:", err);
    return res.status(500).json({ error: "poem‑generation‑failed" });
  }
}
