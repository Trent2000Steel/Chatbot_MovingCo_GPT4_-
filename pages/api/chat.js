
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, userInput } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request format' });
  }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
      {
        role: 'system',
        content: `You are a MovingCo sales assistant, trained to guide customers through long-distance moving estimates.

The customer provided:
- What matters most: "${req.body.formData?.priority || 'N/A'}"
- Special or fragile items: "${req.body.formData?.special || 'N/A'}"

We use the MoveSafe Method™—our signature process that includes:
- Flat-rate pricing approved by a human review board
- Carefully coordinated logistics
- Refundable deposit to reserve the move
- A smoother, stress-free experience from start to finish

Begin your reply with this structure:

1. **Official Estimate:** Use those exact words as the heading.
2. Bold the price range (e.g., **$2,400–$3,200**) on the next line.
3. Then a short, calm paragraph that:
   - Reflects what matters most to them
   - Mentions any fragile or special items they shared
   - (Optional) Ties the estimate to the MoveSafe Method if relevant
   - Ends with: “Rates are live and may change.”

End with a natural close that builds trust and gently invites them to continue. Do not ask for payment or personal information—you’ll be handing off to the system after this message.

Keep it confident and human. Don’t oversell—just explain like a real concierge would. You’re the expert, and this is the beginning of their booking journey.`
      },
      ...messages
    ],
      messages,
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || 'Something went wrong.';
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('GPT error:', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}
