
// pages/api/chat.js

export default async function handler(req, res) {
  try {
    const stripeLink = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";
    const slackWebhook = "https://hooks.slack.com/services/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";
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: "Invalid request format." });
    }

    const last = messages[messages.length - 1].content.trim().toLowerCase();

    if (last === "start_chat") {
      return res.status(200).json({
        reply: "Welcome to MovingCo. I’m your MoveSafe quote concierge—skilled in long-distance coordination, pricing, and protection.\n\nNo forms. No waiting. I’ll give you a real quote right here in chat. Where are you moving from?"
      });
    }

    if (last.startsWith("now give me a confident quote")) {
      const quoteReply = [
        "Thanks—based on recent moves just like this, here’s your estimated price range:",
        "$1,900 – $2,300",
        "Includes verified crews, coordinated freight, and your own concierge to finalize the details.",
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
        reply: "Great. Let’s get you booked. Please provide your full name like this: Name: John Doe"
      });
    }

    if (hasName && !hasEmail) {
      return res.status(200).json({ reply: "Got it. What’s your email? Format: Email: you@example.com" });
    }

    if (hasName && hasEmail && !hasPhone) {
      return res.status(200).json({ reply: "Thanks. What’s your phone number? Format: Phone: (555) 123-4567" });
    }

    if (hasName && hasEmail && hasPhone && !hasPickup) {
      return res.status(200).json({ reply: "Perfect. What’s the full pickup address? Format: Pickup Address: 123 Main St, Dallas, TX" });
    }

    if (hasName && hasEmail && hasPhone && hasPickup && !hasDrop) {
      return res.status(200).json({ reply: "Thanks. And what’s the delivery address? Format: Delivery Address: 456 Elm St, Phoenix, AZ" });
    }

    if (hasName && hasEmail && hasPhone && hasPickup && hasDrop) {
      const name = messages.find(m => m.content.toLowerCase().includes("name:"))?.content.split(":")[1].trim();
      const email = messages.find(m => m.content.toLowerCase().includes("email:"))?.content.split(":")[1].trim();
      const phone = messages.find(m => m.content.toLowerCase().includes("phone:"))?.content.split(":")[1].trim();
      const pickup = messages.find(m => m.content.toLowerCase().includes("pickup address:"))?.content.split(":")[1].trim();
      const delivery = messages.find(m => m.content.toLowerCase().includes("delivery address:"))?.content.split(":")[1].trim();

      const slackMessage = `*New Move Lead*:\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Move:* ${pickup} → ${delivery}\n*Lead Type:* Confirmed via chatbot`;

      await fetch(slackWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: slackMessage })
      });

      return res.status(200).json({
        reply: `Perfect. Everything looks good. You can reserve your move now with the $85 deposit here: ${stripeLink}`
      });
    }

    const systemPrompt = \`
You are a professional moving concierge for MovingCo. Speak like a calm expert who has booked thousands of long-distance moves.

Flow:
- Collect origin, destination, home size, move date, load/unload help, and special items
- Ask: “Is this a fresh start, job move, or something else?”
- Recap the move in bullets
- Confirm: “Does everything look right?” → [Yes | No]
- Ask: “Ready to run your estimate?” → [Yes | Not Yet]
- Then quote range, MoveSafe Method, review call, and CTA
- If Yes to Reserve: Collect name, email, phone, pickup, and delivery. Then show Stripe link and push lead to Slack.
- Never promise final pricing, insurance, or coverage. That happens during the concierge call.
\`.trim();

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
        temperature: 0.6
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
