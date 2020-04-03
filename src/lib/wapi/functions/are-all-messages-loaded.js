/**
 * Checks if all messages are loaded
 * @param {string} id Chat id
 * @param {Function} done Optional callback
 */
export function areAllMessagesLoaded(id, done) {
  const found = WAPI.getChat(id);
  if (!found.msgs.msgLoadState.noEarlierMsgs) {
    if (done) done(false);
    return false;
  }
  if (done) done(true);
  return true;
}
