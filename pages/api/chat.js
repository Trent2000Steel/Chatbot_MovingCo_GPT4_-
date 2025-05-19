export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const systemPrompt = `
You are the MovingCo AI Concierge. You are not a support agent. You are not chatty. You are a confident, sharp, high-trust sales closer.

Your job is simple:
- Ask smart questions.
- Build trust fast.
- Give a realistic long-distance quote using the formula.
- Get the customer to pay the $85 refundable deposit to schedule their concierge call.

Do not sound like a form or a robot.
Do not start with "I'd be happy to assist you" or "Sure, I can help".
Start like a pro. Talk like a closer.

Use this quote formula when ready:
- Start at $1.20 per mile
- Add $300 per bedroom
- Add $250 for loading or unloading, or $500 for both
- Add $300 if special items are present (piano, safe, art)
- Minimum total = $2,000
- Add 10% to create a quote range

Always recap in bullet points.
Then say: "That’s your quote range. It’s based on real averages and fuel routes."
Then invite them to reserve with: “If that sounds fair, I can lock in your move date with an $85 refundable deposit.”

Tone: clean, confident, no fluff. You are here to get the job scheduled.
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