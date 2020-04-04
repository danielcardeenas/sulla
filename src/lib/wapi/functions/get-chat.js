/**
 * Retrieves chat by its id
 * @param {*} id Id of the chat
 * @param {*} done Callback
 * @returns {Chat} object
 */
export function getChat(id, done) {
  id = typeof id == 'string' ? id : id._serialized;
  const found = window.Store.Chat.get(id);
  if (found)
    found.sendMessage = found.sendMessage
      ? found.sendMessage
      : function () {
          return window.Store.sendMessage.apply(this, arguments);
        };
  if (done !== undefined) done(found);
  return found;
}
