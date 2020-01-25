/**
 * Serializes chat object
 * @param {Chat} obj 
 */
export const _serializeMessageObj = obj => {
  if (obj == undefined) {
    return null;
  }
  const _chat = WAPI._serializeChatObj(obj["chat"]);
  return Object.assign(window.WAPI._serializeRawObj(obj), {
    id: obj.id._serialized,
    sender: obj["senderObj"]
      ? WAPI._serializeContactObj(obj["senderObj"])
      : null,
    timestamp: obj["t"],
    content: obj["body"],
    isGroupMsg: obj.isGroupMsg,
    isLink: obj.isLink,
    isMMS: obj.isMMS,
    isMedia: obj.isMedia,
    isNotification: obj.isNotification,
    isPSA: obj.isPSA,
    type: obj.type,
    chat: _chat,
    chatId: obj.id.remote,
    quotedMsgObj: WAPI._serializeMessageObj(obj["_quotedMsgObj"]),
    mediaData: window.WAPI._serializeRawObj(obj["mediaData"]),
    isOnline: _chat.isOnline,
    lastSeen: _chat.lastSeen
  });
};