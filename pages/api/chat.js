
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sessions = {};
const slackWebhookUrl = 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK';

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
    sessions[sessionId] = { phase: 0, data: {}, history: [] };
  }

  const session = sessions[sessionId];
  session.history.push({ role: "user", content: userInput });

  function reply(message, phase, buttons = []) {
    session.phase = phase;
    return res.status(200).json({ message, buttons });
  }

  // Simple fallback: if customer says something like "what's your coverage" or raises an objection
  const gptFallbackPhases = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  if (gptFallbackPhases.includes(session.phase)) {
    try {
      const gptSystemPrompt = `You are a MovingCo sales agent. You guide customers through a structured moving quote process, but you are smart enough to handle side questions, objections, or skipped steps. If they ask about insurance, pricing, timing, or other concerns, answer calmly and guide them back to the next required phase.`;

      const gptCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: gptSystemPrompt },
          ...session.history.slice(-10).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: `Current phase: ${session.phase}, collected data: ${JSON.stringify(session.data)}` }
        ],
      });

      const assistantReply = gptCompletion.choices[0].message.content;
      session.history.push({ role: "assistant", content: assistantReply });
      return res.status(200).json({ message: assistantReply });
    } catch (error) {
      console.error('GPT fallback error:', error);
    }
  }

  switch (session.phase) {
    case 0:
      return reply(
        `Welcome to MovingCo. I'm your MoveSafe quote concierge -- skilled in long-distance coordination, pricing, and protection.
No forms, no waiting -- I'll give you a real quote right here in chat.
Where are you moving from?`,
        1,
        ["Texas", "California", "New York", "Other (type)", "📖 How It Works"]
      );

    case 1:
      session.data.origin = userInput;
      if (userInput.toLowerCase() === "other") {
        return reply("Please type your city and state:", 1.5);
      }
      return reply("Great! Where are you moving to?", 2, ["Texas", "California", "Arizona", "Other (type)"]);

    case 1.5:
      session.data.origin = userInput;
      return reply("Great! Where are you moving to?", 2, ["Texas", "California", "Arizona", "Other (type)"]);

    case 2:
      session.data.destination = userInput;
      if (userInput.toLowerCase() === "other") {
        return reply("Please type your destination city and state:", 2.5);
      }
      return reply("Awesome! What type of space are you moving?", 3, ["🏢 Apartment", "📦 Storage Unit", "💼 Office", "🏠 Home"]);

    case 2.5:
      session.data.destination = userInput;
      return reply("Awesome! What type of space are you moving?", 3, ["🏢 Apartment", "📦 Storage Unit", "💼 Office", "🏠 Home"]);

    case 3:
      session.data.spaceType = userInput;
      return reply("How many bedrooms or unit size?", 4);

    case 4:
      session.data.sizeDetail = userInput;
      return reply("Do you know your move date?", 5, ["📅 I Know My Date", "🤷‍♂️ Not Sure Yet"]);

    case 5:
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
      const recap = `📍 From: ${session.data.origin} → ${session.data.destination}
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
        const quotePrompt = `You are a MovingCo sales agent. Based on the following details, generate a realistic, market-accurate estimated moving cost range, leaning slightly low to avoid sticker shock, but staying credible. Details: ${JSON.stringify(session.data)}`;

        const quoteCompletion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'system', content: quotePrompt }],
        });

        const estimate = quoteCompletion.choices[0].message.content;
        session.history.push({ role: "assistant", content: estimate });
        return reply(`📝 Official Estimate
${estimate}
✅ Flat rate available after reservation + photo review.`, 10, ["✅ Reserve My Move", "📖 Learn How It Works"]);
      } catch (error) {
        console.error('GPT quote error:', error);
        return reply("Sorry, something went wrong generating your estimate. Please try again.", 9);
      }

    case 10:
      if (userInput.toLowerCase().includes("learn")) {
        return reply(`We coordinate every part of your long-distance move -- packing, loading, safe transport, unloading. Place a small deposit today, send us photos, and we finalize your flat rate on a live Move Review Call.`, 10);
      }
      return reply("Great! To reserve your move, we collect a fully refundable $85 deposit. What is your full name?", 11);

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
      return reply(`💳 To reserve your move, complete your $85 deposit here: ${stripeLink}`, 999);

    default:
      return reply("Hmm, looks like we got a bit mixed up. Let's start fresh -- where are you moving from?", 0, ["Texas", "California", "New York", "Other (type)", "📖 How It Works"]);
  }
}
