let sessions = {};


export default async function handler(req, res) {
  console.log("API hit at /api/chat");
  console.log("Request body:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId, message } = req.body;
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      phase: 0,
      data: {}
    };
  }

  const session = sessions[sessionId];
  const userInput = (message || '').trim();

  const next = (text, phase = null, buttons = null) => {
    if (phase !== null) session.phase = phase;
    return res.status(200).json({
      reply: text,
      buttons
    });
  };

  switch (session.phase) {
    case 0:
      session.phase = 1;
      return next("Welcome to MovingCo. I’m your MoveSafe quote concierge—skilled in long-distance coordination, pricing, and protection.\n\nNo forms. No waiting. I’ll give you a real quote right here in chat.\n\nWhere are you moving from?");
    case 1:
      session.data.origin = userInput;
      session.phase = 2;
      return next("Great! And where are you moving to?");
    case 2:
      session.data.destination = userInput;
      session.phase = 3;
      return next("Fantastic. What’s the size of your home? (e.g. 2-bedroom apartment)");
    case 3:
      session.data.homeSize = userInput;
      session.phase = 4;
      return next("Got it. What date are you planning to move?");
    case 4:
      session.data.moveDate = userInput;
      session.phase = 5;
      return next("Will you need help with loading and unloading?", 5, ["Yes", "No", "Just loading", "Just unloading"]);
    case 5:
      session.data.loadHelp = userInput;
      session.phase = 6;
      return next("Any special or fragile items? (TVs, artwork, instruments, etc.)");
    case 6:
      session.data.specialItems = userInput;
      session.phase = 7;
      return next("What’s the reason for your move? (Job relocation, fresh start, etc.)");
    case 7:
      session.data.reason = userInput;
      session.phase = 8;
      return next(
        `Let’s recap your move:\n
- Origin: ${session.data.origin}
- Destination: ${session.data.destination}
- Home Size: ${session.data.homeSize}
- Move Date: ${session.data.moveDate}
- Load/Unload Help: ${session.data.loadHelp}
- Special Items: ${session.data.specialItems}
- Reason: ${session.data.reason}\n
Does everything look right?`, 8, ["Yes, Looks Good", "No, Needs Fixing"]
      );
    case 8:
      if (/yes/i.test(userInput)) {
        session.phase = 9;
        return next("Great! Are you ready for me to run your estimate now?", 9, ["Yes, Run the Estimate", "Not Yet"]);
      } else {
        return next("No problem—just tell me what you'd like to update.");
      }
    case 9:
      if (/yes/i.test(userInput)) {
        session.phase = 10;

        const systemPrompt = `You are a professional moving concierge for MovingCo.\n
You’ve booked thousands of long-distance moves using the MoveSafe Method™.\n
Your tone is calm, helpful, and experienced—not robotic or pushy.\n
You estimate quotes based on move size, distance, and past data—leaning slightly low to avoid sticker shock.\n
You always mention that flat rates are confirmed after the Move Review Call.\n
Never promise insurance or carrier liability.\n
End with:\n
[CTA] Yes, Reserve My Move | I Have More Questions First`;

        const userPrompt = `Move details:\n
- From: ${session.data.origin}
- To: ${session.data.destination}
- Home Size: ${session.data.homeSize}
- Date: ${session.data.moveDate}
- Help: ${session.data.loadHelp}
- Special Items: ${session.data.specialItems}
- Reason: ${session.data.reason}\n
Generate an estimated price range using realistic examples and the MoveSafe Method.`;

        try {
          
console.log("Calling GPT...");
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
console.log('GPT raw response:', data);
          const quoteText = data.choices[0].message.content.trim();
          session.phase = 11;
          return next(quoteText, 11, ["Yes, Reserve My Move", "I Have More Questions First"]);
        } catch (err) {
          console.error("Quote fetch failed", err);
          return next("Something went wrong while generating your quote. Please try again later.");
        }
      } else {
        return next("No worries—let me know when you're ready.");
      }
    default:
      return next("I'm here to help whenever you're ready!");
  }
}