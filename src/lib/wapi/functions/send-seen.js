/**
 * Sends seens to given chat id
 * @param {string} id Chat id
 * @param {Function} done Optional callback
 */
export function sendSeen(id, done) {
  var chat = window.WAPI.getChat(id);
  if (chat !== undefined) {
    if (done !== undefined) {
      Store.SendSeen(chat, false).then(function () {
        done(true);
      });
      return true;
    } else {
      Store.SendSeen(chat, false);
      return true;
    }
  }
  if (done !== undefined) done();
  return false;
}
