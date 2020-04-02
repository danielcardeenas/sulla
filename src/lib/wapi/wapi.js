/**
 * This script contains WAPI functions that need to be run in the context of the webpage
 */

import {
  asyncLoadAllEarlierMessages,
  createGroup,
  getAllChatIds,
  getAllChats,
  getAllChatsWithMessages,
  getAllChatsWithNewMessages,
  getAllContacts,
  getAllGroups,
  getAllNewMessages,
  getAllUnreadMessages,
  getChat,
  getChatById,
  getChatByName,
  getContact,
  getGroupInviteLink,
  getMyContacts,
  getNewId,
  getStatus,
  getUnreadMessagesInChat,
  hasUndreadMessages,
  leaveGroup,
  loadAllEarlierMessages,
  loadChatEarlierMessages,
  processMessageObj,
  sendChatstate,
  sendMessageWithThumb,
  isLoggedIn,
} from './functions';
import * as jsSHA from './jssha';
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

window.WAPI.sendImageFromDatabasePicBot = function (picId, chatId, caption) {
  var chatDatabase = window.WAPI.getChatByName('DATABASEPICBOT');
  var msgWithImg = chatDatabase.msgs.find((msg) => msg.caption == picId);

  if (msgWithImg === undefined) {
    return false;
  }
  var chatSend = WAPI.getChat(chatId);
  if (chatSend === undefined) {
    return false;
  }
  const oldCaption = msgWithImg.caption;

  msgWithImg.id.id = getNewId();
  msgWithImg.id.remote = chatId;
  msgWithImg.t = Math.ceil(new Date().getTime() / 1000);
  msgWithImg.to = chatId;

  if (caption !== undefined && caption !== '') {
    msgWithImg.caption = caption;
  } else {
    msgWithImg.caption = '';
  }

  msgWithImg.collection.send(msgWithImg).then(function (e) {
    msgWithImg.caption = oldCaption;
  });

  return true;
};

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
window.WAPI.getGroupInviteLink = getGroupInviteLink;
window.WAPI.getNewId = getNewId;
window.WAPI.getChatById = getChatById;
window.WAPI.getUnreadMessagesInChat = getUnreadMessagesInChat;
window.WAPI.loadChatEarlierMessages = loadChatEarlierMessages;
window.WAPI.loadAllEarlierMessages = loadAllEarlierMessages;
window.WAPI.asyncLoadAllEarlierMessages = asyncLoadAllEarlierMessages;

window.WAPI.areAllMessagesLoaded = function (id, done) {
  const found = WAPI.getChat(id);
  if (!found.msgs.msgLoadState.noEarlierMsgs) {
    if (done) done(false);
    return false;
  }
  if (done) done(true);
  return true;
};

/**
 * Load more messages in chat object from store by ID till a particular date
 *
 * @param id ID of chat
 * @param lastMessage UTC timestamp of last message to be loaded
 * @param done Optional callback function for async execution
 * @returns None
 */

window.WAPI.loadEarlierMessagesTillDate = function (id, lastMessage, done) {
  const found = WAPI.getChat(id);
  x = function () {
    if (
      found.msgs.models[0].t > lastMessage &&
      !found.msgs.msgLoadState.noEarlierMsgs
    ) {
      found.loadEarlierMsgs().then(x);
    } else {
      done();
    }
  };
  x();
};

/**
 * Fetches all group metadata objects from store
 *
 * @param done Optional callback function for async execution
 * @returns {Array|*} List of group metadata
 */
window.WAPI.getAllGroupMetadata = function (done) {
  const groupData = window.Store.GroupMetadata.map(
    (groupData) => groupData.all
  );

  if (done !== undefined) done(groupData);
  return groupData;
};

/**
 * Fetches group metadata object from store by ID
 *
 * @param id ID of group
 * @param done Optional callback function for async execution
 * @returns {T|*} Group metadata object
 */
window.WAPI.getGroupMetadata = async function (id, done) {
  let output = window.Store.GroupMetadata.find(id);
  if (done !== undefined) done(output);
  return output;
};

/**
 * Fetches group participants
 *
 * @param id ID of group
 * @returns {Promise.<*>} Yields group metadata
 * @private
 */
window.WAPI._getGroupParticipants = async function (id) {
  const metadata = await WAPI.getGroupMetadata(id);
  return metadata.participants;
};

/**
 * Fetches IDs of group participants
 *
 * @param id ID of group
 * @param done Optional callback function for async execution
 * @returns {Promise.<Array|*>} Yields list of IDs
 */
