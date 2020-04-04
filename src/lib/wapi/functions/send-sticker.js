/**
 * Sends sticker, this method should be called with a helper like 'sendImageAsSticker'
 * @param {*} sticker Sticker
 * @param {string} chatId Chat id
 * @param {*} metadata sharp metadata (https://sharp.pixelplumbing.com/api-input#metadata)
 */
export async function sendSticker(sticker, chatId, metadata) {
  var chat = Store.Chat.get(chatId);
  let stick = new window.Store.Sticker.modelClass();
  stick.__x_clientUrl = sticker.clientUrl;
  stick.__x_filehash = sticker.filehash;
  stick.__x_id = sticker.filehash;
  stick.__x_uploadhash = sticker.uploadhash;
  stick.__x_mediaKey = sticker.mediaKey;
  stick.__x_initialized = false;
  stick.__x_mediaData.mediaStage = 'INIT';
  stick.mimetype = 'image/webp';
  stick.height = metadata && metadata.height ? metadata.height : 512;
  stick.width = metadata && metadata.width ? metadata.width : 512;
  await stick.initialize();
  return await stick.sendToChat(chat);
}
