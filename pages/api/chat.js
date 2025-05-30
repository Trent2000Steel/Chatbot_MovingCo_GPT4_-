
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sessions = {};
const slackWebhookUrl = 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK';

const fallbackKeywords = ["damage", "broken", "refund", "cancel", "late", "delay", "expensive", "price", "insurance", "safe", "trust"];

async function sendToSlack(message) {
  try {
    await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  } catch (error) {
    console.error('Failed to send to Slack:', error);
  }
}

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
    return res.status(200).json({ message, buttons });
  }

  // Check if off-script keyword is present
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
Where are you moving from? (please type city + state)`,
      1
    );
  }

  switch (session.phase) {
    case 1:
      session.data.originFull = userInput;
      return reply("Great! Where are you moving to? (please type city + state)", 2);

    case 2:
      session.data.destinationFull = userInput;
      return reply("Awesome! What type of space are you moving?", 3, ["🏢 Apartment", "📦 Storage Unit", "💼 Office", "🏠 Home"]);

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
      return reply("What is the reason for your move?", 8, ["Job", "Family", "Fresh start", "Other"]);

    case 8:
      session.data.reason = userInput;
      const recap = `📍 From: ${session.data.originFull} → ${session.data.destinationFull}
🏠 Space: ${session.data.sizeDetail}
📅 Move Date: ${session.data.moveDate}
💪 Help: ${session.data.helpType}
🛡️ Special Items: ${session.data.specialItems}
💬 Reason: ${session.data.reason}`;
      return reply(`Here is what I'm preparing your quote on:
${recap}
✅ Ready?`, 9, ["✅ Yes, Show Me My Estimate", "✏️ Wait, I Need to Update Something"]);

    case 9:
      if (userInput.toLowerCase().includes("update")) {
        return reply("No problem! What would you like to change or update?", 1);
      }
      try {
        const quotePrompt = `You are a MovingCo sales agent. Based on the following customer details, generate a realistic, market-informed estimated moving cost range, similar to what top U.S. moving companies would provide. Lean slightly low to avoid sticker shock, but stay professional and credible. Only provide the price range and a one-sentence explanation.
Details: ${JSON.stringify(session.data)}`;

        const quoteCompletion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'system', content: quotePrompt }],
        });

        const estimate = quoteCompletion.choices[0].message.content.trim();
        return reply(`📝 Official Estimate
${estimate}
✅ Flat rate available after reservation + photo review.`, 10, ["✅ Reserve My Move", "📖 Learn How It Works", "💬 I Have More Questions"]);
      } catch (error) {
        console.error('GPT quote error:', error);
        return reply("Sorry, something went wrong generating your estimate. Please try again.", 9);
      }

    case 10:
      if (userInput.includes("I Have More Questions")) {
        return reply("Sure! I'm here to answer anything — go ahead and type your question.", "gpt_rebuttal");
      }
      if (userInput.toLowerCase().includes("learn")) {
        return reply(`We coordinate every part of your long-distance move -- packing, loading, safe transport, unloading. Place a small deposit today, send us photos, and we finalize your flat rate on a live Move Review Call.`, 10);
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

      const slackMessage = `New MovingCo Lead:
${JSON.stringify(session.data, null, 2)}`;
      sendToSlack(slackMessage);

      const stripeLink = "https://buy.stripe.com/your-link";
      return reply(`💳 To reserve your move, please complete your $85 deposit here: ${stripeLink}`, 999);

    default:
      return reply("Hmm, looks like we got a bit mixed up. Let's start fresh -- where are you moving from? (please type city + state)", 1);
  }
}