window.WAPI.getGroupParticipantIDs = async function (id, done) {
  const output = (await WAPI._getGroupParticipants(id)).map(
    (participant) => participant.id
  );

  if (done !== undefined) done(output);
  return output;
};

window.WAPI.getGroupAdmins = async function (id, done) {
  const output = (await WAPI._getGroupParticipants(id))
    .filter((participant) => participant.isAdmin)
    .map((admin) => admin.id);

  if (done !== undefined) done(output);
  return output;
};

/**
 * Returns an object with all of your host device details
 */
window.WAPI.getMe = function () {
  return Store.Me.attributes;
};

/**
 * Gets object representing the logged in user
 *
 * @returns {Array|*|$q.all}
 */
window.WAPI.getMe = function (done) {
  const rawMe = window.Store.Contact.get(window.Store.Conn.me);

  if (done !== undefined) done(rawMe.all);
  return rawMe.all;
};

window.WAPI.isLoggedIn = isLoggedIn;

window.WAPI.isConnected = function (done) {
  // Phone Disconnected icon appears when phone is disconnected from the tnternet
  const isConnected =
    document.querySelector('*[data-icon="alert-phone"]') !== null
      ? false
      : true;

  if (done !== undefined) done(isConnected);
  return isConnected;
};

window.WAPI.processMessageObj = processMessageObj;

window.WAPI.getAllMessagesInChat = function (
  id,
  includeMe,
  includeNotifications,
  done
) {
  const chat = WAPI.getChat(id);
  let output = [];
  const messages = chat.msgs._models;

  for (const i in messages) {
    if (i === 'remove') {
      continue;
    }
    const messageObj = messages[i];

    let message = WAPI.processMessageObj(
      messageObj,
      includeMe,
      includeNotifications
    );
    if (message) output.push(message);
  }
  if (done !== undefined) done(output);
  return output;
};

window.WAPI.loadAndGetAllMessagesInChat = function (
  id,
  includeMe,
  includeNotifications,
  done
) {
  return WAPI.loadAllEarlierMessages(id).then((_) => {
    const chat = WAPI.getChat(id);
    let output = [];
    const messages = chat.msgs._models;

    for (const i in messages) {
      if (i === 'remove') {
        continue;
      }
      const messageObj = messages[i];

      let message = WAPI.processMessageObj(
        messageObj,
        includeMe,
        includeNotifications
      );
      if (message) output.push(message);
    }
    if (done !== undefined) done(output);
    return output;
  });
};

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

window.WAPI.ReplyMessage = function (idMessage, message, done) {
  var messageObject = window.Store.Msg.get(idMessage);
  if (messageObject === undefined) {
    if (done !== undefined) done(false);
    return false;
  }
  messageObject = messageObject.value();

  const chat = WAPI.getChat(messageObject.chat.id);
  if (chat !== undefined) {
    if (done !== undefined) {
      chat.sendMessage(message, null, messageObject).then(function () {
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }

        var trials = 0;

        function check() {
          for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
            let msg = chat.msgs.models[i];

            if (!msg.senderObj.isMe || msg.body != message) {
              continue;
            }
            done(WAPI._serializeMessageObj(msg));
            return True;
          }
          trials += 1;
          console.log(trials);
          if (trials > 30) {
            done(true);
            return;
          }
          sleep(500).then(check);
        }
        check();
      });
      return true;
    } else {
      chat.sendMessage(message, null, messageObject);
      return true;
    }
  } else {
    if (done !== undefined) done(false);
    return false;
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

window.WAPI.sendMessageWithMentions = async function (ch, body) {
  var chat = ch.id ? ch : Store.Chat.get(ch);
  var chatId = chat.id._serialized;
  var msgIveSent = chat.msgs.filter((msg) => msg.__x_isSentByMe)[0];
  if (!msgIveSent) return chat.sendMessage(body);
  var tempMsg = Object.create(msgIveSent);
  var newId = window.WAPI.getNewMessageId(chatId);
  var mentionedJidList =
    body
      .match(/@(\d*)/g)
      .map((x) => new Store.WidFactory.createUserWid(x.replace('@', ''))) ||
    undefined;
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
    mentionedJidList,
  };
  Object.assign(tempMsg, extend);
  await Store.addAndSendMsgToChat(chat, tempMsg);
  return newId._serialized;
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

window.WAPI.sendMessage = function (id, message, done) {
  var chat = WAPI.getChat(id);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (chat !== undefined) {
    if (done !== undefined) {
      chat.sendMessage(message).then(function () {
        var trials = 0;

        function check() {
          for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
            let msg = chat.msgs.models[i];

            if (!msg.senderObj.isMe || msg.body != message) {
              continue;
            }
            done(WAPI._serializeMessageObj(msg));
            return True;
          }
          trials += 1;
          console.log(trials);
          if (trials > 30) {
            done(true);
            return;
          }
          sleep(500).then(check);
        }
        check();
      });
      return true;
    } else {
      // return WAPI.sendMessageReturnId(chat,message).then(id=>{return id})
      return chat
        .sendMessage(message)
        .then((_) => chat.lastReceivedKey._serialized);
    }
  } else {
    if (done !== undefined) done(false);
    return false;
  }
};

