export const storeObjects = [
  {
    id: "Store",
    conditions: module => (module.Chat && module.Msg ? module : null)
  },
  {
    id: "MediaCollection",
    conditions: module =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.processFiles !== undefined
        ? module.default
        : null
  },
  {
    id: "MediaProcess",
    conditions: module => (module.BLOB ? module : null)
  },
  {
    id: "Wap",
    conditions: module => (module.createGroup ? module : null)
  },
  {
    id: "ServiceWorker",
    conditions: module =>
      module.default && module.default.killServiceWorker ? module : null
  },
  {
    id: "State",
    conditions: module => (module.STATE && module.STREAM ? module : null)
  },
  {
    id: "WapDelete",
    conditions: module =>
      module.sendConversationDelete && module.sendConversationDelete.length == 2
        ? module
        : null
  },
  {
    id: "Conn",
    conditions: module =>
      module.default && module.default.ref && module.default.refTTL
        ? module.default
        : null
  },
  {
    id: "WapQuery",
    conditions: module =>
      module.queryExist
        ? module
        : module.default && module.default.queryExist
        ? module.default
        : null
  },
  {
    id: "CryptoLib",
    conditions: module => (module.decryptE2EMedia ? module : null)
  },
  {
    id: "OpenChat",
    conditions: module =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.openChat
        ? module.default
        : null
  },
  {
    id: "UserConstructor",
    conditions: module =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.isServer &&
      module.default.prototype.isUser
        ? module.default
        : null
  },
  {
    id: "SendTextMsgToChat",
    conditions: module =>
      module.sendTextMsgToChat ? module.sendTextMsgToChat : null
  },
  {
    id: "SendSeen",
    conditions: module => (module.sendSeen ? module.sendSeen : null)
  },
  {
    id: "sendDelete",
    conditions: module => (module.sendDelete ? module.sendDelete : null)
  },
  {
    id: "addAndSendMsgToChat",
    conditions: module =>
      module.addAndSendMsgToChat ? module.addAndSendMsgToChat : null
  },
  {
    id: "Catalog",
    conditions: module => (module.Catalog ? module.Catalog : null)
  }
];
