import { generateMediaKey, getFileHash } from '../helper';

/**
 * Encrypts given blob
 * @param {'audio' | 'sticker' | 'video' | 'product' | 'document' | 'gif' | 'image' | 'ptt' | 'template' | 'history' | 'ppic'} type The type of file
 * @param {Blob} blob
 */
export async function encryptAndUploadFile(type, blob) {
  const filehash = await getFileHash(blob);
  const mediaKey = generateMediaKey(32);
  const controller = new AbortController();
  const signal = controller.signal;
  const encrypted = await window.Store.UploadUtils.encryptAndUpload({
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
