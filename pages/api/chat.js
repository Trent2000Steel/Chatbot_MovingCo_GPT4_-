
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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are a professional moving concierge for MovingCo. Keep all responses under 3 short sentences. 
Speak like someone who has booked hundreds of moves. Avoid robotic phrases. 
Your job is to quote, build trust, and guide the user to place an $85 deposit to reserve their move. 
That deposit includes a Move Review Call where a human confirms inventory and locks in the flat rate. 
Always be clear, calm, and conversational. You are not a bot—you are the human face of MovingCo.
`
          },
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
