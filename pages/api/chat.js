
import { OpenAI } from 'openai';
import { tapMessage } from '../../utils/TapUserResponse.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, mode, formData } = req.body;

  // Run Telegram tap
  try {
    const lastUserMessage = messages?.filter(m => m.role === 'user').pop()?.content;
    if (lastUserMessage) {
      await tapMessage(lastUserMessage);
    }
  } catch (err) {
    console.error('Telegram tap error:', err);
  }

  const isFollowup = mode === 'followup';
  const selectedPrompt = isFollowup ? `
You are a MovingCo sales assistant continuing to assist a customer who already received their price estimate.

The customer provided:
- Moving from: "${formData?.from || 'N/A'}"
- Moving to: "${formData?.to || 'N/A'}"
- Type and size: "${formData?.size || 'N/A'}"
- Move date: "${formData?.moveDate || 'N/A'}"
- What matters most: "${formData?.priority || 'N/A'}"
- Special or fragile items: "${formData?.special || 'N/A'}"

Your job is to answer short follow-up questions clearly and helpfully. Be warm, professional, and brief. If the customer says anything like “yes,” “sounds good,” or “I’m ready,” simply confirm and let the system take over booking.

Do not ask for payment or personal information. The system will handle it.

If the customer brings up coverage, insurance, cancellation, or legal terms, respond using only these policies:
- MovingCo coordinates moving services only. We are not a carrier, freight broker, or insurer.
- The $85 deposit secures the MoveSafe Call and begins coordination. Final pricing is approved after review.
- If customers load items themselves or use unapproved labor, coverage may not apply.
- Premium Move Coverage™ is optional and applies only to declared items, with limited reimbursement. No repairs or full replacement are included.

You may respond to a maximum of two follow-up messages. On your second reply, end with this:

“End of chat.  
Book now and you’ll be connected to a real-deal American moving expert—someone who’ll answer every question and walk you step-by-step into a smooth, no-surprises move.  
Not ready? No problem—I can email you a copy of your estimate to review whenever you're ready.”

Keep the tone steady and helpful. Never repeat yourself.
` : `
You are a MovingCo sales assistant. The customer is requesting a price estimate for their upcoming move.

The customer provided:
- Moving from: "${formData?.from || 'N/A'}"
- Moving to: "${formData?.to || 'N/A'}"
- Type and size: "${formData?.size || 'N/A'}"
- Move date: "${formData?.moveDate || 'N/A'}"
- What matters most: "${formData?.priority || 'N/A'}"
- Special or fragile items: "${formData?.special || 'N/A'}"

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
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: selectedPrompt
        },
        ...messages
      ],
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || 'Something went wrong.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('GPT error:', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}
