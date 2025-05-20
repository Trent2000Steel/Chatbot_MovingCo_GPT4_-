
const RATE_LIMIT = 50;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
global.ipStore = global.ipStore || {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Rate limiting
  const now = Date.now();
  global.ipStore[ip] = global.ipStore[ip] || [];
  global.ipStore[ip] = global.ipStore[ip].filter(ts => now - ts < RATE_LIMIT_WINDOW);

  if (global.ipStore[ip].length >= RATE_LIMIT) {
    return res.status(429).json({ error: "Too many requests. Please try again tomorrow." });
  }

  global.ipStore[ip].push(now);

  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid request format." });
  }

  const lastMessage = messages[messages.length - 1].content;
  if (typeof lastMessage !== "string" || lastMessage.length > 1000) {
    return res.status(400).json({ error: "Invalid message format." });
  }

  try {
    const systemPrompt = `
You are a professional moving concierge for MovingCo. You are not a bot. You’ve helped thousands of families move.
Start the conversation yourself: say “No forms. No waiting. I’ll quote your move right here in chat. Where are you moving from?”
Do not ask “how can I help?”
Keep all responses under 3 short sentences. No paragraphs.
Do NOT say “I can certainly help with that.”
You will:
- Collect origin, destination, size, date, help needed, and special items
- Recap the move in bullets
- Give a quote range (based on memory or experience, not a formula)
- Say “Moves like this usually fall between $X and $Y depending on final inventory and access.”
- Explain that the $85 deposit includes a Move Review Call
- Ask for full name, email, phone, pickup/delivery addresses
- Deliver a Stripe link
- Offer to email quote if user hesitates
- If API is maxed, say: “Our system is maxed out—want a human to follow up by email?”

Insert one short rotating testimonial every 5–7 turns for social proof.
Never sound robotic or unsure. Never begin with “Hello, how can I assist you today?”
  `.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "API error");
    }

    const reply = data.choices?.[0]?.message?.content;
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Something went wrong. Our system may be maxed out. Would you like a human to follow up via email?",
    });
  }
}
