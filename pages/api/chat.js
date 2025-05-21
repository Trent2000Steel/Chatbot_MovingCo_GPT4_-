
export default async function handler(req, res) {
  try {
    const stripeLink = "https://your-stripe-checkout-link.com";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: "Invalid request format." });
    }

    const lastMessage = messages[messages.length - 1]?.content || "";
    const last = lastMessage.trim().toLowerCase();

    if (last === "start_chat") {
      return res.status(200).json({
        reply: "No forms. No waiting. I’ll quote your move right here in chat. Where are you moving from?"
      });
    }

    if (last.startsWith("now give me a confident quote")) {
      const quoteReply = [
        "Moves like this usually fall between $2,000 and $3,000 depending on final inventory and access.",
        "That includes our MoveSafe Method™—you get verified trusted movers, quality shipping partners, and one point of contact from start to finish.",
        "You’ll also get a live Move Review Call with an experienced moving professional who finalizes your inventory and locks in your flat rate.",
        "\"Everything was organized before move day. That was the difference.\" – Angela M.",
        "[CTA] Yes, Reserve My Move | I Have More Questions First"
      ].join("\n\n");
      return res.status(200).json({ reply: quoteReply });
    }

    const hasName = messages.some(m => m.content.toLowerCase().includes("name:"));
    const hasEmail = messages.some(m => m.content.toLowerCase().includes("email:"));
    const hasPhone = messages.some(m => m.content.toLowerCase().includes("phone:"));
    const hasPickup = messages.some(m => m.content.toLowerCase().includes("pickup address:"));
    const hasDrop = messages.some(m => m.content.toLowerCase().includes("delivery address:"));

    if (last.includes("yes, reserve my move")) {
      return res.status(200).json({
        reply: "Perfect. Let’s get you booked. Please provide your full name like this: Name: John Doe"
      });
    }

    if (hasName && !hasEmail) {
      return res.status(200).json({ reply: "Got it. What’s your email? Format: Email: you@example.com" });
    }

    if (hasName && hasEmail && !hasPhone) {
      return res.status(200).json({ reply: "Thanks. What’s the best phone number to reach you? Format: Phone: (555) 123-4567" });
    }

    if (hasName && hasEmail && hasPhone && !hasPickup) {
      return res.status(200).json({ reply: "Great. What’s the full pickup address? Format: Pickup Address: 123 Main St, Dallas, TX" });
    }

    if (hasName && hasEmail && hasPhone && hasPickup && !hasDrop) {
      return res.status(200).json({ reply: "Thanks. And what’s the delivery address? Format: Delivery Address: 456 Elm St, Phoenix, AZ" });
    }

    if (hasName && hasEmail && hasPhone && hasPickup && hasDrop) {
      return res.status(200).json({
        reply: `Perfect. Everything looks good. You can reserve your move now with the $85 deposit here: ${stripeLink}`
      });
    }

    const systemPrompt = `
You are a professional moving concierge for MovingCo. Speak like a calm expert who has booked thousands of long-distance moves. Keep replies under 3 short sentences.

---

QUOTE FLOW:
- Collect origin, destination, home size, move date, load/unload help, and special items.
- Ask: “Is this a fresh start, job move, or something else?”
- Recap the move in bullets.
- Say: “Give me a sec—I’m checking pricing history and top-rated carrier availability for your route…”
- Then quote:
  - Price range
  - MoveSafe Method™ benefits
  - Move Review Call explanation
  - 1 testimonial
  - End with:
    [CTA] Yes, Reserve My Move | I Have More Questions First

If user says “Yes, Reserve My Move”, trigger contact info capture in order: name, email, phone, pickup, delivery. After all, show Stripe link.

If user says “I Have More Questions First”, respond warmly and reinforce benefits.

If GPT forgets [CTA], but message ends in “Yes, Reserve My Move | I Have More Questions First”, backend should wrap it.

Never break tone. Never wait for user input after pacing line. Never skip the MoveSafe Method or CTA.
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
    let reply = data.choices?.[0]?.message?.content || "Something went wrong.";

    if (
      reply.toLowerCase().includes("yes, reserve my move | i have more questions first") &&
      !reply.includes("[CTA]")
    ) {
      reply = "[CTA] " + reply.trim();
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("GPT Error:", err);
    return res.status(500).json({ reply: "Something went wrong." });
  }
}
