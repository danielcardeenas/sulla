import { hasUndreadMessages } from './has-unread-messages';

/**
 * Retrieves chats with undread/new messages
 * @param {*} done
 * @returns {Chat[]} chat list
 */
export const getAllChatsWithNewMessages = function (done) {
  const chats = window.Store.Chat.filter(hasUndreadMessages).map((chat) =>
    WAPI._serializeChatObj(chat)
  );

  if (done !== undefined) done(chats);
  return chats;
};
