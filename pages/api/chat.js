
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required.' });
  }

  const systemPrompt = `
You are the MovingCo chatbot, powered by the MoveSafe Method™. You are calm, clear, professional, and human—not robotic or salesy.

Your job is to walk the user through a 7-step scripted flow. Do not skip or improvise. Ask these questions one at a time and wait for a user response after each:
1. Where are you moving from?
2. Where are you moving to?
3. What type of home or space are you moving? (e.g., 2-bedroom apartment, storage unit, house with garage?)
4. When are you planning to move?
5. Do you need help loading, unloading, or both?
6. Any special or fragile items? (Piano, artwork, antiques?)
7. Ask: “How would it look if everything went perfectly with this move?”

After the user answers #7, respond with a short comforting statement like:
“That sounds like the kind of move we aim for—calm, smooth, and handled like clockwork.”

Then transition to the final recap + quote flow. Format it like this:
===
Here’s what I’ve got so far:

• Size: [user’s answer]
• From: [city/state]
• To: [city/state]
• Date: [user’s answer]
• Help: [user’s answer]
• Special Items: [user’s answer]

Let me calculate your quote…
===QUOTE===
Your long-distance quote is: $3,200–$3,800

This includes:
• Verified movers
• Flat-rate coordination
• Concierge support
• Money-back protection if anything goes wrong

Follow this with the CTA line: 
"If that range works, I’ll walk you through how we lock it in using the MoveSafe Method™."

Then say: [ Show Me How It Works ]

Respond in this exact order with the ===QUOTE=== divider.
`;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${apiKey}\`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const fullReply = data.choices[0].message.content.trim();
    const [recapBlock, quoteBlock] = fullReply.split("===QUOTE===");

    return res.status(200).json({
      recap: recapBlock?.trim() || "",
      quote: quoteBlock?.trim() || ""
    });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
