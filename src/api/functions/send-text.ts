declare module WAPI {
  const sendSeen: (to: string) => void;
  const sendMessage: (to: string, content: string) => string;
}

/**
 * Sends a text message to given chat
 * @param to chat id: xxxxx@us.c
 * @param content text message
 */
export async function sendText(to: string, content: string) {
  return await this.page.evaluate(
    ({ to, content }) => {
      WAPI.sendSeen(to);
      return WAPI.sendMessage(to, content);
    },
    { to, content }
  );
}
