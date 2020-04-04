/**
 * Loads earlier messages from Store till given date
 * @param {string} id Chat id
 * @param {*} lastMessage UTC timestamp of last message to be loaded
 * @param {Function} done Optional callback
 */
export function loadEarlierMessagesTillDate(id, lastMessage, done) {
  const found = WAPI.getChat(id);
  x = function () {
    if (
      found.msgs.models[0].t > lastMessage &&
      !found.msgs.msgLoadState.noEarlierMsgs
    ) {
      found.loadEarlierMsgs().then(x);
    } else {
      done();
    }
  };
  x();
}
