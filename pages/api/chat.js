export default async function handler(req, res) {
  try {
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
      const lastMessage = messages[messages.length - 1]?.content || "";
      const last = lastMessage.trim().toLowerCase();
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
    You are a professional moving concierge for MovingCo. Speak like a calm expert who has booked thousands of long-distance moves. Keep replies under 3 short sentences.
    
    Follow this process:
    - Collect origin, destination, home size, date, load/unload help, special items
    - Ask: “Is this a fresh start, job move, or something else?”
    - Recap in bullets
    - Say: “Give me a sec—I’m checking pricing history and top-rated carrier availability for your route…”
    - Then quote with range, MoveSafe Method™ benefits, and testimonial
    - Then end with: [CTA] Yes, Reserve My Move | I Have More Questions First
    
    If user clicks “Yes, Reserve My Move”, ask for:
    - Name, Email, Phone, Pickup address, Delivery address
    Then show Stripe link.
    
    
    If the user says something like "Now give me a confident quote range..." or "What’s the quote?", respond immediately with:
    - Price range
    - MoveSafe Method™ benefits
    - 1 testimonial
    - End with: [CTA] Yes, Reserve My Move | I Have More Questions First
    
    Never skip steps. Never talk like a bot.
    
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
    
      if (
        reply.toLowerCase().includes("moves like this usually fall between") &&
        !reply.toLowerCase().includes("yes, reserve my move")
      ) {
        reply += "\n\n[CTA] Yes, Reserve My Move | I Have More Questions First";
      }
    
        if (
        reply.trim().toLowerCase().endsWith("yes, reserve my move | i have more questions first") &&
        !reply.includes("[CTA]")
      ) {
        reply = "[CTA] " + reply.trim();
      }
      return res.status(200).json({ reply });
    
    } catch (err) {
      console.error('GPT Error:', err);
      return res.status(500).json({ reply: 'Something went wrong.' });
  } catch (err) {
    console.error('GPT Error:', err);
    return res.status(500).json({ reply: 'Something went wrong.' });
  }
}