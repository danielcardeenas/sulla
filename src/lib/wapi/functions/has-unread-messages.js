/**
 * Checks if given chat has new messages
 * @param {Chat} chat Chat object
 */
export const hasUndreadMessages = function(chat) {
  return chat.unreadCount > 0;
};