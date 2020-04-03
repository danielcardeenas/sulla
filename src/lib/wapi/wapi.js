import {
  areAllMessagesLoaded,
  asyncLoadAllEarlierMessages,
  clearChat,
  createGroup,
  deleteConversation,
  deleteMessages,
  downloadFileWithCredentials,
  encryptAndUploadFile,
  getAllChatIds,
  getAllChats,
  getAllChatsWithMessages,
  getAllChatsWithNewMessages,
  getAllContacts,
  getAllGroupMetadata,
  getAllGroups,
  getAllMessagesInChat,
  getAllNewMessages,
  getAllUnreadMessages,
  getBatteryLevel,
  getChat,
  getChatById,
  getChatByName,
  getCommonGroups,
  getContact,
  getGroupAdmins,
  getGroupInviteLink,
  getGroupMetadata,
  getGroupParticipantIDs,
  getHost,
  getMe,
  getMyContacts,
  getNewId,
  getNumberProfile,
  getProfilePicFromServer,
  getStatus,
  getUnreadMessages,
  getUnreadMessagesInChat,
  hasUndreadMessages,
  isConnected,
  isLoggedIn,
  leaveGroup,
  loadAllEarlierMessages,
  loadAndGetAllMessagesInChat,
  loadChatEarlierMessages,
  loadEarlierMessagesTillDate,
  processFiles,
  processMessageObj,
  revokeGroupInviteLink,
  sendChatstate,
  sendFile,
  sendImage,
  sendImageAsSticker,
  sendImageWithProduct,
  sendLocation,
  sendMessage,
  sendMessage2,
  sendMessageWithTags,
  sendMessageWithThumb,
  sendSeen,
  sendSticker,
  sendVideoAsGif,
  setMyName,
  setMyStatus,
  _getGroupParticipants,
  forwardMessages,
  sendContact,
  getNewMessageId,
  reply,
  startTyping,
  stopTyping,
} from './functions';
import { base64ToFile, generateMediaKey, getFileHash } from './helper';
import {
  addNewMessagesListener,
  addOnAddedToGroup,
  addOnLiveLocation,
  addOnNewAcks,
  addOnParticipantsChange,
  addOnStateChange,
  allNewMessagesListener,
  initNewMessagesListener,
} from './listeners';
import {
  _serializeChatObj,
  _serializeContactObj,
  _serializeMessageObj,
  _serializeNumberStatusObj,
  _serializeProfilePicThumb,
  _serializeRawObj,
} from './serializers';
import { getStore } from './store/get-store';

if (!window.Store || !window.Store.Msg) {
  (function () {
    const parasite = `parasite${Date.now()}`;
    // webpackJsonp([], { [parasite]: (x, y, z) => getStore(z) }, [parasite]);
    if (typeof webpackJsonp === 'function')
      webpackJsonp([], { [parasite]: (x, y, z) => getStore(z) }, [parasite]);
    else
      webpackJsonp.push([
        [parasite],
        { [parasite]: (x, y, z) => getStore(z) },
        [[parasite]],
      ]);
  })();
}

window.WAPI = {
  lastRead: {},
};

// Serializers assignations
window.WAPI._serializeRawObj = _serializeRawObj;
window.WAPI._serializeChatObj = _serializeChatObj;
window.WAPI._serializeContactObj = _serializeContactObj;
window.WAPI._serializeMessageObj = _serializeMessageObj;
window.WAPI._serializeNumberStatusObj = _serializeNumberStatusObj;
window.WAPI._serializeProfilePicThumb = _serializeProfilePicThumb;

// Functions
window.WAPI.createGroup = createGroup;
window.WAPI.leaveGroup = leaveGroup;
window.WAPI.getAllContacts = getAllContacts;
window.WAPI.getMyContacts = getMyContacts;
window.WAPI.getContact = getContact;
window.WAPI.getAllChats = getAllChats;
window.WAPI.haveNewMsg = hasUndreadMessages;
window.WAPI.getAllChatsWithNewMsg = getAllChatsWithNewMessages;
window.WAPI.getAllChatIds = getAllChatIds;
window.WAPI.getAllNewMessages = getAllNewMessages;
window.WAPI.getAllUnreadMessages = getAllUnreadMessages;
window.WAPI.getAllChatsWithMessages = getAllChatsWithMessages;
window.WAPI.getAllGroups = getAllGroups;
window.WAPI.sendChatstate = sendChatstate;
window.WAPI.getChat = getChat;
window.WAPI.getStatus = getStatus;
window.WAPI.getChatByName = getChatByName;

