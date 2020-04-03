import { generateMediaKey, getFileHash } from '../helper';

/**
 * Encrypts given blob
 * @param {'audio' | 'sticker' | 'video' | 'product' | 'document' | 'gif' | 'image' | 'ptt' | 'template' | 'history' | 'ppic'} type The type of file
 * @param {Blob} blob
 */
export async function encryptAndUploadFile(type, blob) {
  let filehash = await getFileHash(blob);
  let mediaKey = generateMediaKey(32);
  let controller = new AbortController();
  let signal = controller.signal;
  let encrypted = await window.Store.UploadUtils.encryptAndUpload({
    blob,
    type,
    signal,
    mediaKey,
  });
  return {
    ...encrypted,
    clientUrl: encrypted.url,
    filehash,
    id: filehash,
    uploadhash: encrypted.encFilehash,
  };
}
