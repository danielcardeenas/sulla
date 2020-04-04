/**
 * Sends message to given chat id
 * @param {string} id
 * @param {string} message
 * @param {Function} done
 */
export function sendMessageToID(id, message, done) {
  try {
    window.getContact = (id) => {
      return Store.WapQuery.queryExist(id);
    };
    window.getContact(id).then((contact) => {
      if (contact.status === 404) {
        done(true);
      } else {
        Store.Chat.find(contact.jid)
          .then((chat) => {
            chat.sendMessage(message);
            return true;
          })
          .catch((reject) => {
            if (WAPI.sendMessage(id, message)) {
              done(true);
              return true;
            } else {
              done(false);
              return false;
            }
          });
      }
    });
  } catch (e) {
    if (window.Store.Chat.length === 0) return false;

    firstChat = Store.Chat.models[0];
    var originalID = firstChat.id;
    firstChat.id =
      typeof originalID === 'string'
        ? id
        : new window.Store.UserConstructor(id, {
            intentionallyUsePrivateConstructor: true,
          });
    if (done !== undefined) {
      firstChat.sendMessage(message).then(function () {
        firstChat.id = originalID;
        done(true);
      });
      return true;
    } else {
      firstChat.sendMessage(message);
      firstChat.id = originalID;
      return true;
    }
  }
  if (done !== undefined) done(false);
  return false;
}
