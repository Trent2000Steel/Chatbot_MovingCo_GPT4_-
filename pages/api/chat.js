// SYSTEM GUARDRAIL: Avoid promising insurance, refunds, or guaranteed outcomes.
// Focus on verified coordination, flat-rate quotes after review, and optional damage reimbursement—not protection.
// Keep answers short, professional, and sales psychology driven.


import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sessions = {};

const fallbackKeywords = ["damage", "broken", "refund", "cancel", "late", "delay", "expensive", "price", "insurance", "safe", "trust"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { sessionId, userInput } = req.body;
  if (!sessions[sessionId]) {
    sessions[sessionId] = { phase: 1, data: {} };
  }

  const session = sessions[sessionId];

  function reply(message, phase, buttons = []) {
    session.phase = phase;
    return res.status(200).json({ message, buttons, phase });
  }

  const lowerInput = userInput.toLowerCase();
  if (fallbackKeywords.some(keyword => lowerInput.includes(keyword))) {
    try {
      const fallbackPrompt = `You are a MovingCo sales agent. The customer has asked about a key concern (such as damage, refunds, delays, price, or safety). Respond in ONLY 1–2 short sentences, calm and professional, and gently guide them back to completing their booking.`;

      const fallbackCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'system', content: fallbackPrompt }, { role: 'user', content: userInput }],
      });

      const fallbackResponse = fallbackCompletion.choices[0].message.content.trim();
      return reply(`${fallbackResponse}`, session.phase);
    } catch (error) {
      console.error('GPT fallback error:', error);
      return reply("Sorry, something went wrong answering that. Please try again.", session.phase);
    }
  }

  if (userInput === "start_chat") {
    return reply(
      `Welcome to MovingCo. I'm your MoveSafe quote concierge -- skilled in long-distance coordination, pricing, and protection.
No forms, no waiting -- I'll give you a real quote right here in chat.
Where are you moving from?`,
      1,
      ["Texas", "California", "New York", "Other", "📖 How It Works"]
    );
  }

  switch (session.phase) {
    case 1:
      if (userInput === "Other") return reply("Got it — please type the state you’re moving from:", 1);
      if (userInput.includes("How It Works")) {
        return reply(
          "We coordinate your long-distance move with verified movers, a guaranteed flat rate, and full support from start to finish. You only pay after approval. Ready to start your quote?",
          1,
          ["Texas", "California", "New York", "Other"]
        );
      }
      if (!session.data.originState) {
        session.data.originState = userInput;
        return reply("Great! What’s the city you’re moving from?", 1.5);
      } else {
        return reply("You've already provided the state. Let's continue.", 1.5);
      }

    case 1.5:
      if (userInput === "Other") {
        return reply("Got it — please type the city you’re moving from:", 1.5);
      }
      if (session.phase === 1.5) {
  session.data.originCity = userInput.trim();
  return reply("Where are you moving to?", 2, ["Texas", "California", "Arizona", "Other"]);
        session.data.originCity = userInput;
        return reply("Where are you moving to?", 2, ["Texas", "California", "Arizona", "Other"]);
      } else {
        return reply("You've already provided the origin city. Let's move on.", 2, ["Texas", "California", "Arizona", "Other"]);
      }

    case 2:
      if (userInput === "Other") {
        return reply("Got it — please type the state you’re moving to:", 2);
      }
      if (!session.data.destinationState) {
        session.data.destinationState = userInput;
        return reply("And what’s the city you’re moving to?", 2.5);
      } else {
        return reply("You've already provided the destination state. Let's continue.", 2.5);
      }

    case 2.5:
      if (userInput === "Other") {
        return reply("Got it — please type the city you’re moving to:", 2.5);
      }
      if (!session.data.destinationCity) {
        session.data.destinationCity = userInput;
        return reply("Awesome! What type of space are you moving?", 3, ["🏢 Apartment", "📦 Storage Unit", "💼 Office", "🏠 Home"]);
      } else {
        return reply("You've already provided the destination city. Let's continue.", 3, ["🏢 Apartment", "📦 Storage Unit", "💼 Office", "🏠 Home"]);
      }

        case 3:
      session.data.spaceType = userInput;
      return reply("How many bedrooms or unit size?", 4, ["1", "2", "3", "4+"]);

case 4:
      session.data.sizeDetail = userInput;
      return reply("Do you know your move date?", 5, ["📅 I Know My Date", "🤷‍♂️ Not Sure Yet"]);

    case 5:
      if (userInput.includes("I Know My Date")) {
        return reply("Great! Please type your move date (e.g., June 15, 2025).", 5.5);
      }
      session.data.moveDate = userInput;
      return reply("Will you need help with loading and unloading?", 6, ["Load only", "Unload only", "Both"]);

    case 5.5:
      session.data.moveDate = userInput;
      return reply("Will you need help with loading and unloading?", 6, ["Load only", "Unload only", "Both"]);

    case 6:
      session.data.helpType = userInput;
      return reply("Any special or fragile items (like TVs, pianos, artwork)?", 7);

    
    case 7:
      session.data.specialItems = userInput;
      return reply("Ready for your estimate?", 9, ["✅ Run My Estimate"]);

    
    case 9:
      

      if (true) {  // Trigger quote on any input
        try {
          const quotePrompt = `You are a MovingCo sales agent. Based on the following customer details, generate a realistic, market-informed estimated moving cost range, similar to what top U.S. moving companies would provide. Exclude packing services unless explicitly requested. Lean slightly low to avoid sticker shock, but stay professional and credible. Only provide the price range and a one-sentence explanation.
Details: ${JSON.stringify(session.data)}`;

          const quoteCompletion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'system', content: quotePrompt }],
          });

          const estimate = quoteCompletion.choices[0].message.content.trim();
        session.data.estimate = estimate;
          return reply(`📝 Official Estimate
${estimate}
✅ Flat rate available after reservation + photo review.`, 10, ["✅ Reserve My Move", "💬 I Have More Questions"]);
        } catch (error) {
          console.error('GPT quote error:', error);
          return reply("Sorry, something went wrong generating your estimate. Please try again.", 9);
        }
      }

      return reply("Ready for your estimate?", 9, ["✅ Run My Estimate"]);

    case 10:
      if (userInput.includes("I Have More Questions")) {
        return reply("Sure! I'm here to answer anything — go ahead and type your question.", "gpt_rebuttal");
      }
            return reply("Great! To reserve your move, we collect a fully refundable $85 deposit. What is your full name?", 11);

    


