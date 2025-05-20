
const RATE_LIMIT = 50;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;
global.ipStore = global.ipStore || {};
global.contactMode = global.contactMode || {};

const stripeLink = "https://your-stripe-checkout-link.com"; // Replace with your actual Stripe URL

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
  const last = messages[messages.length - 1].content.trim().toLowerCase();
  const userId = ip;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid request format." });
  }

  if (last === "start_chat") {
    global.contactMode[userId] = false;
    return res.status(200).json({
      reply: "No forms. No waiting. I’ll quote your move right here in chat. Where are you moving from?"
    });
  }

  if (last.includes("yes, reserve my move")) {
    global.contactMode[userId] = true;
    return res.status(200).json({
      reply: "Perfect. Let’s get you booked. Please provide your full name like this: Name: John Doe"
    });
  }

  const isInContactFlow = global.contactMode[userId];

  const hasName = messages.some(m => m.content.toLowerCase().includes("name:"));
  const hasEmail = messages.some(m => m.content.toLowerCase().includes("email:"));
  const hasPhone = messages.some(m => m.content.toLowerCase().includes("phone:"));
  const hasPickup = messages.some(m => m.content.toLowerCase().includes("pickup address:"));
  const hasDrop = messages.some(m => m.content.toLowerCase().includes("delivery address:"));

  if (isInContactFlow) {
    if (!hasName) {
      return res.status(200).json({
        reply: "Got it. What’s your email? Format: Email: you@example.com"
      });
    }
    if (!hasEmail) {
      return res.status(200).json({
        reply: "Thanks. What’s the best phone number to reach you? Format: Phone: (555) 123-4567"
      });
    }
    if (!hasPhone) {
      return res.status(200).json({
        reply: "Great. What’s the full pickup address? Format: Pickup Address: 123 Main St, Dallas, TX"
      });
    }
    if (!hasPickup) {
      return res.status(200).json({
        reply: "Thanks. And what’s the delivery address? Format: Delivery Address: 456 Elm St, Phoenix, AZ"
      });
    }
    if (!hasDrop) {
      global.contactMode[userId] = false;
      return res.status(200).json({
        reply: `Perfect. Everything looks good. You can reserve your move now with the $85 deposit here: ${stripeLink}`
      });
    }
  }

  if (last.includes("i have more questions")) {
    return res.status(200).json({
      reply: "Of course—ask me anything. I’m here to make this simple. Just know we only book 10 spots per day per route, so I’d love to hold your place if this is a fit."
    });
  }

  const systemPrompt = `
You are a professional moving concierge for MovingCo. You are not a bot. Speak like a calm expert who has booked thousands of moves.

Tone: Calm. Confident. No fluff. No paragraphs. 2–3 short sentences max.

---

OPENING:
Start with:
> “No forms. No waiting. I’ll quote your move right here in chat. Where are you moving from?”

DO NOT say “How can I help you?” or speak like an assistant.

---

YOUR FLOW:

1. Gather:
- Origin
- Destination
- Home size
- Move date
- Load/unload help
- Special or fragile items

2. If they only say a state (like “Texas” or “California”), always ask:
> “What city in Texas?” / “What city in California?”

3. Add a soft emotional question before quoting:
> “Is this a fresh start, job move, or something else? Just curious—it helps me guide the process.”

4. Recap in bullet form.

5. Add pacing:
> “Give me a sec—I’m checking pricing history and top-rated carrier availability for your route…”

6. Then quote:
> “Moves like this usually fall between $X and $Y depending on final inventory and access.”
> “That includes our MoveSafe Method™—you get verified trusted movers, quality shipping partners, and one point of contact from start to finish.”

7. Benefits:
> “We request photos in advance to avoid surprises. If your movers try to charge more, we cover the difference—you only pay your flat rate.”
> “You can also opt into Premium Move Coverage™ to protect specific items.”

8. Scarcity + soft close:
> “To reserve your move, it’s just an $85 deposit. That includes your Move Review Call where we finalize inventory, confirm access, and lock in your rate.”

9. If they ask to speak to someone:
> “We don’t offer phone calls before booking. The $85 deposit unlocks your Move Review Call with a real person to confirm everything.”

10. If they hesitate:
> “No pressure at all. Would you like me to email your quote to save for later?”

11. If they say they’re just checking:
> “Totally fine. Just keep in mind—we only accept 10 moves per day per route. The $85 deposit holds your spot.”

---

Inject 1 testimonial every 5–7 turns:
> “We saved $800 and didn’t lift a finger. I’d use them again in a second.” – Chris R., Houston to Vegas
> “Best move I’ve ever booked. No stress, no bait-and-switch.” – Jason W., Dallas to Phoenix
> “Everything was organized before move day. That was the difference.” – Angela M., Austin to Denver

---

RULES:
- Never use robotic phrasing or sales clichés
- Never write long paragraphs
- Never say “as an AI” or “I can help you with that”
- Always speak like a confident human who knows the moving business inside and out

You are the voice of MovingCo. They’re not just booking a move—they’re buying peace of mind.
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

  const reply = data.choices?.[0]?.message?.content || "";
  return res.status(200).json({ reply });
}
