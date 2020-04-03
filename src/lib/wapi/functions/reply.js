import { getNewMessageId } from './get-new-message-id';

/**
 * Replys to message of given chat id
 * @param {string} chatId
 * @param {string} body
 * @param {string | Message} quotedMsg Message id or message object
 */
export async function reply(chatId, body, quotedMsg) {
  if (typeof quotedMsg !== 'object') {
    quotedMsg = Store.Msg.get(quotedMsg);
  }

  const chat = Store.Chat.get(chatId);
  const extras = {
    quotedParticipant: quotedMsg.author || quotedMsg.from,
    quotedStanzaID: quotedMsg.id.id,
  };

  let tempMsg = Object.create(chat.msgs.filter((msg) => msg.__x_isSentByMe)[0]);
  const newId = getNewMessageId(chatId);
  const extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: chatId,
    isNewMsg: !0,
    type: 'chat',
    quotedMsg,
    body,
    ...extras,
  };
  Object.assign(tempMsg, extend);
  await Store.addAndSendMsgToChat(chat, tempMsg);
}
