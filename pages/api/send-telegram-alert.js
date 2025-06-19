
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

  // ✅ CONTACT FORM ONLY
  if (type === "contact") {
    messageLines.push("📥 CONTACT REQUEST", "—");
    if (email) messageLines.push(`📧 Email: ${email}`);
    if (phone) messageLines.push(`📞 Phone: ${phone}`);
    if (message) messageLines.push(`📝 Message: ${message}`);

  // ✅ NEW LIVE SESSION STAGE ALERTS
  
  } else if (type === "live_chat") {
    messageLines.push("🚨 LIVE CHAT FLOW STARTED", "—");
    if (stage) messageLines.push(`🪜 Stage: ${stage}`);
    if (from) messageLines.push(`📍 From: ${from}`);
    if (to) messageLines.push(`📍 To: ${to}`);
    if (moveDate) messageLines.push(`📦 Move Date: ${moveDate}`);
    if (size) messageLines.push(`🏠 Size: ${size}`);
    if (priority) messageLines.push(`🎯 Priority: ${priority}`);
    if (packing) messageLines.push(`📦 Packing: ${packing}`);
    if (specialItems) messageLines.push(`💎 Special Items: ${specialItems}`);

} else if (stage) {
    messageLines.push(`📍 Chat Stage: ${stage}`, "—");
    if (name) messageLines.push(`🧾 Session: ${name}`);
    if (email) messageLines.push(`📧 Email: ${email}`);
    if (phone) messageLines.push(`📞 Phone: ${phone}`);
    if (moveDate) messageLines.push(`📦 Move Date: ${moveDate}`);
    if (origin) messageLines.push(`📍 From: ${origin}`);
    if (destination) messageLines.push(`📍 To: ${destination}`);
    if (size) messageLines.push(`🏠 Size: ${size}`);
    if (specialItems) messageLines.push(`🎯 Special Items: ${specialItems}`);
    if (quote) messageLines.push(`💬 Quote: ${quote}`);
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
