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
        session.data.originState = userInput;
        return reply(`And what city in ${session.data.originState}?`, 1);
      case 1:
        session.data.originCity = userInput;
        return reply("Great! Where are you moving to?", 2, ["Texas", "California", "Arizona", "Other (type)"]);
      case 2:
        session.data.destinationState = userInput;
        return reply(`And what city in ${session.data.destinationState}?`, 3);
      case 3:
        session.data.destinationCity = userInput;
        return reply("Awesome! What type of space are you moving?", 4, [
          "Apartment", "Storage Unit", "Office", "Full Home"
        ]);
      case 4:
        session.data.spaceType = userInput;
        if (userInput.includes("apartment") || userInput.includes("home")) {
          return reply("How many bedrooms?", 5, ["1", "2", "3", "4+"]);
        } else if (userInput.includes("storage")) {
          return reply("What size storage unit? (e.g., 5x10, 10x10)", 5);
        } else {
          return reply("Got it! What date are you planning to move?", 6, ["Exact Date (type)", "Not Sure Yet"]);
        }
      case 5:
        session.data.sizeDetail = userInput;
        return reply("Got it! What date are you planning to move?", 6, ["Exact Date (type)", "Not Sure Yet"]);
      case 6:
        session.data.moveDate = userInput;
        return reply("Will you need help with loading and unloading?", 7, [
          "Load only", "Unload only", "Both"
        ]);
      case 7:
        session.data.loadHelp = userInput;
        return reply("Any special or fragile items?", 8, ["Yes", "No"]);
      case 8:
        session.data.hasSpecialItems = userInput;
        if (userInput === "yes") {
          return reply("Please list the special or fragile items you want us to know about.", 9);
        } else {
          session.data.specialItemList = "None";
          return reply("What’s the reason for your move?", 10, ["Job", "Family", "Fresh start", "Other"]);
        }
      case 9:
        session.data.specialItemList = userInput;
        return reply("What’s the reason for your move?", 10, ["Job", "Family", "Fresh start", "Other"]);
      case 10:
        session.data.reason = userInput;
        return reply(
          `Here’s what I’m preparing your quote on:\n
- Origin: ${session.data.originCity}, ${session.data.originState}
- Destination: ${session.data.destinationCity}, ${session.data.destinationState}
- Space: ${session.data.spaceType} (${session.data.sizeDetail || "n/a"})
- Move Date: ${session.data.moveDate}
- Help: ${session.data.loadHelp}
- Special Items: ${session.data.specialItemList}
- Reason: ${session.data.reason}\n
Ready for me to run your estimate?`,
          11,
          ["Yes, Run the Estimate", "I Need to Add Something"]
        );
      case 11:
        if (/yes/.test(userInput)) {
          session.phase = 12;
          const systemPrompt = `You are a professional moving concierge for MovingCo.\nProvide a SHORT, clear price estimate as a range (e.g., $2,000–$4,000), followed by 2-3 bullet point highlights (MoveSafe Method, live review call, no insurance promises). End with [CTA] Yes, Reserve My Move | I Have More Questions First.`;
          const userPrompt = `Move details:\nFrom: ${session.data.originCity}, ${session.data.originState}\nTo: ${session.data.destinationCity}, ${session.data.destinationState}\nSpace: ${session.data.spaceType} (${session.data.sizeDetail})\nDate: ${session.data.moveDate}\nHelp: ${session.data.loadHelp}\nSpecial Items: ${session.data.specialItemList}\nReason: ${session.data.reason}`;

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

          return reply(quote, 13, ["Yes, Reserve My Move", "I Have More Questions First"]);
        } else {
          return reply("No problem! Go ahead and tell me what you’d like to add or update.");
        }
      case 13:
        if (userInput.includes("reserve")) {
          return reply("Great! Let’s get you booked. What’s your full name?", 14);
        }
        if (userInput.includes("questions")) {
          return reply("Of course! Please type your question below and I’ll assist you.", 15);
        }
        break;
      case 14:
        session.data.name = userInput;
        return reply("Thanks! What’s your email address?", 16);
      case 16:
        session.data.email = userInput;
        return reply("And your phone number?", 17);
      case 17:
        session.data.phone = userInput;
        return reply("What’s the pickup address?", 18);
      case 18:
        session.data.pickup = userInput;
        return reply("And the delivery address?", 19);
      case 19:
        session.data.dropoff = userInput;

        const stripeLink = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";
        await fetch("https://hooks.slack.com/services/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", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `*New Move Lead*\nName: ${session.data.name}\nEmail: ${session.data.email}\nPhone: ${session.data.phone}\nFrom: ${session.data.pickup}\nTo: ${session.data.dropoff}\nDate: ${session.data.moveDate}\nSpace: ${session.data.spaceType} (${session.data.sizeDetail})\nQuote Flow: Completed\nStripe Link Sent: ✅`
          })
        });

        return reply(
          `Perfect! You can reserve your move now with the $85 deposit below. After payment, we’ll schedule your Move Review Call to finalize your flat rate.\n\nSTRIPE_LINK: ${stripeLink}`,
          999
        );
      case 15:
        const questionPrompt = `You are a professional moving concierge for MovingCo.\nAnswer the customer's freeform question helpfully, calmly, and professionally.`;
        const gptQResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              { role: "system", content: questionPrompt },
              { role: "user", content: message }
            ]
          })
        });

        const qData = await gptQResponse.json();
        const answer = qData.choices?.[0]?.message?.content?.trim() || "I'm here to help with anything you need.";

        return reply(answer, 13, ["Yes, Reserve My Move", "I Have More Questions First"]);
      default:
        return reply("I'm here to help whenever you're ready!");
    }
  } catch (error) {
    console.error("Critical error in chat handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}