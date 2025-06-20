import { sendTelegramBackup } from './SendTelegramBackup.js';

export async function tapMessage(reqBody) {
  const userText = reqBody?.text || reqBody?.option || null;

  if (userText) {
    await sendTelegramBackup(userText);
  }
}
