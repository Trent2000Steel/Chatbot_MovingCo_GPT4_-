let sessions = {};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { sessionId, message } = req.body;
  const userInput = (message || "").trim().toLowerCase();

  if (!sessions[sessionId]) {
    sessions[sessionId] = { phase: 0, data: {} };
  }
  const session = sessions[sessionId];

  if (userInput === "start_chat") {
    return res.status(200).json({
      reply: "Welcome to MovingCo. I’m your MoveSafe quote concierge—skilled in long-distance coordination, pricing, and protection.\n\nWhere are you moving from?",
      buttons: ["Texas", "California", "New York", "Other (type)"]
    });
  }

  const reply = (text, phase = null, buttons = null) => {
    if (phase !== null) session.phase = phase;
    return res.status(200).json({
      reply: text,
      buttons: Array.isArray(buttons) ? buttons : undefined
    });
  };

  try {
    switch (session.phase) {
      case 0:
        session.data.origin = userInput;
        return reply("Great! And where are you moving to?", 1, ["Texas", "California", "Arizona", "Other (type)"]);
      case 1:
        session.data.destination = userInput;
        return reply("Awesome! What type of space are you moving?", 2, [
          "Apartment", "Storage Unit", "Office", "Full Home"
        ]);
      case 2:
        session.data.homeSize = userInput;
        return reply("Got it! What date are you planning to move?", 3, [
          "Exact Date (type)", "Not Sure Yet"
        ]);
      case 3:
        session.data.moveDate = userInput;
        return reply("Will you need help with loading and unloading?", 4, [
          "Load only", "Unload only", "Both"
        ]);
      case 4:
        session.data.loadHelp = userInput;
        return reply("Any special or fragile items?", 5, ["Yes", "No"]);
      case 5:
        session.data.specialItems = userInput;
        return reply("What’s the reason for your move?", 6, ["Job", "Family", "Fresh start", "Other"]);
      case 6:
        session.data.reason = userInput;
        return reply(
          `Here’s what I’m preparing your quote on:\n
- Origin: ${session.data.origin}
- Destination: ${session.data.destination}
- Space: ${session.data.homeSize}
- Move Date: ${session.data.moveDate}
- Help: ${session.data.loadHelp}
- Special Items: ${session.data.specialItems}
- Reason: ${session.data.reason}\n
Ready for me to run your estimate?`,
          7,
          ["Yes, Run the Estimate", "I Need to Add Something"]
        );
      case 7:
        if (/yes/.test(userInput)) {
          session.phase = 8;
          const systemPrompt = `You are a professional moving concierge for MovingCo.\nProvide a SHORT, clear price estimate as a range (e.g., $2,000–$4,000), followed by 2-3 bullet point highlights (MoveSafe Method, live review call, no insurance promises). End with [CTA] Yes, Reserve My Move | I Have More Questions First.`;
          const userPrompt = `Move details:\nFrom: ${session.data.origin}\nTo: ${session.data.destination}\nSpace: ${session.data.homeSize}\nDate: ${session.data.moveDate}\nHelp: ${session.data.loadHelp}\nSpecial Items: ${session.data.specialItems}\nReason: ${session.data.reason}`;

          const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
              ]
            })
          });

          const data = await gptResponse.json();
          let quote = data.choices?.[0]?.message?.content?.trim() || "";
          if (!quote.toLowerCase().includes("yes, reserve my move")) {
            quote = `QUOTE:\n${quote}\n\n[CTA] Yes, Reserve My Move | I Have More Questions First`;
          }

          return reply(quote, 9, ["Yes, Reserve My Move", "I Have More Questions First"]);
        } else {
          return reply("No problem! Go ahead and tell me what you’d like to add or update.");
        }
      case 9:
        if (userInput.includes("reserve")) {
          return reply("Great! Let’s get you booked. What’s your full name?", 10);
        }
        if (userInput.includes("questions")) {
          return reply("Of course—ask me anything. I’m here to help you feel confident before moving forward.");
        }
        break;
      case 10:
        session.data.name = userInput;
        return reply("Thanks! What’s your email address?", 11);
      case 11:
        session.data.email = userInput;
        return reply("And your phone number?", 12);
      case 12:
        session.data.phone = userInput;
        return reply("What’s the pickup address?", 13);
      case 13:
        session.data.pickup = userInput;
        return reply("And the delivery address?", 14);
      case 14:
        session.data.dropoff = userInput;

        const stripeLink = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";
        await fetch("https://hooks.slack.com/services/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", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `*New Move Lead*\nName: ${session.data.name}\nEmail: ${session.data.email}\nPhone: ${session.data.phone}\nFrom: ${session.data.pickup}\nTo: ${session.data.dropoff}\nDate: ${session.data.moveDate}\nSpace: ${session.data.homeSize}\nQuote Flow: Completed\nStripe Link Sent: ✅`
          })
        });

        return reply(
          `Perfect! You can reserve your move now with the $85 deposit below. After payment, we’ll schedule your Move Review Call to finalize your flat rate.\n\nSTRIPE_LINK: ${stripeLink}`,
          999
        );
      default:
        return reply("I'm here to help whenever you're ready!");
    }
  } catch (error) {
    console.error("Critical error in chat handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}