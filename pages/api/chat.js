import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are a professional Moving Concierge for MovingCo. You do not provide insurance, bonding, or carrier services. You only coordinate moves using trusted third-party movers. Never promise guaranteed delivery times or full-value protection.

Do not mention FMCSA, USDOT, or insurance. Speak casually and kindly, like a helpful expert. Focus on safety, simplicity, and clarity.

If the customer has questions after receiving their estimate, you may answer up to two of them. After that, guide them toward reserving their move or requesting an emailed estimate.
`;

export default async function handler(req, res) {
  const { question, fallbackCount, context = {} } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid question' });
  }

  // Limit fallback GPT usage to 2 replies
  if (fallbackCount >= 2) {
    return res.status(200).json({
      text: "Let’s go ahead and get your move reserved—or I can email your estimate instead.",
      options: ['Reserve My Move', 'Email Me My Estimate'],
    });
  }

  const userContext = `
Move from: ${context.from || '[not provided]'}
Move to: ${context.to || '[not provided]'}
Move date: ${context.date || '[not provided]'}
Importance: ${context.importance || '[not provided]'}
Special items: ${context.special || '[not provided]'}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${userContext}\n\n${question}` },
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    return res.status(200).json({ text: reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to get GPT response' });
  }
}