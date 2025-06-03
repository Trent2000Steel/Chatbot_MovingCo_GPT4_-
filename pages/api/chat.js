
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
      if (userInput.includes("How It Works")) {
        return reply(
          "We coordinate your long-distance move with verified movers, a guaranteed flat rate, and full support from start to finish. You only pay after approval. Ready to start your quote?",
          1,
          ["Texas", "California", "New York", "Other"]
        );
      }
      if (userInput === "Other") {
        return reply("No problem — just type your state below.", 1);
    }
    if (!session.data.originState) {
        session.data.originState = userInput;
        return reply("Great! What’s the city you’re moving from?", 1.5);
      } else {
        return reply("You've already provided the state. Let's continue.", 1.5);
      }

    case 1.5:
      if (!session.data.originCity) {
        session.data.originCity = userInput;
        return reply("Where are you moving to?", 2, ["Texas", "California", "Arizona", "Other"]);
      } else {
        return reply("You've already provided the origin city. Let's move on.", 2, ["Texas", "California", "Arizona", "Other"]);
      }

    case 2:
      if (userInput === "Other") {
        return reply("Got it — what state are you moving to?", 2);
    }
    if (!session.data.destinationState) {
        session.data.destinationState = userInput;
        return reply("And what’s the city you’re moving to?", 2.5);
      } else {
        return reply("You've already provided the destination state. Let's continue.", 2.5);
      }

    case 2.5:
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
      return reply("", 8, ["Job", "Family", "Fresh start", "Other"]);

    case 9:
      if (userInput.toLowerCase().includes("update")) {
        session.phase = "update_pending";
        return reply("No problem! What would you like to change or update?", "update_pending");
    }
        return reply("No problem! What would you like to change or update?", 1);
      }
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const quotePrompt = `You are a MovingCo sales agent. Based on the following customer details, generate a realistic, market-informed estimated moving cost range, similar to what top U.S. moving companies would provide. Exclude packing services unless explicitly requested. Lean slightly low to avoid sticker shock, but stay professional and credible. Only provide the price range and a one-sentence explanation.
Details: ${JSON.stringify(session.data)}`;

        const quoteCompletion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'system', content: quotePrompt }],
        });

        const estimate = quoteCompletion.choices[0].message.content.trim();
        await reply("⏳ Calculating your quote...", session.phase);
        return reply(`📝 Official Estimate
${estimate}
✅ Flat rate available after reservation + photo review.`, 10, ["✅ Reserve My Move", "💬 I Have More Questions"]);
      } catch (error) {
        console.error('GPT quote error:', error);
        return reply("Sorry, something went wrong generating your estimate. Please try again.", 9);
      }

    case 10:
      if (userInput.includes("I Have More Questions")) {
        return reply("Sure! I'm here to answer anything — go ahead and type your question.", "gpt_rebuttal");
      }
      if (userInput.toLowerCase().includes("learn")) {
        return reply(`We coordinate every part of your long-distance move -- loading, safe transport, unloading (packing is excluded unless specifically arranged). Place a small deposit today, send us photos, and we finalize your flat rate on a live Move Review Call.`, 10);
      }
      return reply("Great! To reserve your move, we collect a fully refundable $85 deposit. What is your full name?", 11);

    case "gpt_rebuttal":
      try {
        const chatPrompt = `You are a MovingCo sales agent. The customer has additional questions or concerns. Answer calmly, helpfully, and professionally, and invite them back to complete their reservation when ready.`;

        const rebuttalCompletion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'system', content: chatPrompt }, { role: 'user', content: userInput }],
        });

        const rebuttal = rebuttalCompletion.choices[0].message.content.trim();
        return reply(`${rebuttal}`, 10, ["✅ Ready to Reserve", "❌ I'm Not Ready Yet"]);
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
      const stripeLink = "https://buy.stripe.com/eVqbJ23Px8yx4Ab2aUenS00";
      return reply(`💳 To reserve your move, please complete your $85 deposit using the button below.`, 999);

    
    case "update_pending":
      const updateInput = userInput.toLowerCase();
      if (updateInput.includes("date")) session.data.moveDate = userInput;
      else if (updateInput.includes("city") || updateInput.includes("from")) session.data.originCity = userInput;
      else if (updateInput.includes("to")) session.data.destinationCity = userInput;
      else if (updateInput.includes("size") || updateInput.includes("bedroom")) session.data.sizeDetail = userInput;
      else if (updateInput.includes("help")) session.data.helpType = userInput;
      else if (updateInput.includes("item")) session.data.specialItems = userInput;
      session.phase = 9;
      return reply("Got it — I've updated your info. Recalculating now…", 9);

    default:
      return reply("Hmm, looks like we got a bit mixed up. Let's start fresh -- where are you moving from?", 1, ["Texas", "California", "New York", "Other", "📖 How It Works"]);
  }
}
