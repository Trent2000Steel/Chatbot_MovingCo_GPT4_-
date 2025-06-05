export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    phone,
    moveDate,
    origin,
    destination,
    size,
    specialItems,
    quote,
    transcript,
  } = req.body;

  const message = `
📦 *New Move Lead*  
👤 *${name}*  
📧 ${email}  
📞 ${phone}  
📅 ${moveDate}  
🏠 ${origin} → 🏡 ${destination}  
📐 ${size}  
🎯 Special Items: ${specialItems || 'None'}  
💵 Estimate: ${quote || 'N/A'}

📝 *Chat Transcript:*  
${transcript || '_Not captured_'}
  `;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_USER_ID;

  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const telegramRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await telegramRes.json();

    if (!data.ok) {
      console.error('Telegram API Error:', data);
      return res.status(500).json({ error: 'Failed to send Telegram message' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Telegram fetch error:', err);
    res.status(500).json({ error: 'Telegram request failed' });
  }
}
