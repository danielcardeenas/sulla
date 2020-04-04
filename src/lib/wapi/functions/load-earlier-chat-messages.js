/**
 * Loads earlier chat messages from server
 * @param {string} id Chat id
 * @param {Function} done Optional callback
 */
export function loadChatEarlierMessages(id, done) {
  const found = WAPI.getChat(id);
  if (done !== undefined) {
    found.loadEarlierMsgs().then(function () {
      done();
    });
  } else {
    found.loadEarlierMsgs();
  }
}