window.WAPI.getGeneratedUserAgent = function (useragent) {
  if (!useragent.includes('WhatsApp')) return 'WhatsApp/0.4.315 ' + useragent;
  return useragent.replace(
    useragent
      .match(/WhatsApp\/([.\d])*/g)[0]
      .match(/[.\d]*/g)
      .find((x) => x),
    window.Debug.VERSION
  );
};

window.WAPI.getWAVersion = function () {
  return window.DEBUG.VERSION;
};

window.WAPI.sendMessageWithThumb = sendMessageWithThumb;
window.WAPI.revokeGroupInviteLink = revokeGroupInviteLink;
window.WAPI.getGroupInviteLink = getGroupInviteLink;
window.WAPI.getNewId = getNewId;
window.WAPI.getChatById = getChatById;
window.WAPI.getUnreadMessagesInChat = getUnreadMessagesInChat;
window.WAPI.loadEarlierMessages = loadChatEarlierMessages;
window.WAPI.loadAllEarlierMessages = loadAllEarlierMessages;
window.WAPI.asyncLoadAllEarlierMessages = asyncLoadAllEarlierMessages;
window.WAPI.areAllMessagesLoaded = areAllMessagesLoaded;
window.WAPI.loadEarlierMessagesTillDate = loadEarlierMessagesTillDate;
window.WAPI.getAllGroupMetadata = getAllGroupMetadata;
window.WAPI.getGroupMetadata = getGroupMetadata;

window.WAPI._getGroupParticipants = _getGroupParticipants;
window.WAPI.getGroupParticipantIDs = getGroupParticipantIDs;
window.WAPI.getGroupAdmins = getGroupAdmins;

window.WAPI.getHost = getHost;
window.WAPI.getMe = getMe;
window.WAPI.isLoggedIn = isLoggedIn;
window.WAPI.isConnected = isConnected;
window.WAPI.processMessageObj = processMessageObj;
window.WAPI.getAllMessagesInChat = getAllMessagesInChat;
window.WAPI.loadAndGetAllMessagesInChat = loadAndGetAllMessagesInChat;

window.WAPI.sendMessageWithTags = sendMessageWithTags;
window.WAPI.sendMessage = sendMessage;
window.WAPI.sendMessage2 = sendMessage2;
window.WAPI.sendSeen = sendSeen;
window.WAPI.getUnreadMessages = getUnreadMessages;
window.WAPI.getCommonGroups = getCommonGroups;
window.WAPI.getProfilePicFromServer = getProfilePicFromServer;
window.WAPI.downloadFileWithCredentials = downloadFileWithCredentials;
window.WAPI.getBatteryLevel = getBatteryLevel;
window.WAPI.deleteConversation = deleteConversation;
window.WAPI.deleteMessages = deleteMessages;
window.WAPI.clearChat = clearChat;
window.WAPI.getNumberProfile = getNumberProfile;

window.WAPI.getAllMessageIdsInChat = function (
  id,
  includeMe,
  includeNotifications,
  done
) {
  const chat = WAPI.getChat(id);
  let output = [];
  const messages = chat.msgs._models;

  for (const i in messages) {
    if (
      i === 'remove' ||
      (!includeMe && messages[i].isMe) ||
      (!includeNotifications && messages[i].isNotification)
    ) {
      continue;
    }
    output.push(messages[i].id._serialized);
  }
  if (done !== undefined) done(output);
  return output;
};

window.WAPI.getMessageById = function (id, done) {
  let result = false;
  try {
    let msg = window.Store.Msg.get(id);
    if (msg) {
      result = WAPI.processMessageObj(msg, true, true);
    }
  } catch (err) {}

  if (done !== undefined) {
    done(result);
  } else {
    return result;
  }
};

window.WAPI.sendMessageToID = function (id, message, done) {
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
};

