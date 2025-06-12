
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

  const fallbackKeywords = [
    'insurance', 'bonded', 'guarantee', 'money back', 'scam', 'safe', 'protection',
    'refund', 'damage', 'damaged', 'break', 'broke', 'late', 'reschedule',
    'cancel', 'charge', 'ripoff', 'hidden fee', 'fees', 'lawsuit', 'trust',
    'legal', 'review', 'rating', 'fraud', 'return', 'fake', 'cost'
  ];

  const lowerInput = userInput.toLowerCase();
  if (fallbackKeywords.some(keyword => lowerInput.includes(keyword))) {
    try {
      const fallbackPrompt = "You are a MovingCo sales agent. The customer has asked about a key concern (such as damage, refunds, delays, price, or safety). Respond in ONLY 1-2 short sentences, calm and professional, and gently guide them back to completing their booking.";

      const fallbackCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: fallbackPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: 0.7
      });

      const reply = fallbackCompletion.choices[0]?.message?.content || "I’ll do my best to help with that. Let’s keep going.";
      return res.status(200).json({ reply });
    } catch (error) {
      console.error('Fallback GPT error:', error);
      return res.status(500).json({ error: 'Internal fallback error' });
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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
