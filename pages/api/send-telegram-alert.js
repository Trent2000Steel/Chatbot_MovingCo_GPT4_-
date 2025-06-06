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
    quote,
    stage
  } = req.body;

  const title = stage === "Estimate Viewed" ? "📊 New Estimate Viewed" : "📦 Move Reserved";

  const messageLines = [
    `${title}`,
    "—"
  ];

  if (stage !== "Estimate Viewed") {
    if (name) messageLines.push(`Name: ${name}`);
    if (phone) messageLines.push(`Phone: ${phone}`);
    if (email) messageLines.push(`Email: ${email}`);
  }

  if (moveDate) messageLines.push(`Move Date: ${moveDate}`);
  if (origin) messageLines.push(`From: ${origin}`);
  if (destination) messageLines.push(`To: ${destination}`);
  if (size) messageLines.push(`Size: ${size}`);
  if (specialItems) messageLines.push(`Special Items: ${specialItems}`);
  if (quote) messageLines.push(`\n💬 Quote: ${quote}`);

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
        text: finalMessage,
        parse_mode: 'Markdown'
      }),
    });

    return res.status(200).json({ message: 'Telegram alert sent' });
  } catch (err) {
    console.error("Telegram error:", err);
    return res.status(500).json({ message: 'Failed to send alert' });
  }
}