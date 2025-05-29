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
      reply: "Welcome to MovingCo. I’m your MoveSafe quote concierge—skilled in long-distance coordination, pricing, and protection.\n\nNo forms. No waiting. I’ll give you a real quote right here in chat.\n\nWhere are you moving from?"
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
        return reply("Where are you moving from?", 1);
      case 1:
        session.data.origin = userInput;
        return reply("Great! And where are you moving to?", 2);
      case 2:
        session.data.destination = userInput;
        return reply("Fantastic. What’s the size of your home? (e.g. 2-bedroom apartment)", 3);
      case 3:
        session.data.homeSize = userInput;
        return reply("Got it. What date are you planning to move?", 4);
      case 4:
        session.data.moveDate = userInput;
        return reply("Will you need help with loading and unloading?", 5, [
          "Yes", "No", "Just loading", "Just unloading"
        ]);
      case 5:
        session.data.loadHelp = userInput;
        return reply("Any special or fragile items? (TVs, artwork, instruments, etc.)", 6);
      case 6:
        session.data.specialItems = userInput;
        return reply("What’s the reason for your move? (Job relocation, fresh start, etc.)", 7);
      case 7:
        session.data.reason = userInput;
        return reply(
          `Let’s recap your move:\n
- Origin: ${session.data.origin}
- Destination: ${session.data.destination}
- Home Size: ${session.data.homeSize}
- Move Date: ${session.data.moveDate}
- Load/Unload Help: ${session.data.loadHelp}
- Special Items: ${session.data.specialItems}
- Reason: ${session.data.reason}\n
Does everything look right?`,
          8,
          ["Yes, Looks Good", "No, Needs Fixing"]
        );
      case 8:
        if (/yes/.test(userInput)) {
          return reply("Great! Are you ready for me to run your estimate now?", 9, [
            "Yes, Run the Estimate",
            "Not Yet"
          ]);
        } else {
          return reply("No problem—just tell me what you'd like to update.");
        }
      case 9:
        if (/yes/.test(userInput)) {
          session.phase = 10;
          const systemPrompt = `You are a professional moving concierge for MovingCo.\nEstimate price range based on size, route, and services. Lean low to avoid sticker shock. Include MoveSafe Method, explain Move Review Call, no full insurance or liability promises. End with [CTA] Yes, Reserve My Move | I Have More Questions First.`;
          const userPrompt = `Move details:\nFrom: ${session.data.origin}\nTo: ${session.data.destination}\nHome Size: ${session.data.homeSize}\nDate: ${session.data.moveDate}\nHelp: ${session.data.loadHelp}\nSpecial Items: ${session.data.specialItems}\nReason: ${session.data.reason}`;

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
            quote += "\n\n[CTA] Yes, Reserve My Move | I Have More Questions First";
          }

          return reply(quote, 11, ["Yes, Reserve My Move", "I Have More Questions First"]);
        } else {
          return reply("No problem—just let me know when you’re ready.");
        }
      case 11:
        if (userInput.includes("reserve")) {
          return reply("Great. Let’s get you booked. What’s your full name?", 12);
        }
        if (userInput.includes("questions")) {
          return reply("Of course—ask me anything. I’m here to help you feel confident before moving forward.");
        }
        break;
      case 12:
        session.data.name = userInput;
        return reply("Thanks. What’s your email address?", 13);
      case 13:
        session.data.email = userInput;
        return reply("And your phone number?", 14);
      case 14:
        session.data.phone = userInput;
        return reply("Pickup address?", 15);
      case 15:
        session.data.pickup = userInput;
        return reply("Delivery address?", 16);
      case 16:
        session.data.dropoff = userInput;

        const stripeLink = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";
        await fetch("https://hooks.slack.com/services/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", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `*New Move Lead*\nName: ${session.data.name}\nEmail: ${session.data.email}\nPhone: ${session.data.phone}\nFrom: ${session.data.pickup}\nTo: ${session.data.dropoff}\nDate: ${session.data.moveDate}\nHome Size: ${session.data.homeSize}\nQuote Flow: Completed\nStripe Link Sent: ✅`
          })
        });

        return reply(
          `Perfect. Everything looks good. You can reserve your move now with the $85 deposit:\n${stripeLink}\n\nAfter payment, we’ll schedule your Move Review Call with a seasoned coordinator to finalize your flat rate.`,
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