window.WAPI.sendMessage2 = function (id, message, done) {
  var chat = WAPI.getChat(id);
  if (chat !== undefined) {
    try {
      if (done !== undefined) {
        chat.sendMessage(message).then(function () {
          done(true);
        });
      } else {
        chat.sendMessage(message);
      }
      return true;
    } catch (error) {
      if (done !== undefined) done(false);
      return false;
    }
  }
  if (done !== undefined) done(false);
  return false;
};

window.WAPI.sendSeen = function (id, done) {
  var chat = window.WAPI.getChat(id);
  if (chat !== undefined) {
    if (done !== undefined) {
      Store.SendSeen(chat, false).then(function () {
        done(true);
      });
      return true;
    } else {
      Store.SendSeen(chat, false);
      return true;
    }
  }
  if (done !== undefined) done();
  return false;
};

function isChatMessage(message) {
  if (message.isSentByMe) {
    return false;
  }
  if (message.isNotification) {
    return false;
  }
  if (!message.isUserCreatedType) {
    return false;
  }
  return true;
}

window.WAPI.getUnreadMessages = function (
  includeMe,
  includeNotifications,
  use_unread_count,
  done
) {
  const chats = window.Store.Chat.models;
  let output = [];

  for (let chat in chats) {
    if (isNaN(chat)) {
      continue;
    }

    let messageGroupObj = chats[chat];
    let messageGroup = WAPI._serializeChatObj(messageGroupObj);

    messageGroup.messages = [];

    const messages = messageGroupObj.msgs._models;
    for (let i = messages.length - 1; i >= 0; i--) {
      let messageObj = messages[i];
      if (
        typeof messageObj.isNewMsg != 'boolean' ||
        messageObj.isNewMsg === false
      ) {
        continue;
      } else {
        messageObj.isNewMsg = false;
        let message = WAPI.processMessageObj(
          messageObj,
          includeMe,
          includeNotifications
        );
        if (message) {
          messageGroup.messages.push(message);
        }
      }
    }

    if (messageGroup.messages.length > 0) {
      output.push(messageGroup);
    } else {
      // no messages with isNewMsg true
      if (use_unread_count) {
        let n = messageGroupObj.unreadCount; // will use unreadCount attribute to fetch last n messages from sender
        for (let i = messages.length - 1; i >= 0; i--) {
          let messageObj = messages[i];
          if (n > 0) {
            if (!messageObj.isSentByMe) {
              let message = WAPI.processMessageObj(
                messageObj,
                includeMe,
                includeNotifications
              );
              messageGroup.messages.unshift(message);
              n -= 1;
            }
          } else if (n === -1) {
            // chat was marked as unread so will fetch last message as unread
            if (!messageObj.isSentByMe) {
              let message = WAPI.processMessageObj(
                messageObj,
                includeMe,
                includeNotifications
              );
              messageGroup.messages.unshift(message);
              break;
            }
          } else {
            // unreadCount = 0
            break;
          }
        }
        if (messageGroup.messages.length > 0) {
          messageGroupObj.unreadCount = 0; // reset unread counter
          output.push(messageGroup);
        }
      }
    }
  }
  if (done !== undefined) {
    done(output);
  }
  return output;
};

window.WAPI.getGroupOwnerID = async function (id, done) {
  const output = (await WAPI.getGroupMetadata(id)).owner.id;
  if (done !== undefined) {
    done(output);
  }
  return output;
};