window.WAPI.sendMessageReturnId = async function (ch, body) {
  var chat = ch.id ? ch : Store.Chat.get(ch);
  var chatId = chat.id._serialized;
  var msgIveSent = chat.msgs.filter((msg) => msg.__x_isSentByMe)[0];
  if (!msgIveSent) return chat.sendMessage(body);
  var tempMsg = Object.create(msgIveSent);
  var newId = window.WAPI.getNewMessageId(chatId);
  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: new Store.WidFactory.createWid(chatId),
    isNewMsg: !0,
    type: 'chat',
    body,
    quotedMsg: null,
  };
  Object.assign(tempMsg, extend);
  await Store.addAndSendMsgToChat(chat, tempMsg);
  return newId._serialized;
};

window.WAPI.getGroupOwnerID = async function (id, done) {
  const output = (await WAPI.getGroupMetadata(id)).owner.id;
  if (done !== undefined) {
    done(output);
  }
  return output;
};

window.WAPI.getProfilePicSmallFromId = function (id, done) {
  window.Store.ProfilePicThumb.find(id).then(
    function (d) {
      if (d.img !== undefined) {
        window.WAPI.downloadFileWithCredentials(d.img, done);
      } else {
        done(false);
      }
    },
    function (e) {
      done(false);
    }
  );
};

window.WAPI.getProfilePicFromId = function (id, done) {
  window.Store.ProfilePicThumb.find(id).then(
    function (d) {
      if (d.imgFull !== undefined) {
        window.WAPI.downloadFileWithCredentials(d.imgFull, done);
      } else {
        done(false);
      }
    },
    function (e) {
      done(false);
    }
  );
};

window.WAPI.downloadFile = function (url, done) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        let reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onload = function (e) {
          done(reader.result.substr(reader.result.indexOf(',') + 1));
        };
      } else {
        console.error(xhr.statusText);
      }
    } else {
      console.log(err);
      done(false);
    }
  };

  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.send(null);
};

window.WAPI.deleteMessage2 = function (
  chatId,
  messageArray,
  revoke = false,
  done
) {
  let userId = new window.Store.UserConstructor(chatId, {
    intentionallyUsePrivateConstructor: true,
  });
  let conversation = WAPI.getChat(userId);

  if (!conversation) {
    if (done !== undefined) {
      done(false);
    }
    return false;
  }

  if (!Array.isArray(messageArray)) {
    messageArray = [messageArray];
  }

  let messagesToDelete = messageArray.map((msgId) =>
    window.Store.Msg.get(msgId)
  );

  if (revoke) {
    conversation.sendRevokeMsgs(messagesToDelete, conversation);
  } else {
    conversation.sendDeleteMsgs(messagesToDelete, conversation);
  }

  if (done !== undefined) {
    done(true);
  }

  return true;
};

/**
 * New messages observable functions.
 */
window.WAPI._newMessagesQueue = [];
window.WAPI._newMessagesBuffer =
  sessionStorage.getItem('saved_msgs') != null
    ? JSON.parse(sessionStorage.getItem('saved_msgs'))
    : [];
window.WAPI._newMessagesDebouncer = null;
window.WAPI._newMessagesCallbacks = [];

window.Store.Msg.off('add');
sessionStorage.removeItem('saved_msgs');

initNewMessagesListener();

window.addEventListener('unload', window.WAPI._unloadInform, false);
window.addEventListener('beforeunload', window.WAPI._unloadInform, false);
window.addEventListener('pageunload', window.WAPI._unloadInform, false);

// Register listeners
addNewMessagesListener();
allNewMessagesListener();
addOnStateChange();
addOnNewAcks();
addOnLiveLocation();
addOnParticipantsChange();
addOnAddedToGroup();

/**
 * Reads buffered new messages.
 * @param done - function - Callback function to be called contained the buffered messages.
 * @returns {Array}
 */
window.WAPI.getBufferedNewMessages = function (done) {
  let bufferedMessages = window.WAPI._newMessagesBuffer;
  window.WAPI._newMessagesBuffer = [];
  if (done !== undefined) {
    done(bufferedMessages);
  }
  return bufferedMessages;
};

window.WAPI.sendImage = sendImage;
window.WAPI.sendFile = sendFile;
window.WAPI.setMyName = setMyName;
window.WAPI.setMyStatus = setMyStatus;
window.WAPI.sendVideoAsGif = sendVideoAsGif;

/**
 * Find any product listings of the given number. Use this to query a catalog
 *
 * @param id id of buseinss profile (i.e the number with @c.us)
 * @param done Optional callback function for async execution
 * @returns None
 */
