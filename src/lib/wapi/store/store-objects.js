export const storeObjects = [
  {
    id: 'Store',
    conditions: (module) => (module.Chat && module.Msg ? module : null),
  },
  {
    id: 'MediaCollection',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      (module.default.prototype.processFiles !== undefined ||
        module.default.prototype.processAttachments !== undefined)
        ? module.default
        : null,
  },
  {
    id: 'MediaProcess',
    conditions: (module) => (module.BLOB ? module : null),
  },
  {
    id: 'ChatUtil',
    conditions: (module) => (module.sendClear ? module : null),
  },
  {
    id: 'GroupInvite',
    conditions: (module) => (module.queryGroupInviteCode ? module : null),
  },
  { id: 'Wap', conditions: (module) => (module.createGroup ? module : null) },
  {
    id: 'ServiceWorker',
    conditions: (module) =>
      module.default && module.default.killServiceWorker ? module : null,
  },
  {
    id: 'State',
    conditions: (module) => (module.STATE && module.STREAM ? module : null),
  },
  {
    id: 'WapDelete',
    conditions: (module) =>
      module.sendConversationDelete && module.sendConversationDelete.length == 2
        ? module
        : null,
  },
  {
    id: 'Conn',
    conditions: (module) =>
      module.default && module.default.ref && module.default.refTTL
        ? module.default
        : null,
  },
  {
    id: 'WapQuery',
    conditions: (module) =>
      module.queryExist
        ? module
        : module.default && module.default.queryExist
        ? module.default
        : null,
  },
  {
    id: 'CryptoLib',
    conditions: (module) => (module.decryptE2EMedia ? module : null),
  },
  {
    id: 'OpenChat',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.openChat
        ? module.default
        : null,
  },
  {
    id: 'UserConstructor',
    conditions: (module) =>
      module.default &&
      module.default.prototype &&
      module.default.prototype.isServer &&
      module.default.prototype.isUser
        ? module.default
        : null,
  },
  {
    id: 'SendTextMsgToChat',
    conditions: (module) =>
      module.sendTextMsgToChat ? module.sendTextMsgToChat : null,
  },
  {
    id: 'SendSeen',
    conditions: (module) => (module.sendSeen ? module.sendSeen : null),
  },
  {
    id: 'sendDelete',
    conditions: (module) => (module.sendDelete ? module.sendDelete : null),
  },
  {
    id: 'addAndSendMsgToChat',
    conditions: (module) =>
      module.addAndSendMsgToChat ? module.addAndSendMsgToChat : null,
  },
  {
    id: 'sendMsgToChat',
    conditions: (module) =>
      module.sendMsgToChat ? module.sendMsgToChat : null,
  },
  {
    id: 'Catalog',
    conditions: (module) => (module.Catalog ? module.Catalog : null),
  },
  {
    id: 'bp',
    conditions: (module) =>
      module.default &&
      module.default.toString().includes('binaryProtocol deprecated version')
        ? module.default
        : null,
  },
  {
    id: 'MsgKey',
    conditions: (module) =>
      module.default &&
      module.default.toString().includes('MsgKey error: id is already a MsgKey')
        ? module.default
        : null,
  },
  {
    id: 'Parser',
    conditions: (module) =>
      module.convertToTextWithoutSpecialEmojis ? module.default : null,
  },
  {
    id: 'Builders',
    conditions: (module) =>
      module.TemplateMessage && module.HydratedFourRowTemplate ? module : null,
  },
  {
    id: 'Me',
    conditions: (module) =>
      module.PLATFORMS && module.Conn ? module.default : null,
  },
  {
    id: 'CallUtils',
    conditions: (module) =>
      module.sendCallEnd && module.parseCall ? module : null,
  },
  {
    id: 'Identity',
    conditions: (module) =>
      module.queryIdentity && module.updateIdentity ? module : null,
  },
  {
    id: 'MyStatus',
    conditions: (module) =>
      module.getStatus && module.setMyStatus ? module : null,
  },
  {
    id: 'ChatStates',
    conditions: (module) =>
      module.sendChatStatePaused &&
      module.sendChatStateRecording &&
      module.sendChatStateComposing
        ? module
        : null,
  },
  {
    id: 'GroupActions',
    conditions: (module) =>
      module.sendExitGroup && module.localExitGroup ? module : null,
  },
  {
    id: 'Features',
    conditions: (module) =>
      module.FEATURE_CHANGE_EVENT && module.features ? module : null,
  },
  {
    id: 'MessageUtils',
    conditions: (module) =>
      module.storeMessages && module.appendMessage ? module : null,
  },
  {
    id: 'WebMessageInfo',
    conditions: (module) =>
      module.WebMessageInfo && module.WebFeatures
        ? module.WebMessageInfo
        : null,
  },
  {
    id: 'createMessageKey',
    conditions: (module) =>
      module.createMessageKey && module.createDeviceSentMessage
        ? module.createMessageKey
        : null,
  },
  {
    id: 'Participants',
    conditions: (module) =>
      module.addParticipants &&
      module.removeParticipants &&
      module.promoteParticipants &&
      module.demoteParticipants
        ? module
        : null,
  },
  {
    id: 'WidFactory',
    conditions: (module) =>
      module.numberToWid && module.createWid && module.createWidFromWidLike
        ? module
        : null,
  },
  {
    id: 'Base',
    conditions: (module) =>
      module.setSubProtocol && module.binSend && module.actionNode
        ? module
        : null,
  },
  {
    id: 'Base2',
    conditions: (module) =>
      module.supportsFeatureFlags &&
      module.parseMsgStubProto &&
      module.binSend &&
      module.subscribeLiveLocation
        ? module
        : null,
  },
  {
    id: 'Versions',
    conditions: (module) =>
      module.loadProtoVersions &&
      module.default['15'] &&
      module.default['16'] &&
      module.default['17']
        ? module
        : null,
  },
  {
    id: 'Sticker',
    conditions: (module) =>
      module.default && module.default.Sticker ? module.default.Sticker : null,
  },
  {
    id: 'MediaUpload',
    conditions: (module) =>
      module.default && module.default.mediaUpload ? module.default : null,
  },
  {
    id: 'UploadUtils',
    conditions: (module) =>
      module.default && module.default.encryptAndUpload ? module.default : null,
  },
  {
    id: 'Cmd',
    conditions: (module) =>
      module.default && module.default.openChatFromUnread ? module : null,
  },
];
