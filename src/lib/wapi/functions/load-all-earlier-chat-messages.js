/**
 * Loads all earlier messages of given chat id
 * @param {string} id Chat id
 * @param {Funciton} done Optional callback
 */
export async function loadAllEarlierMessages(id, done) {
  const found = WAPI.getChat(id);
  while (!found.msgs.msgLoadState.noEarlierMsgs) {
    await found.loadEarlierMsgs();
  }
  debugger;
  return true;
}