window.WAPI.getCommonGroups = async function (id, done) {
  let output = [];

  groups = window.WAPI.getAllGroups();

  for (let idx in groups) {
    try {
      participants = await window.WAPI.getGroupParticipantIDs(groups[idx].id);
      if (participants.filter((participant) => participant == id).length) {
        output.push(groups[idx]);
      }
    } catch (err) {
      console.log('Error in group:');
      console.log(groups[idx]);
      console.log(err);
    }
  }

  if (done !== undefined) {
    done(output);
  }
  return output;
};

window.WAPI.getProfilePicFromServer = function (id) {
  return Store.WapQuery.profilePicFind(id).then((x) => x.eurl);
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

window.WAPI.downloadFileWithCredentials = function (url, done) {
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
  xhr.withCredentials = true;
  xhr.responseType = 'blob';
  xhr.send(null);
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

window.WAPI.getBatteryLevel = function (done) {
  if (window.Store.Conn.plugged) {
    if (done !== undefined) {
      done(100);
    }
    return 100;
  }
  output = window.Store.Conn.battery;
  if (done !== undefined) {
    done(output);
  }
  return output;
};

window.WAPI.deleteConversation = function (chatId, done) {
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

  window.Store.sendDelete(conversation, false)
    .then(() => {
      if (done !== undefined) {
        done(true);
      }
    })
    .catch(() => {
      if (done !== undefined) {
        done(false);
      }
    });

  return true;
};

window.WAPI.smartDeleteMessages = function (
  chatId,
  messageArray,
  onlyLocal,
  done
) {
  var userId = new Store.WidFactory.createWid(chatId);
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

  let messagesToDelete = messageArray
    .map((msgId) =>
      typeof msgId == 'string' ? window.Store.Msg.get(msgId) : msgId
    )
    .filter((x) => x);
  if (messagesToDelete.length == 0) return true;
  let jobs = onlyLocal
    ? [conversation.sendDeleteMsgs(messagesToDelete, conversation)]
    : [
        conversation.sendRevokeMsgs(
          messagesToDelete.filter((msg) => msg.isSentByMe),
          conversation
        ),
        conversation.sendDeleteMsgs(
          messagesToDelete.filter((msg) => !msg.isSentByMe),
          conversation
        ),
      ];
  return Promise.all(jobs).then((_) => {
    if (done !== undefined) {
      done(true);
    }
    return true;
  });
};

window.WAPI.deleteMessage = function (
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

window.WAPI.clearChat = async function (id) {
  return await Store.ChatUtil.sendClear(Store.Chat.get(id), true);
};

window.WAPI.checkNumberStatus = async function (id, done) {
  try {
    const result = await window.Store.WapQuery.queryExist(id);
    if (result.jid === undefined) throw 404;
    const data = window.WAPI._serializeNumberStatusObj(result);
    if (data.status == 200) data.numberExists = true;
    if (done !== undefined) {
      done(window.WAPI._serializeNumberStatusObj(result));
      done(data);
    }
    return data;
  } catch (e) {
    if (done !== undefined) {
      done(
        window.WAPI._serializeNumberStatusObj({
          status: e,
          jid: id,
        })
      );
    }
    return e;
  }
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

window.WAPI._newMessagesListener = window.Store.Msg.on('add', (newMessage) => {
  if (newMessage && newMessage.isNewMsg && !newMessage.isSentByMe) {
    let message = window.WAPI.processMessageObj(newMessage, false, false);
    if (message) {
      window.WAPI._newMessagesQueue.push(message);
      window.WAPI._newMessagesBuffer.push(message);
    }

    // Starts debouncer time to don't call a callback for each message if more than one message arrives
    // in the same second
    if (
      !window.WAPI._newMessagesDebouncer &&
      window.WAPI._newMessagesQueue.length > 0
    ) {
      window.WAPI._newMessagesDebouncer = setTimeout(() => {
        let queuedMessages = window.WAPI._newMessagesQueue;

        window.WAPI._newMessagesDebouncer = null;
        window.WAPI._newMessagesQueue = [];

        let removeCallbacks = [];

        window.WAPI._newMessagesCallbacks.forEach(function (callbackObj) {
          if (callbackObj.callback !== undefined) {
            callbackObj.callback(queuedMessages);
          }
          if (callbackObj.rmAfterUse === true) {
            removeCallbacks.push(callbackObj);
          }
        });

        // Remove removable callbacks.
        removeCallbacks.forEach(function (rmCallbackObj) {
          let callbackIndex = window.WAPI._newMessagesCallbacks.indexOf(
            rmCallbackObj
          );
          window.WAPI._newMessagesCallbacks.splice(callbackIndex, 1);
        });
      }, 1000);
    }
  }
});

window.WAPI._unloadInform = (event) => {
  // Save in the buffer the ungot unreaded messages
  window.WAPI._newMessagesBuffer.forEach((message) => {
    Object.keys(message).forEach((key) =>
      message[key] === undefined ? delete message[key] : ''
    );
  });
  sessionStorage.setItem(
    'saved_msgs',
    JSON.stringify(window.WAPI._newMessagesBuffer)
  );

  // Inform callbacks that the page will be reloaded.
  window.WAPI._newMessagesCallbacks.forEach(function (callbackObj) {
    if (callbackObj.callback !== undefined) {
      callbackObj.callback({
        status: -1,
        message: 'page will be reloaded, wait and register callback again.',
      });
    }
  });
};

window.addEventListener('unload', window.WAPI._unloadInform, false);
window.addEventListener('beforeunload', window.WAPI._unloadInform, false);
window.addEventListener('pageunload', window.WAPI._unloadInform, false);

/**
 * Registers a callback to be called when a new message arrives the WAPI.
 * @param rmCallbackAfterUse - Boolean - Specify if the callback need to be executed only once
 * @param done - function - Callback function to be called when a new message arrives.
 * @returns {boolean}
 */
window.WAPI.waitNewMessages = function (rmCallbackAfterUse = true, done) {
  window.WAPI._newMessagesCallbacks.push({
    callback: done,
    rmAfterUse: rmCallbackAfterUse,
  });
  return true;
};

window.WAPI.addAllNewMessagesListener = (callback) =>
  window.Store.Msg.on('add', (newMessage) => {
    if (newMessage && newMessage.isNewMsg) {
      let message = window.WAPI.processMessageObj(newMessage, true, false);
      if (message) {
        callback(message);
      }
    }
  });

/**
 * Registers a callback to be called when a the acknowledgement state of the phone connection.
 * @param callback - function - Callback function to be called when the device state changes. this returns 'CONNECTED' or 'TIMEOUT'
 * @returns {boolean}
 */
window.WAPI.onStateChanged = function (callback) {
  // (x,y)=>console.log('statechanged',x,x.state)
  window.Store.State.default.on('change:state', callback);
  return true;
};

/**
 * Registers a callback to be called when a the acknowledgement state of a message changes.
 * @param callback - function - Callback function to be called when a message acknowledgement changes.
 * @returns {boolean}
 */
window.WAPI.waitNewAcknowledgements = function (callback) {
  Store.Msg.on('change:ack', callback);
  return true;
};

window.WAPI.onLiveLocation = function (chatId, callback) {
  var lLChat = Store.LiveLocation.get(chatId);
  if (lLChat) {
    var validLocs = lLChat.participants.validLocations();
    validLocs.map((x) =>
      x.on('change:lastUpdated', (x, y, z) => {
        console.log(x, y, z);
        const { id, lat, lng, accuracy, degrees, speed, lastUpdated } = x;
        const l = {
          id: id.toString(),
          lat,
          lng,
          accuracy,
          degrees,
          speed,
          lastUpdated,
        };
        // console.log('newloc',l)
        callback(l);
      })
    );
    return true;
  } else {
    return false;
  }
};
/**
 * Registers a callback to participant changes on a certain, specific group
 * @param groupId - string - The id of the group that you want to attach the callback to.
 * @param callback - function - Callback function to be called when a message acknowledgement changes. The callback returns 3 variables
 * @returns {boolean}
 */
var groupParticpiantsEvents = {};
window.WAPI.onParticipantsChanged = function (groupId, callback) {
  const subtypeEvents = [
    'invite',
    'add',
    'remove',
    'leave',
    'promote',
    'demote',
  ];
  const chat = window.Store.Chat.get(groupId);
  //attach all group Participants to the events object as 'add'
  const metadata = window.Store.GroupMetadata.get(groupId);
  if (!groupParticpiantsEvents[groupId]) {
    groupParticpiantsEvents[groupId] = {};
    metadata.participants.forEach((participant) => {
      groupParticpiantsEvents[groupId][participant.id.toString()] = {
        subtype: 'add',
        from: metadata.owner,
      };
    });
  }
  let i = 0;
  chat.on('change:groupMetadata.participants', (_) =>
    chat.on('all', (x, y) => {
      const { isGroup, previewMessage } = y;
      if (
        isGroup &&
        x === 'change' &&
        previewMessage &&
        previewMessage.type === 'gp2' &&
        subtypeEvents.includes(previewMessage.subtype)
      ) {
        const { subtype, from, recipients } = previewMessage;
        const rec = recipients[0].toString();
        if (
          groupParticpiantsEvents[groupId][rec] &&
          groupParticpiantsEvents[groupId][recipients[0]].subtype == subtype
        ) {
          //ignore, this is a duplicate entry
          // console.log('duplicate event')
        } else {
          //ignore the first message
          if (i == 0) {
            //ignore it, plus 1,
            i++;
          } else {
            groupParticpiantsEvents[groupId][rec] = { subtype, from };
            //fire the callback
            // // previewMessage.from.toString()
            // x removed y
            // x added y
            callback({
              by: from.toString(),
              action: subtype,
              who: recipients,
            });
            chat.off('all', this);
            i = 0;
          }
        }
      }
    })
  );
  return true;
};

/**
 * Registers a callback that fires when your host phone is added to a group.
 * @param callback - function - Callback function to be called when a message acknowledgement changes. The callback returns 3 variables
 * @returns {boolean}
 */
window.WAPI.onAddedToGroup = function (callback) {
  Store.Chat.on('add', (chatObject) => {
    if (chatObject && chatObject.isGroup) {
      callback(chatObject);
    }
  });
  return true;
};

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
/** End new messages observable functions **/

window.WAPI.sendImage = function (imgBase64, chatid, filename, caption, done) {
  //var idUser = new window.Store.UserConstructor(chatid);
  var idUser = new Store.WidFactory.createWid(chatid);
  // create new chat
  return Store.Chat.find(idUser).then((chat) => {
    var mediaBlob = window.WAPI.base64ImageToFile(imgBase64, filename);
    window.WAPI.procFiles(chat, mediaBlob).then((mc) => {
      var media = mc.models[0];
      media.sendToChat(chat, { caption: caption });
      if (done !== undefined) done(true);
    });
  });
};

/**
 * This function sts the profile name of the number. For future reference, setProfilePic is for profile pic,
 * @param newName - string the new name to set as profile name
 */
window.WAPI.setMyName = async function (newName) {
  if (!Store.Versions.default[11].BinaryProtocol)
    Store.Versions.default[11].BinaryProtocol = new Store.bp(11);
  return await Store.Versions.default[11].setPushname(newName);
};

/**
 * Update your status
 *   @param newStatus string new Status
 */
window.WAPI.setMyStatus = function (newStatus) {
  return Store.MyStatus.setMyStatus(newStatus);
};

window.WAPI.sendVideoAsGif = function (
  imgBase64,
  chatid,
  filename,
  caption,
  done
) {
  //var idUser = new window.Store.UserConstructor(chatid);
  var idUser = new Store.WidFactory.createWid(chatid);
  // create new chat
  return Store.Chat.find(idUser).then((chat) => {
    var mediaBlob = window.WAPI.base64ImageToFile(imgBase64, filename);
    var mc = new Store.MediaCollection(chat);
    window.WAPI.procFiles(chat, mediaBlob).then((mc) => {
      var media = mc.models[0];
      media.mediaPrep._mediaData.isGif = true;
      media.mediaPrep._mediaData.gifAttribution = 1;
      media.mediaPrep.sendToChat(chat, { caption: caption });
      if (done !== undefined) done(true);
    });
  });
};

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

window.WAPI.procFiles = async function (chat, blobs) {
  if (!Array.isArray(blobs)) {
    blobs = [blobs];
  }
  var mc = new Store.MediaCollection(chat);
  await mc.processFiles(
    Debug.VERSION === '0.4.613'
      ? blobs
      : blobs.map((blob) => {
          return { file: blob };
        }),
    chat,
    1
  );
  return mc;
};
/**
 * Sends product with image to chat
 * @param imgBase64 Base64 image data
 * @param chatid string the id of the chat that you want to send this product to
 * @param caption string the caption you want to add to this message
 * @param bizNumber string the @c.us number of the business account from which you want to grab the product
 * @param productId string the id of the product within the main catalog of the aforementioned business
 * @param done - function - Callback function to be called contained the buffered messages.
 * @returns
 */
window.WAPI.sendImageWithProduct = function (
  imgBase64,
  chatid,
  caption,
  bizNumber,
  productId,
  done
) {
  Store.Catalog.findCarouselCatalog(bizNumber).then((cat) => {
    if (cat && cat[0]) {
      const product = cat[0].productCollection.get(productId);
      const temp = {
        productMsgOptions: {
          businessOwnerJid: product.catalogWid.toString({
            legacy: !0,
          }),
          productId: product.id.toString(),
          url: product.url,
          productImageCount: product.productImageCollection.length,
          title: product.name,
          description: product.description,
          currencyCode: product.currency,
          priceAmount1000: product.priceAmount1000,
          type: 'product',
        },
        caption,
      };

      var idUser = new Store.WidFactory.createWid(chatid);

      return Store.Chat.find(idUser).then((chat) => {
        var mediaBlob = window.WAPI.base64ImageToFile(imgBase64, filename);
        // var mc = new Store.MediaCollection(chat);
        // mc.processFiles([mediaBlob], chat, 1)
        window.WAPI.procFiles(chat, mediaBlob).then((mc) => {
          var media = mc.models[0];
          Object.entries(temp.productMsgOptions).map(
            ([k, v]) => (media.mediaPrep._mediaData[k] = v)
          );
          media.mediaPrep.sendToChat(chat, temp);
          if (done !== undefined) done(true);
        });
      });
    }
  });
};

window.WAPI.base64ImageToFile = function (b64Data, filename) {
  var arr = b64Data.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

/**
 * Send contact card to a specific chat using the chat ids
 *
 * @param {string} to '000000000000@c.us'
 * @param {string|array} contact '111111111111@c.us' | ['222222222222@c.us', '333333333333@c.us, ... 'nnnnnnnnnnnn@c.us']
 */
window.WAPI.sendContact = function (to, contact) {
  if (!Array.isArray(contact)) {
    contact = [contact];
  }
  contact = contact.map((c) => {
    return WAPI.getChat(c).__x_contact;
  });

  if (contact.length > 1) {
    window.WAPI.getChat(to).sendContactList(contact);
  } else if (contact.length === 1) {
    window.WAPI.getChat(to).sendContact(contact[0]);
  }
};

/**
 * Forward an array of messages to a specific chat using the message ids or Objects
 *
 * @param {string} to '000000000000@c.us'
 * @param {string|array[Message | string]} messages this can be any mixture of message ids or message objects
 * @param {boolean} skipMyMessages This indicates whether or not to skip your own messages from the array
 */
window.WAPI.forwardMessages = async function (to, messages, skipMyMessages) {
  if (!Array.isArray(messages)) {
    messages = [messages];
  }
  const finalForwardMessages = messages
    .map((msg) => {
      if (typeof msg == 'string') {
        //msg is string, get the message object
        return window.Store.Msg.get(msg);
      } else {
        return window.Store.Msg.get(msg.id);
      }
    })
    .filter((msg) => (skipMyMessages ? !msg.__x_isSentByMe : true));

  // let userId = new window.Store.UserConstructor(to);
  let conversation = window.Store.Chat.get(to);
  return await conversation.forwardMessages(finalForwardMessages);
};

/**
 * Create an chat ID based in a cloned one
 *
 * @param {string} chatId '000000000000@c.us'
 */
window.WAPI.getNewMessageId = function (chatId) {
  var newMsgId = new Store.MsgKey(
    Object.assign({}, Store.Msg.models[0].__x_id)
  );
  // .clone();

  newMsgId.fromMe = true;
  newMsgId.id = getNewId().toUpperCase();
  newMsgId.remote = chatId;
  newMsgId._serialized = `${newMsgId.fromMe}_${newMsgId.remote}_${newMsgId.id}`;

  return newMsgId;
};

/**
 * Simulate '...typing' in the chat.
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {boolean} on true to turn on similated typing, false to turn it off //you need to manually turn this off.
 */
window.WAPI.simulateTyping = async function (chatId, on) {
  if (on) await Store.ChatStates.sendChatStateComposing(chatId);
  else await Store.ChatStates.sendChatStatePaused(chatId);
};

/**
 * Send location
 *
 * @param {string} chatId '000000000000@c.us'
 * @param {string} lat latitude
 * @param {string} lng longitude
 * @param {string} loc Text to go with the location message
 */
window.WAPI.sendLocation = async function (chatId, lat, lng, loc) {
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
    type: 'location',
    lat,
    lng,
    loc,
    clientUrl: undefined,
    directPath: undefined,
    filehash: undefined,
    uploadhash: undefined,
    mediaKey: undefined,
    isQuotedMsgAvailable: false,
    invis: false,
    mediaKeyTimestamp: undefined,
    mimetype: undefined,
    height: undefined,
    width: undefined,
    ephemeralStartTimestamp: undefined,
    body: undefined,
    mediaData: undefined,
    isQuotedMsgAvailable: false,
  };
  Object.assign(tempMsg, extend);
  return await Promise.all(Store.addAndSendMsgToChat(chat, tempMsg));
};

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

window.WAPI.reply = async function (chatId, body, quotedMsg) {
  if (typeof quotedMsg !== 'object') quotedMsg = Store.Msg.get(quotedMsg);
  var chat = Store.Chat.get(chatId);
  let extras = {
    quotedParticipant: quotedMsg.author || quotedMsg.from,
    quotedStanzaID: quotedMsg.id.id,
  };
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
    type: 'chat',
    quotedMsg,
    body,
    ...extras,
  };
  Object.assign(tempMsg, extend);
  await Store.addAndSendMsgToChat(chat, tempMsg);
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
 * @private
 * Send Sticker
 * @param {*} sticker
 * @param {*} chatId '000000000000@c.us'
 * @param metadata about the image. Based on [sharp metadata](https://sharp.pixelplumbing.com/api-input#metadata)
 */
window.WAPI._sendSticker = async function (sticker, chatId, metadata) {
  var chat = Store.Chat.get(chatId);
  let stick = new window.Store.Sticker.modelClass();
  stick.__x_clientUrl = sticker.clientUrl;
  stick.__x_filehash = sticker.filehash;
  stick.__x_id = sticker.filehash;
  stick.__x_uploadhash = sticker.uploadhash;
  stick.__x_mediaKey = sticker.mediaKey;
  stick.__x_initialized = false;
  stick.__x_mediaData.mediaStage = 'INIT';
  stick.mimetype = 'image/webp';
  stick.height = metadata && metadata.height ? metadata.height : 512;
  stick.width = metadata && metadata.width ? metadata.width : 512;
  await stick.initialize();
  return await stick.sendToChat(chat);
};

window.WAPI.getFileHash = async (data) => {
  let buffer = await data.arrayBuffer();
  var sha = new jsSHA('SHA-256', 'ARRAYBUFFER');
  sha.update(buffer);
  return sha.getHash('B64');
};

window.WAPI.generateMediaKey = async (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * @param type: The type of file.  {'audio' | 'sticker' | 'video' | 'product' | 'document' | 'gif' | 'image' | 'ptt' | 'template' | 'history' | 'ppic'}
 * @param blob: file
 */
window.WAPI.encryptAndUploadFile = async function (type, blob) {
  let filehash = await window.WAPI.getFileHash(blob);
  let mediaKey = await window.WAPI.generateMediaKey(32);
  let controller = new AbortController();
  let signal = controller.signal;
  let encrypted = await window.Store.UploadUtils.encryptAndUpload({
    blob,
    type,
    signal,
    mediaKey,
  });
  return {
    ...encrypted,
    clientUrl: encrypted.url,
    filehash,
    id: filehash,
    uploadhash: encrypted.encFilehash,
  };
};

/**
 * Send Image As Sticker
 * @param {*} imageBase64 A valid webp image is required.
 * @param {*} chatId '000000000000@c.us'
 * @param metadata about the image. Based on [sharp metadata](https://sharp.pixelplumbing.com/api-input#metadata)
 */
window.WAPI.sendImageAsSticker = async function (
  imageBase64,
  chatId,
  metadata
) {
  let mediaBlob = await window.WAPI.base64ImageToFile(
    'data:image/webp;base64,' + imageBase64,
    'file.webp'
  );
  let encrypted = await window.WAPI.encryptAndUploadFile('sticker', mediaBlob);
  return await window.WAPI._sendSticker(encrypted, chatId, metadata);
};

/**
This will dump all possible stickers into the chat. ONLY FOR TESTING. THIS IS REALLY ANNOYING!!
*/
window.WAPI._STICKERDUMP = async function (chatId) {
  var chat = Store.Chat.get(chatId);
  let prIdx = await Store.StickerPack.pageWithIndex(0);
  await Store.StickerPack.fetchAt(0);
  await Store.StickerPack._pageFetchPromises[prIdx];
  return await Promise.race(
    Store.StickerPack.models.forEach((pack) =>
      pack.stickers
        .fetch()
        .then((_) =>
          pack.stickers.models.forEach((stkr) => stkr.sendToChat(chat))
        )
    )
  ).catch((e) => {});
};

/**
 * This next line is jsSha
 */
