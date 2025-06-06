// pages/api/send-telegram-alert.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

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

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = '8040084234';

  const message = `
📬 *New MovingCo Lead!*
—
*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Move Date:* ${moveDate}
*From:* ${origin}
*To:* ${destination}
*Size:* ${size}
*Special Items:* ${specialItems || 'None'}

📝 *Quote:* ${quote}

🗂️ *Full Transcript:*
${transcript}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Telegram alert error:', err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}
