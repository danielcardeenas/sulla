/**
 * Process files using Store MediaCollection
 * @param {Chat} chat Chat object
 * @param {any[]} blobs Blobs to process
 */
export async function processFiles(chat, blobs) {
  if (!Array.isArray(blobs)) {
    blobs = [blobs];
  }

  const mediaCollection = new Store.MediaCollection(chat);
  if (Debug.VERSION !== '0.4.613') {
    blobs = blobs.map((blob) => ({ file: blob }));
  }

  await mediaCollection.processFiles(blobs, chat, 1);
  return mediaCollection;
}
