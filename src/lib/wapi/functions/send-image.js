import { processFiles } from './process-files';

/**
 * Sends image to given chat if
 * @param {string} imgBase64 base64 encoded image
 * @param {string} chatid Chat id
 * @param {string} filename
 * @param {string} caption
 * @param {Function} done Optional callback
 */
export function sendImage(imgBase64, chatid, filename, caption, done) {
  const idUser = new Store.WidFactory.createWid(chatid);
  return Store.Chat.find(idUser).then((chat) => {
    var mediaBlob = window.WAPI.base64ImageToFile(imgBase64, filename);
    processFiles(chat, mediaBlob).then((mediaCollection) => {
      var media = mediaCollection.models[0];
      media.sendToChat(chat, { caption: caption });
      if (done !== undefined) done(true);
    });
  });
}
