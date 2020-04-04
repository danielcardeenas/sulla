/**
 * Generates new message id based on given chat
 * @param {*} chatId Chat id
 */
export function getNewMessageId(chatId) {
  const newMsgId = new Store.MsgKey(
    Object.assign({}, Store.Msg.models[0].__x_id)
  );

  newMsgId.fromMe = true;
  newMsgId.id = WAPI.getNewId().toUpperCase();
  newMsgId.remote = chatId;
  newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`;
  return newMsgId;
}
