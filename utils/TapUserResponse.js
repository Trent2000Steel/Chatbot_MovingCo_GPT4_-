
import axios from 'axios';

export async function TapUserResponse(messageText) {
  try {
    const telegramMessage = `🗣️ User said: "${messageText}"`;
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: telegramMessage,
    });
  } catch (error) {
    console.error('Telegram tap failed:', error.response?.data || error.message);
  }
}
