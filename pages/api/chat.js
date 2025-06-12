// SYSTEM GUARDRAIL: Avoid promising insurance, refunds, or guaranteed outcomes.
// Focus on verified coordination, flat-rate quotes after review, and optional damage reimbursement—not protection.
// Keep answers short, professional, and sales psychology driven.

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sessions = {};

const fallbackKeywords = ["damage", "broken", "refund", "cancel", "late", "delay", "expensive", "price", "insurance", "safe", "trust"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { sessionId, userInput } = req.body;
  if (!sessions[sessionId]) {
    sessions[sessionId] = { phase: 1, data: {} };
  }

  const session = sessions[sessionId];

  function reply(message, phase, buttons = []) {
    session.phase = phase;
    return res.status(200).json({ message, buttons, phase });
  }

  const lowerInput = userInput.toLowerCase();
  if (fallbackKeywords.some(keyword => lowerInput.includes(keyword))) {
    try {
      const fallbackPrompt = `You are a MovingCo sales agent. The customer has asked about a key concern (such as damage, refunds, delays, price, or safety). Respond in ONLY 1-2 short sentences, calm and professional, and gently guide them back to completing their booking.`;

      const fallbackCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: fallbackPrompt },
          { role: 'user', content: userInput }
        ],
      });

      const fallbackResponse = fallbackCompletion.choices[0].message.content.trim();
      return reply(`${fallbackResponse}`, session.phase);
    } catch (error) {
      console.error('GPT fallback error:', error);
      return reply("Sorry, something went wrong answering that. Please try again.", session.phase);
    }
  }

  // All other logic continues here unchanged...
  return reply("Let's continue building your quote...", session.phase);
}
