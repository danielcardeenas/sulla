import { fileToBase64 } from '../helpers/file-to-base64';

declare module WAPI {
  const sendImage: (
    imgBase64: string,
    to: string,
    filename: string,
    caption: string
  ) => any;
}

/**
 * Sends image message
 * @param to Chat id
 * @param imgBase64
 * @param filename
 * @param caption
 */
export async function sendImage(
  to: string,
  path: string,
  filename: string,
  caption?: string
) {
  const data = await fileToBase64(path);
  return await this.page.evaluate(
    ({ to, data, filename, caption }) => {
      WAPI.sendImage(data, to, filename, caption);
    },
    { to, data, filename, caption }
  );
}
