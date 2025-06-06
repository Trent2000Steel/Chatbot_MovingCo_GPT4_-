export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
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
    quote
  } = req.body;

  const messageLines = [
    "📬 New Move Inquiry",
    "—",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Move Date: ${moveDate}`,
    `From: ${origin}`,
    `To: ${destination}`,
    `Size: ${size}`,
    `Special Items: ${specialItems}`,
    "",
    `💬 Quote: ${quote}`
  ];

  const finalMessage = messageLines.join("\n");

  try {
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: finalMessage
      }),
    });

    return res.status(200).json({ message: 'Telegram alert sent' });
  } catch (err) {
    console.error("Telegram error:", err);
    return res.status(500).json({ message: 'Failed to send alert' });
  }
}