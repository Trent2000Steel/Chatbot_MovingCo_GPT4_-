
const RATE_LIMIT = 50;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;
global.ipStore = global.ipStore || {};

const stripeLink = "https://your-stripe-checkout-link.com"; // Replace with your real Stripe link

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

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

  const last = messages[messages.length - 1].content.trim().toLowerCase();

  const hasName = messages.some(m => m.content.toLowerCase().includes("name:"));
  const hasEmail = messages.some(m => m.content.toLowerCase().includes("email:"));
  const hasPhone = messages.some(m => m.content.toLowerCase().includes("phone:"));
  const hasPickup = messages.some(m => m.content.toLowerCase().includes("pickup address:"));
  const hasDrop = messages.some(m => m.content.toLowerCase().includes("delivery address:"));

  const allInfoCollected = hasName && hasEmail && hasPhone && hasPickup && hasDrop;

  try {
    // CTA logic
    if (last.includes("yes, reserve my move")) {
      return res.status(200).json({
        reply: "Perfect. Let’s get you booked. Please provide your full name like this:
Name: John Doe"
      });
    }

    if (!hasName) {
      return res.status(200).json({
        reply: "Got it. What’s your email?
Email: you@example.com"
      });
    }

    if (!hasEmail) {
      return res.status(200).json({
        reply: "Thanks. What’s the best phone number to reach you?
Phone: (555) 123-4567"
      });
    }

    if (!hasPhone) {
      return res.status(200).json({
        reply: "Great. What’s the full pickup address?
Pickup Address: 123 Main St, Dallas, TX"
      });
    }

    if (!hasPickup) {
      return res.status(200).json({
        reply: "Thanks. And what’s the delivery address?
Delivery Address: 456 Elm St, Phoenix, AZ"
      });
    }

    if (!hasDrop) {
      return res.status(200).json({
        reply: `Perfect. Everything looks good. You can reserve your move now with the $85 deposit here:
${stripeLink}`
      });
    }

    // Question deflection logic
    if (last.includes("i have more questions")) {
      return res.status(200).json({
        reply: "Of course—ask me anything. I’m here to make this simple. Just know we only book 10 spots per day per route, so I’d love to hold your place if this is a fit."
      });
    }

    const systemPrompt = `
You are a professional moving concierge for MovingCo. Speak like a calm expert who has booked thousands of long-distance moves. Keep replies under 3 short sentences.

After you quote a move, always end with:
"[CTA] Yes, Reserve My Move | I Have More Questions First"

If the user says "Yes, Reserve My Move", guide them to provide:
- Full name
- Email
- Phone
- Pickup address
- Delivery address

Only after receiving all 5, give them this Stripe link to book:
${stripeLink}

Keep things tight, helpful, and confident.
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

    let reply = data.choices?.[0]?.message?.content || "";

    if (reply.includes("Moves like this usually fall between")) {
      reply += "\n\n[CTA] Yes, Reserve My Move | I Have More Questions First";
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Something went wrong. Our system may be maxed out. Would you like a human to follow up via email?",
    });
  }
}
