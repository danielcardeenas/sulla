declare module WAPI {
  const sendMessageWithThumb: (
    thumb: string,
    url: string,
    title: string,
    description: string,
    chatId: string
  ) => void;
}

/**
 * Sends message with thumbnail
 * @param thumb
 * @param url
 * @param title
 * @param description
 * @param chatId
 */
export async function sendMessageWithThumb(
  thumb: string,
  url: string,
  title: string,
  description: string,
  chatId: string
) {
  return await this.page.evaluate(
    ({ thumb, url, title, description, chatId }) => {
      WAPI.sendMessageWithThumb(thumb, url, title, description, chatId);
    },
    {
      thumb,
      url,
      title,
      description,
      chatId,
    }
  );
}
