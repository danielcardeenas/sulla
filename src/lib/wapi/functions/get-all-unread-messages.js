import { getAllChatsWithNewMessages } from './get-chats-with-new-messages';

/**
 * Retrieves undread messages
 * x.ack === -1
 * TODO: Test this fn, seems incorrect, should not be async
 */
export const getAllUnreadMessages = async function () {
  return JSON.stringify(
    getAllChatsWithNewMessages()
      .map((c) => WAPI.getChat(c.id._serialized))
      .map((c) => c.msgs._models.filter((x) => x.ack === -1))
      .flatMap((x) => x) || []
  );
};
