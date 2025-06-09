export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    type,
    name,
    email,
    phone,
    moveDate,
    origin,
    destination,
    size,
    specialItems,
    quote,
    stage,
    message // used for contact form
  } = req.body;

  const messageLines = [];

  // Handle contact form
  if (type === "contact") {
    messageLines.push("📥 CONTACT REQUEST", "—");
    if (email) messageLines.push(`📧 Email: ${email}`);
    if (phone) messageLines.push(`📞 Phone: ${phone}`);
    if (message) messageLines.push(`📝 Message: ${message}`);
  } else {
    const isEstimate = stage === "Estimate Viewed";

    if (isEstimate) {
      messageLines.push("📊 New Estimate Viewed", "—");
    } else {
      messageLines.push("✅ MOVE RESERVED!", "—");
      if (name) messageLines.push(`👤 Name: ${name}`);
      if (phone) messageLines.push(`📞 Phone: ${phone}`);
      if (email) messageLines.push(`📧 Email: ${email}`);
      messageLines.push(""); // spacing
    }

    if (moveDate) messageLines.push(`📦 Move Date: ${moveDate}`);
    if (origin) messageLines.push(`📍 From: ${origin}`);
    if (destination) messageLines.push(`📍 To: ${destination}`);
    if (size) messageLines.push(`🏠 Size: ${size}`);
    if (specialItems) messageLines.push(`🎯 Special Items: ${specialItems}`);
    if (quote) messageLines.push(isEstimate ? `\n💬 Quote: ${quote}` : `\n💸 Accepted Quote: ${quote}`);
  }

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
