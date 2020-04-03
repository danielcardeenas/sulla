import { base64ToFile } from '../helper/base64-to-file';
import { sendSticker } from './send-sticker';

/**
 * Sends image as sticker to given chat id
 * @param {string} imageBase64 Image as base64
 * @param {string} chatId chat id
 * @param {*} metadata sharp metadata: (https://sharp.pixelplumbing.com/api-input#metadata)
 */
export async function sendImageAsSticker(imageBase64, chatId, metadata) {
  const mediaBlob = base64ToFile(
    'data:image/webp;base64,' + imageBase64,
    'file.webp'
  );
  const encrypted = await window.WAPI.encryptAndUploadFile(
    'sticker',
    mediaBlob
  );

  return await sendSticker(encrypted, chatId, metadata);
}
