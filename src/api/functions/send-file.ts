import { fileToBase64 } from '../helpers';

declare module WAPI {
  const sendFile: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => any;
}

/**
 * Sends file
 * @param to Chat id
 * @param base64 base64 data
 * @param filename
 * @param caption
 */
export async function sendFile(
  to: string,
  path: string,
  filename: string,
  caption?: string
) {
  const base64 = await fileToBase64(path);
  return await this.page.evaluate(
    ({ to, base64, filename, caption }) => {
      WAPI.sendFile(base64, to, filename, caption);
    },
    { to, base64, filename, caption }
  );
}

/**
 * Sends file
 * @param to Chat id
 * @param base64 base64 data
 * @param filename
 * @param caption
 */
export async function sendFileFromBase64(
  to: string,
  base64: string,
  filename: string,
  caption?: string
) {
  return await this.page.evaluate(
    ({ to, base64, filename, caption }) => {
      WAPI.sendFile(base64, to, filename, caption);
    },
    { to, base64, filename, caption }
  );
}
