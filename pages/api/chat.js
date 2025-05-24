let sessions = {};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { sessionId, message } = req.body;
  if (!sessions[sessionId]) sessions[sessionId] = { phase: 0, data: {} };

  let session = sessions[sessionId];

  if (!session || userInput === "start_chat") {
    sessions[sessionId] = { phase: 0, data: {} };
    session = sessions[sessionId];
  }

  const userInput = (message || "").trim().toLowerCase();

  const reply = (text, phase = null, buttons = null) => {
    if (phase !== null) session.phase = phase;
    return res.status(200).json({
      reply: text,
      buttons: Array.isArray(buttons) ? buttons : undefined
    });
  };

  switch (session.phase) {
    case 0:
      return reply(
        "Welcome to MovingCo. I’m your MoveSafe quote concierge—skilled in long-distance coordination, pricing, and protection.\n\nNo forms. No waiting. I’ll give you a real quote right here in chat.\n\nWhere are you moving from?",
        1
      );
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

      // Date validation (7-day rush move trigger)
      const now = new Date();
      const moveDate = new Date(userInput);
      const diffDays = (moveDate - now) / (1000 * 60 * 60 * 24);
      if (!isNaN(diffDays) && diffDays < 7) {
        session.phase = 998;
        return reply(
          "Thanks—just a heads up, we don’t accept standard bookings less than 7 days out. That’s because our MoveSafe Method™ requires time to ship your protection kit and assign verified movers.",
          998,
          ["Submit a Priority Move Request", "Pick a New Move Date"]
        );
      }

      return reply("Will you need help with loading and unloading?", 5, [
        "Yes", "No", "Just loading", "Just unloading"
      ]);
    case 998: // Return from rush CTA
      if (userInput.includes("priority")) {
        session.data.rush = true;
        return reply("Got it. Let’s proceed and note this as a priority request.", 5);
      } else {
        return reply("Okay—please tell me your new target move date.", 4);
      }
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

        const systemPrompt = `You are a professional moving concierge for MovingCo.\n
You’ve booked thousands of long-distance moves using the MoveSafe Method™.\n
Estimate price range based on size, route, and services.\n
Lean low to avoid scaring off customer.\n
Include: MoveSafe Method (verified movers, freight coordination, protection kit).\n
Always say flat rate is finalized after a live Move Review Call.\n
Do not promise full insurance or carrier liability.\n
End with:\n
[CTA] Yes, Reserve My Move | I Have More Questions First`;

        const userPrompt = `Move details:\n
- From: ${session.data.origin}
- To: ${session.data.destination}
- Home Size: ${session.data.homeSize}
- Date: ${session.data.moveDate}
- Help: ${session.data.loadHelp}
- Special Items: ${session.data.specialItems}
- Reason: ${session.data.reason}`;

        try {
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
        } catch (err) {
          console.error("GPT Error:", err);
          return reply("Something went wrong while generating your quote. Please try again later.", 9);
        }
      } else {
        return reply("No problem—just let me know when you’re ready.");
      }
    case 11:
      if (userInput.includes("reserve")) {
        session.phase = 12;
        return reply("Great. Let’s get you booked. What’s your full name?");
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

      // Post to Slack
      await fetch("https://hooks.slack.com/services/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", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `*New Move Lead*\nName: ${session.data.name}\nEmail: ${session.data.email}\nPhone: ${session.data.phone}\nFrom: ${session.data.pickup}\nTo: ${session.data.dropoff}\nDate: ${session.data.moveDate}\nHome Size: ${session.data.homeSize}\nQuote Flow: Completed\nStripe Link Sent: ✅\nRush: ${session.data.rush ? "Yes" : "No"}`
        })
      });

      return reply(
        `Perfect. Everything looks good. You can reserve your move now with the $85 deposit:\n${stripeLink}\n\nAfter payment, we’ll schedule your Move Review Call with a seasoned coordinator to finalize your flat rate and ensure everything’s covered.`,
        999
      );
    default:
      return reply("I'm here to help whenever you're ready.");
  }
}