window.WAPI.getBusinessProfilesProducts = function (id, done) {
  return Store.Catalog.find(id)
    .then((resp) => {
      if (resp.msgProductCollection && resp.msgProductCollection._models.length)
        done();
      return resp.productCollection._models;
    })
    .catch((error) => {
      done();
      return error.model._products;
    });
};

window.WAPI.processFiles = processFiles;
window.WAPI.sendImageWithProduct = sendImageWithProduct;
window.WAPI.base64ImageToFile = base64ToFile;
window.WAPI.base64ToFile = base64ToFile;
window.WAPI.sendContact = sendContact;
window.WAPI.forwardMessages = forwardMessages;
window.WAPI.getNewMessageId = getNewMessageId;
window.WAPI.reply = reply;
window.WAPI._sendSticker = sendSticker;
window.WAPI.getFileHash = getFileHash;
window.WAPI.generateMediaKey = generateMediaKey;
window.WAPI.encryptAndUploadFile = encryptAndUploadFile;
window.WAPI.sendImageAsSticker = sendImageAsSticker;
window.WAPI.startTyping = startTyping;
window.WAPI.stopTyping = stopTyping;
window.WAPI.sendLocation = sendLocation;

window.WAPI.sendButtons = async function (chatId) {
  var chat = Store.Chat.get(chatId);
  var tempMsg = Object.create(chat.msgs.filter((msg) => msg.__x_isSentByMe)[0]);
  // var tempMsg = Object.create(Store.Msg.models.filter(msg => msg.to._serialized===chatId&&msg.__x_isSentByMe&& msg.type=='chat' && !msg.quotedStanzaID)[0])
  var t2 = Object.create(
    Store.Msg.filter((x) => (x.type == 'template') & !x.id.fromMe)[0]
  );
  var newId = window.WAPI.getNewMessageId(chatId);
  delete tempMsg.hasTemplateButtons;
  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: chat.id,
    isNewMsg: false,
    // isNewMsg: !0,
    type: 'template',
    subtype: 'text',
    body: 'body text',
    isForwarded: false,
    broadcast: false,
    isQuotedMsgAvailable: false,
    shouldEnableHsm: true,
    __x_hasTemplateButtons: true,
    invis: true,
  };

  Object.assign(tempMsg, extend);

  var btns = new Store.Builders.HydratedFourRowTemplate({
    hydratedButtons: [
      new Store.Builders.HydratedTemplateButton({
        quickReplyButton: new Store.Builders.HydratedQuickReplyButton({
          displayText: 'test',
          id: '{"eventName":"inform"}',
          quickReplyButton: true,
        }),
        index: 0,
      }),
      new Store.Builders.HydratedTemplateButton({
        callButton: new Store.Builders.HydratedCallButton({
          displayText: 'test call',
          phoneNumber: '4477777777777',
        }),
        index: 1,
      }),
      new Store.Builders.HydratedTemplateButton({
        urlButton: new Store.Builders.HydratedURLButton({
          displayText: 'test url',
          url: 'https://google.com',
        }),
        index: 2,
      }),
    ],
    hydratedContentText: 'hellllloooowww',
    hydratedFooterText: 'asdasd',
    hydratedTitleText: 'asdasd232',
  });

  Store.Parser.parseTemplateMessage(t2, btns);
  tempMsg.buttons = t2.buttons;
  console.log('t2', t2.body);
  tempMsg.mediaData = undefined;
  tempMsg.mediaObject = undefined;
  tempMsg._minEphemeralExpirationTimestamp();
  tempMsg.senderObj.isBusiness = true;
  tempMsg.senderObj.isEnterprise = true;
  tempMsg.senderObj = {
    ...tempMsg.senderObj,
    isBusiness: true,
    isEnterprise: true,
    notifyName: 'button test',
    mentionName: 'Button Test',
    displayName: 'Button Test',
    searchName: 'button test',
    header: 'b',
    formattedShortNameWithNonBreakingSpaces: 'Button test',
    formattedShortName: 'Button test',
    formattedName: 'Button test',
    formattedUser: 'Button test',
  };
  tempMsg.body = t2.body;
  tempMsg.to = tempMsg.from;
  tempMsg.caption = tempMsg.body;
  console.log('tempMsg', tempMsg);
  return chat.sendQueue
    .enqueue(
      chat.addQueue
        .enqueue(
          Store.MessageUtils.appendMessage(chat, tempMsg).then(() => {
            var e = Store.Msg.add(tempMsg)[0];
            console.log('e ', e);
            if (e) {
              return e.waitForPrep().then(() => {
                return e;
              });
            }
          })
        )
        .then((t) => chat.msgs.add(t))
        .catch((e) => console.log(e))
    )
    .then((t) => {
      var e = t[0];
      const s = Store.Base2;
      if (!s.BinaryProtocol)
        window.Store.Base2.BinaryProtocol = new window.Store.bp(11);
      var idUser = new Store.WidFactory.createWid(chatId);
      var k = Store.createMessageKey({
        ...e,
        to: idUser,
        id: e.__x_id,
      });
      console.log('key', k);
      var wm = new Store.WebMessageInfo({
        message: new Store.Builders.Message({
          // conversation:'okhellowhi',
          templateMessage: new Store.Builders.TemplateMessage({
            hydratedFourRowTemplate: btns,
            hydratedTemplate: btns,
          }),
        }),
        key: k,
        messageTimestamp: e.t,
        multicast: undefined,
        url: undefined,
        urlNumber: undefined,
        clearMedia: undefined,
        ephemeralDuration: undefined,
      });
      console.log('wm', wm);
      var action = s.actionNode('relay', [
        ['message', null, Store.WebMessageInfo.encode(wm).readBuffer()],
      ]);
      console.log('action', action);
      var a = e.id.id;
      return new Promise(function (resolve, reject) {
        console.log('yo');
        return s.binSend(
          'send',
          action,
          reject,
          {
            tag: a,
            onSend: s.wrap((_) => {
              console.log('onsend', _);
              resolve(_);
            }),
            onDrop: s.wrap((_) => {
              console.log('ondrop', _);
              reject(_);
            }),
            retryOn5xx: !0,
            resendGuard: function (_) {
              var t = Store.Msg.get(e.id);
              console.log('in resend', _);
              return 'protocol' === e.type || (t && t.id.equals(e.id));
            },
          },
          {
            debugString: ['action', 'message', e.type, e.subtype, a].join(),
            debugObj: {
              xml: action,
              pb: wm,
            },
            metricName: 'MESSAGE',
            ackRequest: !1,
          }
        );
      });
    });
};

