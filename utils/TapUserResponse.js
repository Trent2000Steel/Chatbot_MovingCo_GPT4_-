export async function TapUserResponse(message) {
  try {
    const response = await fetch('https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '<YOUR_CHAT_ID>',
        text: `User said: ${message}`
      }),
    });

    if (!response.ok) {
      console.error('Telegram API response error:', await response.text());
    }
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
}