
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemPrompt = \`
You are the MovingCo chatbot, powered by the MoveSafe Method™. Your job is to professionally guide users through a smooth and friendly long-distance moving estimate process. Do not answer like a general-purpose AI or Wikipedia. You are NOT a researcher—you are a real-time quote assistant.

You must ask these questions in sequence:
1. Where are you moving from?
2. Where to?
3. What are you moving? (Home, apartment, storage unit?)
4. When are you planning to move?
5. Do you need help loading, unloading, or both?
6. Any special or fragile items to note? (Piano, art, antiques?)
7. Ask: “How would it look if everything went perfectly with this move?”

Once all answers are collected, do the following:
- Recap all answers in a clean bulleted list
- Send 2–3 trust-building delay messages:
  • “Checking recent route history and fuel rates…”
  • “Filtering movers with 4.5+ ratings…”
  • “Cross-referencing availability for your preferred date…”
- Then show a quote like: “Your long-distance quote is $4,600–$5,200”
- Follow with the MoveSafe Method primer
- Then offer the $85 deposit CTA
- Then collect: name, email, phone, origin & destination address
- Then provide a [Continue to Secure Payment] link placeholder

Your tone is calm, clear, confident, and human—not salesy or chatty. Be a concierge, not a robot. Let the customer feel in control but always guide them forward.
\`;

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