window.WAPI.sendButtons2 = async function (chatId) {
  var chat = Store.Chat.get(chatId);
  var tempMsg = Object.create(
    Store.Msg.models.filter(
      (msg) =>
        msg.to._serialized === chatId &&
        msg.__x_isSentByMe &&
        msg.type == 'chat' &&
        !msg.quotedStanzaID
    )[0]
  );
  var t2 = Object.create(
    Store.Msg.models.filter(
      (msg) =>
        msg.to._serialized === chatId &&
        msg.__x_isSentByMe &&
        msg.type == 'chat' &&
        !msg.quotedStanzaID
    )[0]
  );
  var newId = window.WAPI.getNewMessageId(chatId);
  delete tempMsg.hasTemplateButtons;
  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: Store.WidFactory.createWid(chatId),
    isNewMsg: !0,
    type: 'template',
    subtype: 'text',
    broadcast: false,
    isQuotedMsgAvailable: false,
    shouldEnableHsm: true,
    __x_hasTemplateButtons: true,
    invis: false,
  };

  Object.assign(tempMsg, extend);

  var btns = new Store.Builders.HydratedFourRowTemplate({
    hydratedButtons: [
      new Store.Builders.HydratedTemplateButton({
        quickReplyButton: new Store.Builders.HydratedQuickReplyButton({
          displayText: 'test',
          id: '{"eventName":"inform"}',
          quickReplyButton: true,
        }),
        index: 0,
      }),
      new Store.Builders.HydratedTemplateButton({
        callButton: new Store.Builders.HydratedCallButton({
          displayText: 'test call',
          phoneNumber: '4477777777777',
        }),
        index: 1,
      }),
      new Store.Builders.HydratedTemplateButton({
        callButton: new Store.Builders.HydratedCallButton({
          displayText: 'test call',
          phoneNumber: '4477777777777',
        }),
        index: 2,
      }),
      new Store.Builders.HydratedTemplateButton({
        urlButton: new Store.Builders.HydratedURLButton({
          displayText: 'test url',
          url: 'https://google.com',
        }),
        index: 3,
      }),
    ],
    hydratedContentText: 'hellllloooowww',
    hydratedFooterText: 'asdasd',
    hydratedTitleText: 'asdasd232',
  });

  Store.Parser.parseTemplateMessage(t2, btns);
  tempMsg.buttons = t2.buttons;
  console.log('t2', t2.body);
  console.log('tempMsg', tempMsg);

  return chat.sendQueue
    .enqueue(
      chat.addQueue
        .enqueue(
          Store.MessageUtils.appendMessage(chat, tempMsg).then(() => {
            var e = Store.Msg.add(tempMsg)[0];
            console.log('e ', e);
            if (e) {
              return e.waitForPrep().then(() => {
                return e;
              });
            }
          })
        )
        .then((t) => chat.msgs.add(t))
        .catch((e) => console.log(e))
    )
    .then((t) => {
      var e = t[0];
      console.log('e', e);
      const s = Store.Base2;
      if (!s.BinaryProtocol)
        window.Store.Base2.BinaryProtocol = new window.Store.bp(11);
      var idUser = new Store.WidFactory.createWid(chatId);
      var k = Store.createMessageKey({
        ...e,
        to: idUser,
        id: e.__x_id,
      });
      console.log('key', k);
      var wm = new Store.WebMessageInfo({
        message: new Store.Builders.Message({
          //if you uncomment the next line then the message gets sent properly as a text
          // conversation:'okhellowhi',
          templateMessage: new Store.Builders.TemplateMessage({
            hydratedFourRowTemplate: btns,
            hydratedTemplate: btns,
          }),
        }),
        key: k,
        messageTimestamp: e.t,
      });
      console.log('wm', wm);
      var action = s.actionNode('relay', [
        ['message', null, Store.WebMessageInfo.encode(wm).readBuffer()],
      ]);
      console.log('action', action);
      var a = e.id.id;
      console.log('a', a);
      return new Promise(function (resolve, reject) {
        console.log('yo');
        return s.binSend(
          'send',
          action,
          reject,
          {
            tag: a,
            onSend: s.wrap(resolve),
            onDrop: s.wrap(reject),
            retryOn5xx: !0,
            resendGuard: function (_) {
              var t = Store.Msg.get(e.id);
              return 'protocol' === e.type || (t && t.id.equals(e.id));
            },
          },
          {
            debugString: ['action', 'message', 'chat', 'null', a].join(),
            debugObj: {
              xml: action,
              pb: wm,
            },
            metricName: 'MESSAGE',
            ackRequest: !1,
          }
        );
      });
    });
};

