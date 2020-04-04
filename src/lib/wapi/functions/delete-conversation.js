/**
 * @param {string} chatId Chat id
 * @param {Function} done Optional callback
 */
export function deleteConversation(chatId, done) {
  let userId = new window.Store.UserConstructor(chatId, {
    intentionallyUsePrivateConstructor: true,
  });
  let conversation = WAPI.getChat(userId);

  if (!conversation) {
    if (done !== undefined) {
      done(false);
    }
    return false;
  }

  window.Store.sendDelete(conversation, false)
    .then(() => {
      if (done !== undefined) {
        done(true);
      }
    })
    .catch(() => {
      if (done !== undefined) {
        done(false);
      }
    });

  return true;
}
