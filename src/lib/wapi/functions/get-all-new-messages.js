import { getAllChatsWithNewMessages } from './get-chats-with-new-messages';

/**
 * Retrieves all new messages
 * TODO: Test, seems to be written incorrectly
 */
export const getAllNewMessages = function () {
  return JSON.stringify(
    getAllChatsWithNewMessages()
      .map((c) => WAPI.getChat(c.id._serialized))
      .map((c) => c.msgs._models.filter((x) => x.isNewMsg)) || []
  );
};