/**
 * Send Payment Request
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {string} amount1000 The amount in base value / 10 (e.g 50000 in GBP = £50)
 * @param {string} currency Three letter currency code (e.g SAR, GBP, USD, INR, AED, EUR)
 * @param {string} note message to send with the payment request
 */
window.WAPI.sendPaymentRequest = async function (
  chatId,
  amount1000,
  currency,
  noteMessage
) {
  var chat = Store.Chat.get(chatId);
  var tempMsg = Object.create(chat.msgs.filter((msg) => msg.__x_isSentByMe)[0]);
  var newId = window.WAPI.getNewMessageId(chatId);
  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: chatId,
    isNewMsg: !0,
    type: 'payment',
    subtype: 'request',
    amount1000,
    requestFrom: chatId,
    currency,
    noteMessage,
    expiryTimestamp: parseInt(
      new Date(new Date().setDate(new Date().getDate() + 1)).getTime() / 1000
    ),
  };
  Object.assign(tempMsg, extend);
  await Store.addAndSendMsgToChat(chat, tempMsg);
};

/**
 * Send Customized VCard without the necessity of contact be a Whatsapp Contact
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {object|array} vcard { displayName: 'Contact Name', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name;;;\nEND:VCARD' } | [{ displayName: 'Contact Name 1', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 1;;;\nEND:VCARD' }, { displayName: 'Contact Name 2', vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Contact Name 2;;;\nEND:VCARD' }]
 */
