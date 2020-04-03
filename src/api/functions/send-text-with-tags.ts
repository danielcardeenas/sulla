declare module WAPI {
  const sendSeen: (to: string) => void;
  const sendMessageWithTags: (to: string, content: string) => string;
}

/**
 * Sends text message with @tags mentions
 * Example:
 * "Hello @8114285934 from sulla!"
 * @param to chat id: xxxxx@us.c
 * @param content message body
 * @returns message id
 */
export async function sendTextWithTags(
  to: string,
  content: string
): Promise<string> {
  return await this.page.evaluate(
    ({ to, content }) => {
      WAPI.sendSeen(to);
      return WAPI.sendMessageWithTags(to, content);
    },
    { to, content }
  );
}
