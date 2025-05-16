
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required.' });
  }

  const systemPrompt = `
You are the MovingCo chatbot. Your job is to give long-distance moving quotes in two steps only:
Step 1: Recap the move in a clean, professional format like:
• Size: 3-bedroom home
• From: Allen, TX
• To: Phoenix, AZ
• Date: Next month
• Help: Loading & Unloading
• Special Items: Piano, pool table

Step 2: After a short pause, show the quote. Use this format:
Your long-distance quote is: $3,200–$3,800
This includes:
• Verified movers
• Flat-rate coordination
• Real support before and after the move
End there. Do not continue chatting. Do not ask questions. Respond with both parts in one reply, separated by a divider: ===QUOTE===
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
    const [recap, quote] = fullReply.split("===QUOTE===");

    return res.status(200).json({
      recap: recap?.trim() || "",
      quote: quote?.trim() || ""
    });

  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