window.WAPI.sendVCard = function (chatId, vcard) {
  var chat = Store.Chat.get(chatId);
  var tempMsg = Object.create(
    Store.Msg.models.filter((msg) => msg.__x_isSentByMe && !msg.quotedMsg)[0]
  );
  var newId = window.WAPI.getNewMessageId(chatId);

  var extend = {
    ack: 0,
    id: newId,
    local: !0,
    self: 'out',
    t: parseInt(new Date().getTime() / 1000),
    to: chatId,
    isNewMsg: !0,
    isQuotedMsgAvailable: false,
  };

  if (Array.isArray(vcard)) {
    Object.assign(extend, {
      type: 'multi_vcard',
      vcardList: vcard,
    });

    delete extend.body;
  } else {
    Object.assign(extend, {
      type: 'vcard',
      subtype: vcard.displayName,
      body: vcard.vcard,
    });

    delete extend.vcardList;
  }

  Object.assign(tempMsg, extend);

  Store.addAndSendMsgToChat(chat, tempMsg);
};

/**
 * Block contact
 * @param {string} id '000000000000@c.us'
 * @param {*} done - function - Callback function to be called when a new message arrives.
 */
window.WAPI.contactBlock = function (id, done) {
  const contact = window.Store.Contact.get(id);
  if (contact !== undefined) {
    contact.setBlock(!0);
    done(true);
    return true;
  }
  done(false);
  return false;
};

/**
 * unBlock contact
 * @param {string} id '000000000000@c.us'
 * @param {*} done - function - Callback function to be called when a new message arrives.
 */
window.WAPI.contactUnblock = function (id, done) {
  const contact = window.Store.Contact.get(id);
  if (contact !== undefined) {
    contact.setBlock(!1);
    done(true);
    return true;
  }
  done(false);
  return false;
};

/**
 * Remove participant of Group
 * @param {*} idGroup '0000000000-00000000@g.us'
 * @param {*} idParticipant '000000000000@c.us'
 * @param {*} done - function - Callback function to be called when a new message arrives.
 */
window.WAPI.removeParticipant = function (idGroup, idParticipant, done) {
  const chat = Store.Chat.get(idGroup);
  const rm = chat.groupMetadata.participants.get(idParticipant);
  window.Store.Participants.removeParticipants(chat, [rm]).then(() => {
    done(true);
    return true;
  });
};

/**
 * Add participant to Group
 * @param {*} idGroup '0000000000-00000000@g.us'
 * @param {*} idParticipant '000000000000@c.us'
 * @param {*} done - function - Callback function to be called when a new message arrives.
 */
window.WAPI.addParticipant = function (idGroup, idParticipant, done) {
  const chat = Store.Chat.get(idGroup);
  const add = Store.Contact.get(idParticipant);
  window.Store.Participants.addParticipants(chat, [add]).then(() => {
    done(true);
    return true;
  });
};

/**
 * Promote Participant to Admin in Group
 * @param {*} idGroup '0000000000-00000000@g.us'
 * @param {*} idParticipant '000000000000@c.us'
 * @param {*} done - function - Callback function to be called when a new message arrives.
 */
window.WAPI.promoteParticipant = function (idGroup, idParticipant, done) {
  const chat = Store.Chat.get(idGroup);
  const promote = chat.groupMetadata.participants.get(idParticipant);
  window.Store.Participants.promoteParticipants(chat, [promote]).then(() => {
    done(true);
    return true;
  });
};

/**
 * Demote Admin of Group
 * @param {*} idGroup '0000000000-00000000@g.us'
 * @param {*} idParticipant '000000000000@c.us'
 * @param {*} done - function - Callback function to be called when a new message arrives.
 */
window.WAPI.demoteParticipant = function (idGroup, idParticipant, done) {
  window.Store.WapQuery.demoteParticipants(idGroup, [idParticipant]).then(
    () => {
      const chat = Store.Chat.get(idGroup);
      const demote = chat.groupMetadata.participants.get(idParticipant);
      window.Store.Participants.demoteParticipants(chat, [demote]).then(() => {
        done(true);
        return true;
      });
    }
  );
};

/**
 * New version of @tag message
 */
window.WAPI.sendMessageMentioned = async function (chatId, message, mentioned) {
  var chat = WAPI.getChat(chatId);
  const user = await Store.Contact.serialize().find(
    (x) => x.id.user === mentioned
  );
  console.log(user);
  chat.sendMessage(message, {
    linkPreview: null,
    mentionedJidList: [user.id],
    quotedMsg: null,
    quotedMsgAdminGroupJid: null,
  });
};
