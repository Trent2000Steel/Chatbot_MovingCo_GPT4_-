
// FINAL CLEAN chat.js with separated buttons

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
    sessions[sessionId] = { phase: 0, data: {} };
  }

  const session = sessions[sessionId];

  function reply(message, phase, buttons = []) {
    session.phase = phase;
    return res.status(200).json({ message, buttons });
  }

  switch (session.phase) {
    case 0:
      return reply(
        "Welcome to MovingCo. I’m your MoveSafe quote concierge—skilled in long-distance coordination, pricing, and protection.
No forms, no waiting — I’ll give you a real quote right here in chat.
Where are you moving from?",
        1,
        ["Texas", "California", "New York", "Other (type)", "📖 How It Works"]
      );

    case 1:
      if (/^\d{5}$/.test(userInput)) {
        session.data.zip = userInput;
        return reply(`Got it, ZIP code ${userInput} — can you confirm the city and state just to be sure?`, 1);
      }
      if (userInput.toLowerCase().includes("how")) {
        return reply("We coordinate every part of your long-distance move, from packing to safe transport and unloading. You place a small deposit today, send us photos, and we finalize your guaranteed flat rate on a live Move Review Call.
👉 To get your quote, tell me: what city and state are you moving from?", 1);
      }
      session.data.origin = userInput;
      if (userInput.toLowerCase() === "other") {
        return reply("Please type your city and state:", 1.5);
      }
      return reply("Great! Where are you moving to?", 2, ["Texas", "California", "Arizona", "Other (type)"]);

    case 1.5:
      session.data.origin = userInput;
      return reply("Great! Where are you moving to?", 2, ["Texas", "California", "Arizona", "Other (type)"]);

    case 2:
      if (/^\d{5}$/.test(userInput)) {
        session.data.zip = userInput;
        return reply(`Got it, ZIP code ${userInput} — can you confirm the city and state just to be sure?`, 2);
      }
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
      return reply("What’s the reason for your move?", 8, ["Job", "Family", "Fresh start", "Other"]);

    case 8:
      session.data.reason = userInput;
      const spaceIcon =
        session.data.spaceType.toLowerCase().includes("apartment")
          ? "🏢"
          : session.data.spaceType.toLowerCase().includes("storage")
          ? "📦"
          : session.data.spaceType.toLowerCase().includes("office")
          ? "💼"
          : "🏠";
      const recap = `📍 From: ${session.data.origin} → ${session.data.destination}
${spaceIcon} Space: ${session.data.sizeDetail}
📅 Move Date: ${session.data.moveDate}
💪 Help: ${session.data.helpType}
🛡️ Special Items: ${session.data.specialItems}
💬 Reason: ${session.data.reason}`;
      return reply(`Here’s what I’m preparing your quote on:
${recap}
✅ Ready?`, 9, ["✅ Yes, Show Me My Estimate", "✏️ Wait, I Need to Update Something"]);

    case 9:
      if (userInput.toLowerCase().includes("update")) {
        return reply("No problem! What would you like to change or update?", 1);
      }
      return reply("📝 Official Estimate
✅ Estimated Range: $500–$800
✅ Flat rate available after reservation + photo review.", 10, ["✅ Reserve My Move", "📖 Learn How It Works"]);

    case 10:
      if (userInput.toLowerCase().includes("learn")) {
        return reply("We coordinate every part of your long-distance move — packing, loading, safe transport, unloading. Place a small deposit today, send us a few photos, and we finalize your flat rate on a live Move Review Call.", 10);
      }
      return reply("Great! To reserve your move, we collect a fully refundable $85 deposit. After booking, you’ll send us a few photos so we can confirm your flat rate on the Move Review Call.
What’s your full name?", 11);

    case 11:
      session.data.name = userInput;
      return reply("Thanks! What’s your email address?", 12);

    case 12:
      session.data.email = userInput;
      return reply("Got it! What’s your phone number?", 13);

    case 13:
      session.data.phone = userInput;
      return reply("What’s the pickup address?", 14);

    case 14:
      session.data.pickup = userInput;
      return reply("And the delivery address?", 15);

    case 15:
      session.data.dropoff = userInput;

      const slackMessage = `New MovingCo Lead:
Name: ${session.data.name}
Email: ${session.data.email}
Phone: ${session.data.phone}
From: ${session.data.origin} → ${session.data.destination}
Space: ${session.data.spaceType} (${session.data.sizeDetail})
Date: ${session.data.moveDate}
Help: ${session.data.helpType}
Special Items: ${session.data.specialItems}
Reason: ${session.data.reason}
Pickup: ${session.data.pickup}
Dropoff: ${session.data.dropoff}`;
      sendToSlack(slackMessage);

      const stripeLink = "https://buy.stripe.com/your-link";
      return reply(`💳 To reserve your move, complete your $85 deposit here: ${stripeLink}`, 999);

    default:
      return reply("Hmm, looks like we got a bit mixed up. Let’s start fresh — where are you moving from?", 0, ["Texas", "California", "New York", "Other (type)", "📖 How It Works"]);
  }
}