case "gpt_rebuttal":
  if (!session.data.rebuttalCount) session.data.rebuttalCount = 1;
  else session.data.rebuttalCount++;

  const lowerQ = userInput.toLowerCase();
  if (lowerQ.includes("email") || lowerQ.includes("quote") || lowerQ.includes("summary") || lowerQ.includes("call")) {
    return reply("Our pricing updates daily to stay competitive, so we don’t send quote summaries. Everything is handled live here—just return anytime to restart your move.", 10, ["✅ Ready to Reserve"]);
  }

  if (session.data.rebuttalCount > 5) {
    return reply("That’s all I can cover here in chat—thanks for talking it through! You can lock in your move now and go over the rest during your MoveSafe Call.", 10, ["✅ Ready to Reserve"]);
  }

  try {
    const chatPrompt = `You are a MovingCo sales rep. Respond in 2–3 complete sentences, focused on building trust and guiding the customer toward reserving. Never promise insurance, guarantees, refunds, or timing. If asked about damage or protection, explain that MovingCo offers optional Premium Move Coverage™—a limited reimbursement program for pre-declared items, not insurance. Avoid the words ‘insured,’ ‘covered,’ or ‘guaranteed.’ Clarify that MovingCo is not a moving company, carrier, or broker—we coordinate moves with verified movers. Do not claim to be bonded. If asked about delays, emphasize coordination and support, but never promise timing or compensation. Always invite the customer to continue with their reservation.`;

    const moveSummary = `
Customer is moving from ${session.data.originCity}, ${session.data.originState} to ${session.data.destinationCity}, ${session.data.destinationState}.
Size: ${session.data.sizeDetail || "Not specified"}.
Move date: ${session.data.moveDate || "Not specified"}.
Help type: ${session.data.helpType || "Not specified"}.
Estimate given: ${session.data.estimate || "Not yet generated"}.
`;

    const rebuttalCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: chatPrompt },
        { role: 'assistant', content: moveSummary.trim() },
        { role: 'user', content: userInput }
      ],
      max_tokens: 180
    });

    const rebuttal = rebuttalCompletion.choices[0].message.content.trim();
    return reply(`${rebuttal}`, 10, ["✅ Ready to Reserve"]);
  } catch (error) {
    console.error('GPT rebuttal error:', error);
    return reply("Sorry, something went wrong answering that. Please try again.", "gpt_rebuttal");
  }


    case 11:
      session.data.name = userInput;
      return reply("Thanks! What is your email address?", 12);

    case 12:
      session.data.email = userInput;
      return reply("Got it! What is your phone number?", 13);

    case 13:
      session.data.phone = userInput;
      return reply("What is the pickup address?", 14);

    case 14:
      session.data.pickup = userInput;
      return reply("And the delivery address?", 15);

    case 15:
      session.data.dropoff = userInput;

      // 🛎️ Send Telegram alert before Stripe link
      try {
        const response = await fetch('https://trustmovingco.com/api/send-telegram-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: session.data.name,
            email: session.data.email,
            phone: session.data.phone,
            moveDate: session.data.moveDate || "Not specified",
            origin: session.data.originCity + ", " + session.data.originState,
            destination: session.data.destinationCity + ", " + session.data.destinationState,
            size: session.data.sizeDetail,
            specialItems: session.data.specialItems,
            quote: session.data.estimate || "Not generated",
            transcript: Object.entries(session.data).map(([key, val]) => `${key}: ${val}`).join("\n")
          }),
        });

        if (!response.ok) {
          console.error("Telegram alert failed");
        }
      } catch (err) {
        console.error("Telegram alert error:", err);
      }

      
      session.data.dropoff = userInput;
      const stripeLink = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";
      return reply(`💳 To reserve your move, please complete your $85 deposit using the button below.`, 999);

    default:
      return reply("Hmm, looks like we got a bit mixed up. Let's start fresh -- where are you moving from?", 1, ["Texas", "California", "New York", "Other", "📖 How It Works"]);
  }
}
