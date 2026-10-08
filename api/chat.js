export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://milesjroby-svg.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-6-luna",
        instructions: "You are VAIL-AI. Give accurate, useful answers. Never knowingly make up facts. If uncertain, say so clearly. Do not present guesses as facts.",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI request failed"
      });
    }
const reply = data.output
  ?.flatMap(item => item.content || [])
  .filter(item => item.type === "output_text")
  .map(item => item.text)
  .join("\n") || "No response received.";

return res.status(200).json({
  reply
});
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
