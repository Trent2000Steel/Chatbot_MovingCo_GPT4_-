

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RATE_LIMIT = 50;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

global.ipStore = global.ipStore || {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Simple in-memory rate limiting
  const now = Date.now();
  global.ipStore[ip] = global.ipStore[ip] || [];
  global.ipStore[ip] = global.ipStore[ip].filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

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
    const completion = await openai.chat.completions.create({
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
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;

    // Optional webhook/email notification placeholder
    // if (reply.includes("Perfect. Here’s your secure link")) {
    //   await fetch("https://your-webhook-url.com", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ user: ip, message: "New booking initiated" })
    //   });
    // }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Something went wrong. Our system may be maxed out. Would you like a human to follow up via email?",
    });
  }
}