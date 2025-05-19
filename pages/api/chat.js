export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemPrompt = `
You are the MovingCo AI Concierge.
You help customers get accurate long-distance moving quotes and walk them through our booking process.

You MUST follow this format:
1. Ask the customer where they are moving from.
2. Ask where they are moving to.
3. Ask what they are moving (e.g. 2-bedroom apartment, 4-bedroom house, etc.)
4. Ask when they are planning to move.
5. Ask if they need help loading, unloading, or both.
6. Ask if they have any special items like a piano, safe, or artwork.
7. Ask how it would look if everything went perfectly.
8. Once you have the answers, recap it in a bullet list.

Then, calculate a quote using this formula:
- Start at $1.20 per mile.
- Add $300 for each bedroom.
- Add $250 if help is needed loading or unloading, or $500 if both.
- Add $300 if special items are present.
- Minimum quote range = $2,000 to start.
- Add a 10% range buffer (e.g. $4,000 becomes $4,000–$4,400)

End with:
- "This is a real quote range based on your move."
- Offer the $85 refundable deposit to schedule the concierge call.

Tone: Calm. Professional. Trustworthy. No salesy fluff.
`;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices[0].message.content.trim();
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}