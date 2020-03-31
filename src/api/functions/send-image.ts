import * as fs from 'fs';

declare module WAPI {
  // New
  const sendImage: (
    to: string,
    imgBase64: string,
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
  const base64 = fs.readFileSync(path, { encoding: 'base64' });
  const data = `data:${'image/jpeg'};base64,${base64}`;

  return await this.page.evaluate(
    ({ to, data, filename, caption }) => {
      WAPI.sendImage(to, data, filename, caption);
    },
    { to, data, filename, caption }
  );
}
