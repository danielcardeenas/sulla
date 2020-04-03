import { Page } from 'puppeteer';
import * as sharp from 'sharp';
import {
  getConnectionState,
  reply,
  sendFile,
  sendImage,
  sendMessageWithThumb,
  sendTextWithTags,
  setChatState,
  setProfileName,
  setProfileStatus,
  sendFileFromBase64,
} from './functions';
import { sendText } from './functions/send-text';
import { base64MimeType } from './helpers';
import { ExposedFn } from './helpers/exposed.enum';
import {
  Ack,
  Chat,
  Contact,
  Id,
  PartialMessage,
  ParticipantEvent,
  HostDevice,
} from './model';
import { SocketState } from './model/enum/socket-state';
import { LiveLocation } from './model/live-location';
import { Message } from './model/message';
declare module WAPI {
  const waitNewMessages: (rmCallback: boolean, callback: Function) => void;
  const allNewMessagesListener: (callback: Function) => void;
  const onStateChange: (callback: Function) => void;
  const onAddedToGroup: (callback: Function) => any;
  const onParticipantsChanged: (groupId: string, callback: Function) => any;
  const onLiveLocation: (chatId: string, callback: Function) => any;
  const getGeneratedUserAgent: (userAgent?: string) => string;
  const forwardMessages: (
    to: string,
    messages: string | (string | Message)[],
    skipMyMessages: boolean
  ) => any;
  const sendLocation: (to: string, lat: any, lng: any, loc: string) => void;
  const addParticipant: (groupId: string, contactId: string) => void;
  const getStatus: (contactId: string) => void;
  const getGroupAdmins: (groupId: string) => Contact[];
  const removeParticipant: (groupId: string, contactId: string) => void;
  const promoteParticipant: (groupId: string, contactId: string) => void;
  const demoteParticipant: (groupId: string, contactId: string) => void;
  const sendImageAsSticker: (
    webpBase64: string,
    to: string,
    metadata?: any
  ) => void;
  const createGroup: (
    groupName: string,
    contactId: string | string[]
  ) => Promise<any>;
  const sendSeen: (to: string) => void;
  const deleteConversation: (chatId: string) => boolean;
  const clearChat: (chatId: string) => void;
  const getGroupInviteLink: (chatId: string) => Promise<string> | boolean;
  const getBusinessProfilesProducts: (to: string) => any;
  const sendImageWithProduct: (
    base64: string,
    to: string,
    caption: string,
    bizNumber: string,
    productId: string
  ) => any;
  const sendVideoAsGif: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => void;
  const getAllContacts: () => Contact[];
  const getWAVersion: () => String;
  const getHost: () => HostDevice;
  const getAllUnreadMessages: () => PartialMessage[];
  const getAllChatsWithMessages: (withNewMessageOnly?: boolean) => any;
  const getAllChats: () => Chat[];
  const getBatteryLevel: () => Number;
  const getChat: (contactId: string) => Chat;
  const getProfilePicFromServer: (chatId: string) => any;
  const getAllChatIds: () => string[];
  const getAllChatsWithNewMsg: () => Chat[];
  const getAllNewMessages: () => any;
  const getAllGroups: () => Chat[];
  const getGroupParticipantIDs: (groupId: string) => Id[];
  const leaveGroup: (groupId: string) => any;
  const getContact: (contactId: string) => Contact;
  const getNumberProfile: (contactId: string) => any;
  const getChatById: (contactId: string) => Chat;
  const deleteMessages: (
    contactId: string,
    messageId: string[] | string,
    onlyLocal: boolean
  ) => any;
  const sendContact: (to: string, contact: string | string[]) => any;
  const startTyping: (to: string) => void;
  const stopTyping: (to: string) => void;
  const isConnected: () => Boolean;
  const loadEarlierMessages: (contactId: string) => Message[];
  const loadAllEarlierMessages: (contactId: string) => void;
  const asyncLoadAllEarlierMessages: (contactId: string) => void;
  const getUnreadMessages: (
    includeMe: boolean,
    includeNotifications: boolean,
    use_unread_count: boolean
  ) => any;
  const getAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => [Message];
  const loadAndGetAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => [Message];
  const sendMessageMentioned: (...args: any) => any;
}

declare global {
  interface Window {
    l10n: any;
  }
}

export class Whatsapp {
  constructor(public page: Page) {
    this.page = page;
  }

  /**
   * Listens to messages received
   * @returns Observable stream of messages
   */
  public onMessage(fn: (message: Message) => void) {
    this.page.exposeFunction(ExposedFn.OnMessage, (message: Message) =>
      fn(message)
    );
  }

  /**
   * @event Listens to all new messages
   * @param to callback
   * @fires Message
   */
  public async onAnyMessage(fn: (message: Message) => void) {
    this.page
      .exposeFunction(ExposedFn.OnAnyMessage, (message: Message) => fn(message))
      .then((_) =>
        this.page.evaluate(() => {
          WAPI.allNewMessagesListener(window['onAnyMessage']);
        })
      );
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public onStateChange(fn: (state: SocketState) => void) {
    this.page
      .exposeFunction(ExposedFn.onStateChange, (state: SocketState) =>
        fn(state)
      )
      .then(() =>
        this.page.evaluate(() => {
          WAPI.onStateChange((_) => window['onStateChange'](_.state));
        })
      );
  }

  /**
   * @event Listens to messages acknowledgement Changes
   * @returns Observable stream of messages
   */
  public onAck(fn: (ack: Ack) => void) {
    this.page.exposeFunction(ExposedFn.onAck, (ack: Ack) => fn(ack));
  }

  /**
   * @event Listens to live locations from a chat that already has valid live locations
   * @param chatId the chat from which you want to subscribes to live location updates
   * @param fn callback that takes in a LiveLocation
   * @returns boolean, if returns false then there were no valid live locations in the chat of chatId
   * @emits <LiveLocation> LiveLocation
   */
  public async onLiveLocation(
    chatId: string,
    fn: (liveLocationChangedEvent: LiveLocation) => void
  ) {
    const method = 'onLiveLocation_' + chatId.replace('_', '').replace('_', '');
    return this.page
      .exposeFunction(method, (liveLocationChangedEvent: LiveLocation) =>
        fn(liveLocationChangedEvent)
      )
      .then((_) =>
        this.page.evaluate(
          ({ chatId, method }) => {
            //@ts-ignore
            return WAPI.onLiveLocation(chatId, window[method]);
          },
          { chatId, method }
        )
      );
  }

  /**
   * @param to group id: xxxxx-yyyy@us.c
   * @param to callback
   * @returns Stream of ParticipantEvent
   */
  public async onParticipantsChanged(
    groupId: string,
    fn: (participantChangedEvent: ParticipantEvent) => void
  ) {
    const method =
      'onParticipantsChanged_' + groupId.replace('_', '').replace('_', '');
    return this.page
      .exposeFunction(method, (participantChangedEvent: ParticipantEvent) =>
        fn(participantChangedEvent)
      )
      .then((_) =>
        this.page.evaluate(
          ({ groupId, method }) => {
            //@ts-ignore
            WAPI.onParticipantsChanged(groupId, window[method]);
          },
          { groupId, method }
        )
      );
  }

  /**
   * @event Fires callback with Chat object every time the host phone is added to a group.
   * @param to callback
   * @returns Observable stream of Chats
   */
  public async onAddedToGroup(fn: (chat: Chat) => any) {
    const method = 'onAddedToGroup';
    return this.page
      .exposeFunction(method, (chat: any) => fn(chat))
      .then((_) =>
        this.page.evaluate(() => {
          //@ts-ignore
          WAPI.onAddedToGroup(window.onAddedToGroup);
        })
      );
  }

  /**
   * Sets current user profile status
   * @param status
   */
  public setProfileStatus = setProfileStatus;

  /**
   * Sets current user profile name
   * @param name
   */
  public setProfileName = setProfileName;

  /**
   * Sets the chat state
   * @param chatState Chat state to be set (TYPING (0), RECRDING (1) or PAUSED (2)).
   * @param chatId
   */
  public setChatState = setChatState;

  /**
   * Retrieves the connecction state
   */
  public getConnectionState = getConnectionState;

  /**
   * Sends a text message to given chat
   * @param to chat id: xxxxx@us.c
   * @param content text message
   */
  public sendText = sendText;

  /**
   * Sends image message
   * @param to Chat id
   * @param imgBase64
   * @param filename
   * @param caption
   */
  public sendImage = sendImage;

  /**
   * Sends text message with @tags mentions
   *
   * Example:
   * "Hello @8114285934 from sulla!"
   * @param to chat id
   * @param content message body
   * @returns message id
   */
  public sendTextWithTags = sendTextWithTags;

  /**
   * Sends message with thumbnail
   * @param thumb
   * @param url
   * @param title
   * @param description
   * @param chatId
   */
  public sendMessageWithThumb = sendMessageWithThumb;

  /**
   * Replies to given mesage id of given chat id
   * @param to Chat id
   * @param content Message body
   * @param quotedMsg Message id to reply to.
   */
  public reply = reply;

  /**
   * Sends file
   * base64 parameter should have mime type already defined
   * @param to Chat id
   * @param base64 base64 data
   * @param filename
   * @param caption
   */
  public sendFileFromBase64 = sendFileFromBase64;

  /**
   * Sends file from path
   * @param to Chat id
   * @param path File path
   * @param filename
   * @param caption
   */
  public sendFile = sendFile;

  /**
   * Sends a video to given chat as a gif, with caption or not, using base64
   * @param to chat id xxxxx@us.c
   * @param base64 base64 data:video/xxx;base64,xxx
   * @param filename string xxxxx
   * @param caption string xxxxx
   */
  public async sendVideoAsGif(
    to: string,
    base64: string,
    filename: string,
    caption: string
  ) {
    return await this.page.evaluate(
      ({ to, base64, filename, caption }) => {
        WAPI.sendVideoAsGif(base64, to, filename, caption);
      },
      { to, base64, filename, caption }
    );
  }

  /**
   * Returns an object with all of your host device details
   */
  public async getHostDevice() {
    return await this.page.evaluate(() => WAPI.getHost());
  }

  /**
   * Find any product listings of the given number. Use this to query a catalog
   *
   * @param id id of buseinss profile (i.e the number with @c.us)
   * @param done Optional callback function for async execution
   * @returns None
   */
  public async getBusinessProfilesProducts(id: string) {
    return await this.page.evaluate(
      ({ id }) => {
        WAPI.getBusinessProfilesProducts(id);
      },
      { id }
    );
  }

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
  public async sendImageWithProduct(
    to: string,
    base64: string,
    caption: string,
    bizNumber: string,
    productId: string
  ) {
    return await this.page.evaluate(
      ({ to, base64, bizNumber, caption, productId }) => {
        WAPI.sendImageWithProduct(base64, to, caption, bizNumber, productId);
      },
      { to, base64, bizNumber, caption, productId }
    );
  }

  /**
   * Sends contact card to given chat id
   * @param {string} to 'xxxx@c.us'
   * @param {string|array} contact 'xxxx@c.us' | ['xxxx@c.us', 'yyyy@c.us', ...]
   */
  public async sendContact(to: string, contactId: string | string[]) {
    return await this.page.evaluate(
      ({ to, contactId }) => WAPI.sendContact(to, contactId),
      { to, contactId }
    );
  }

  /**
   * Simulates '...typing' state
   * @param {string} to Chat id
   */
  public async startTyping(to: string) {
    return await this.page.evaluate(({ to }) => WAPI.startTyping(to), { to });
  }

  /**
   * Stops typing
   * @param to Chat id
   */
  public async stopTyping(to: string) {
    return await this.page.evaluate(({ to }) => WAPI.stopTyping(to), { to });
  }

  /**
   * Forward an array of messages to a specific chat using the message ids or Objects
   *
   * @param {string} to '000000000000@c.us'
   * @param {string|array[Message | string]} messages this can be any mixture of message ids or message objects
   * @param {boolean} skipMyMessages This indicates whether or not to skip your own messages from the array
   */

  public async forwardMessages(
    to: string,
    messages: any,
    skipMyMessages: boolean
  ) {
    return await this.page.evaluate(
      ({ to, messages, skipMyMessages }) =>
        WAPI.forwardMessages(to, messages, skipMyMessages),
      { to, messages, skipMyMessages }
    );
  }

  /**
   * Retrieves all contacts
   * @returns array of [Contact]
   */
  public async getAllContacts() {
    return await this.page.evaluate(() => WAPI.getAllContacts());
  }

  public async getWAVersion() {
    return await this.page.evaluate(() => WAPI.getWAVersion());
  }

  /**
   * Retrieves if the phone is online. Please note that this may not be real time.
   * @returns Boolean
   */
  public async isConnected() {
    return await this.page.evaluate(() => WAPI.isConnected());
  }

  /**
   * Retrieves Battery Level
   * @returns Number
   */
  public async getBatteryLevel() {
    return await this.page.evaluate(() => WAPI.getBatteryLevel());
  }

  /**
   * Retrieves all chats
   * @returns array of [Chat]
   */
  public async getAllChats(withNewMessageOnly = false) {
    if (withNewMessageOnly) {
      return this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
    } else {
      return this.page.evaluate(() => WAPI.getAllChats());
    }
  }

  /**
   * Retrieves all chats with messages
   * @returns array of [Chat]
   */
  public async getAllChatsWithMessages(withNewMessageOnly = false) {
    return this.page.evaluate(
      (withNewMessageOnly) => WAPI.getAllChatsWithMessages(withNewMessageOnly),
      withNewMessageOnly
    );
  }

  /**
   * Retrieve all groups
   * @returns array of groups
   */
  public async getAllGroups(withNewMessagesOnly = false) {
    if (withNewMessagesOnly) {
      // prettier-ignore
      const chats = await this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
      return chats.filter((chat) => chat.isGroup);
    } else {
      const chats = await this.page.evaluate(() => WAPI.getAllChats());
      return chats.filter((chat) => chat.isGroup);
    }
  }

  /**
   * Retrieves group members as [Id] objects
   * @param groupId group id
   */
  public async getGroupMembersId(groupId: string) {
    return this.page.evaluate(
      (groupId) => WAPI.getGroupParticipantIDs(groupId),
      groupId
    );
  }

  /**
   * Removes the host device from the group
   * @param groupId group id
   */
  public async leaveGroup(groupId: string) {
    return this.page.evaluate((groupId) => WAPI.leaveGroup(groupId), groupId);
  }

  /**
   * Returns group members [Contact] objects
   * @param groupId
   */
  public async getGroupMembers(groupId: string) {
    const membersIds = await this.getGroupMembersId(groupId);
    const actions = membersIds.map((memberId) => {
      return this.getContact(memberId._serialized);
    });
    return Promise.all(actions);
  }

  /**
   * Retrieves contact detail object of given contact id
   * @param contactId
   * @returns contact detial as promise
   */
  public async getContact(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getContact(contactId),
      contactId
    );
  }

  /**
   * Retrieves chat object of given contact id
   * @param contactId
   * @returns contact detial as promise
   */
  public async getChatById(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getChatById(contactId),
      contactId
    );
  }

  /**
   * Retrieves chat object of given contact id
   * @param contactId
   * @returns contact detial as promise
   */
  public async getChat(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.getChat(contactId),
      contactId
    );
  }

  /**
   * Retrieves chat picture
   * @param chatId
   * @returns Url of the chat picture or undefined if there is no picture for the chat.
   */
  public async getProfilePicFromServer(chatId: string) {
    return this.page.evaluate(
      (chatId) => WAPI.getProfilePicFromServer(chatId),
      chatId
    );
  }

  /**
   * Sets a chat status to seen. Marks all messages as ack: 3
   * @param chatId chat id: xxxxx@us.c
   */
  public async sendSeen(chatId: string) {
    return this.page.evaluate((chatId) => WAPI.sendSeen(chatId), chatId);
  }

  /**
   * Load more messages in chat object from server. Use this in a while loop
   * @param contactId
   * @returns contact detial as promise
   */
  public async loadEarlierMessages(contactId: string) {
    return await this.page.evaluate(
      (contactId) => WAPI.loadEarlierMessages(contactId),
      contactId
    );
  }

  /**
   * Get the status of a contact
   * @param contactId {string} to '000000000000@c.us'
   * returns: {id: string,status: string}
   */

  public async getStatus(contactId: string) {
    return await this.page.evaluate(
      (contactId) => WAPI.getStatus(contactId),
      contactId
    );
  }

  /**
   * Load all messages in chat object from server.
   * @param contactId
   * @returns contact detial as promise
   */
  public async asyncLoadAllEarlierMessages(contactId: string) {
    return await this.page.evaluate(
      (contactId) => WAPI.asyncLoadAllEarlierMessages(contactId),
      contactId
    );
  }

  /**
   * Load all messages in chat object from server.
   * @param contactId
   * @returns contact detial as promise
   */
  public async loadAllEarlierMessages(contactId: string) {
    return await this.page.evaluate(
      (contactId) => WAPI.loadAllEarlierMessages(contactId),
      contactId
    );
  }

  /**
   * Delete the conversation from your whatsapp
   * @param chatId
   * @returns boolean
   */
  public async deleteChat(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.deleteConversation(chatId),
      chatId
    );
  }

  /**
   * Delete all messages from the chat.
   * @param chatId
   * @returns boolean
   */
  public async clearChat(chatId: string) {
    return await this.page.evaluate((chatId) => WAPI.clearChat(chatId), chatId);
  }

  /**
   * Retreives an invite link for a group chat. returns false if chat is not a group.
   * @param chatId
   * @returns Promise<string>
   */
  public async getGroupInviteLink(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.getGroupInviteLink(chatId),
      chatId
    );
  }

  /**
   * Deletes message of given message id
   * @param chatId The chat id from which to delete the message.
   * @param messageId The specific message id of the message to be deleted
   * @param onlyLocal If it should only delete locally (message remains on the other recipienct's phone). Defaults to false.
   * @returns nothing
   */
  public async deleteMessage(
    chatId: string,
    messageId: string[] | string,
    onlyLocal: boolean = false
  ) {
    return await this.page.evaluate(
      ({ contactId, messageId, onlyLocal }) =>
        WAPI.deleteMessages(contactId, messageId, onlyLocal),
      { contactId: chatId, messageId, onlyLocal }
    );
  }

  /**
   * Checks if a number is a valid whatsapp number
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact detial as promise
   */
  public async getNumberProfile(contactId: string) {
    return await this.page.evaluate(
      (contactId) => WAPI.getNumberProfile(contactId),
      contactId
    );
  }

  /**
   * Retrieves all undread Messages
   * @param includeMe
   * @param includeNotifications
   * @param useUnreadCount
   * @returns any
   */
  public async getUnreadMessages(
    includeMe: boolean,
    includeNotifications: boolean,
    useUnreadCount: boolean
  ) {
    return await this.page.evaluate(
      ({ includeMe, includeNotifications, use_unread_count }) =>
        WAPI.getUnreadMessages(
          includeMe,
          includeNotifications,
          use_unread_count
        ),
      { includeMe, includeNotifications, use_unread_count: useUnreadCount }
    );
  }

  /**
   * Retrieves all unread Messages. where ack==-1
   * @returns list of messages
   */
  public async getAllUnreadMessages() {
    return await this.page.evaluate(() => WAPI.getAllUnreadMessages());
  }

  /**
   * Retrieves all Messages in a chat
   * @param chatId, the chat to get the messages from
   * @param includeMe, include my own messages? boolean
   * @param includeNotifications
   * @returns any
   */

  public async getAllMessagesInChat(
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) {
    return await this.page.evaluate(
      ({ chatId, includeMe, includeNotifications }) =>
        WAPI.getAllMessagesInChat(chatId, includeMe, includeNotifications),
      { chatId, includeMe, includeNotifications }
    );
  }

  /**
   * loads and Retrieves all Messages in a chat
   * @param chatId, the chat to get the messages from
   * @param includeMe, include my own messages? boolean
   * @param includeNotifications
   * @returns any
   */

  public async loadAndGetAllMessagesInChat(
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) {
    return await this.page.evaluate(
      ({ chatId, includeMe, includeNotifications }) =>
        WAPI.loadAndGetAllMessagesInChat(
          chatId,
          includeMe,
          includeNotifications
        ),
      { chatId, includeMe, includeNotifications }
    );
  }

  /**
   * Sends a text message to given chat
   * @param to group name: 'New group'
   * @param contacts: A single contact id or an array of contact ids.
   * @returns Promise<GroupCreationResponse> :
   * ```javascript
   * {
   *   status: 200,
   *   gid: {
   *     server: 'g.us',
   *     user: '447777777777-1583678870',
   *     _serialized: '447777777777-1583678870@g.us'
   *   },
   *   participants: [
   *     { '447777777777@c.us': [Object] },
   *     { '447444444444@c.us': [Object] }
   *   ]
   * }
   * ```
   */
  public async createGroup(groupName: string, contacts: string | string[]) {
    return await this.page.evaluate(
      ({ groupName, contacts }) => WAPI.createGroup(groupName, contacts),
      { groupName, contacts }
    );
  }

  /**
   * Remove participant of Group
   * @param {*} idGroup '0000000000-00000000@g.us'
   * @param {*} idParticipant '000000000000@c.us'
   * @param {*} done - function - Callback function to be called when a new message arrives.
   */

  public async removeParticipant(idGroup: string, idParticipant: string) {
    return await this.page.evaluate(
      ({ idGroup, idParticipant }) =>
        WAPI.removeParticipant(idGroup, idParticipant),
      { idGroup, idParticipant }
    );
  }

  /**
   * Add participant to Group
   * @param {*} idGroup '0000000000-00000000@g.us'
   * @param {*} idParticipant '000000000000@c.us'
   * @param {*} done - function - Callback function to be called when a new message arrives.
   */

  public async addParticipant(idGroup: string, idParticipant: string) {
    return await this.page.evaluate(
      ({ idGroup, idParticipant }) =>
        WAPI.addParticipant(idGroup, idParticipant),
      { idGroup, idParticipant }
    );
  }

  /**
   * Promote Participant to Admin in Group
   * @param {*} idGroup '0000000000-00000000@g.us'
   * @param {*} idParticipant '000000000000@c.us'
   * @param {*} done - function - Callback function to be called when a new message arrives.
   */

  public async promoteParticipant(idGroup: string, idParticipant: string) {
    return await this.page.evaluate(
      ({ idGroup, idParticipant }) =>
        WAPI.promoteParticipant(idGroup, idParticipant),
      { idGroup, idParticipant }
    );
  }

  /**
   * Demote Admin of Group
   * @param {*} idGroup '0000000000-00000000@g.us'
   * @param {*} idParticipant '000000000000@c.us'
   * @param {*} done - function - Callback function to be called when a new message arrives.
   */
  public async demoteParticipant(idGroup: string, idParticipant: string) {
    return await this.page.evaluate(
      ({ idGroup, idParticipant }) =>
        WAPI.demoteParticipant(idGroup, idParticipant),
      { idGroup, idParticipant }
    );
  }

  /**
   * Get Admins of a Group
   * @param {*} idGroup '0000000000-00000000@g.us'
   */
  public async getGroupAdmins(idGroup: string) {
    return await this.page.evaluate(
      (idGroup) => WAPI.getGroupAdmins(idGroup),
      idGroup
    );
  }

  /**
   * This function takes an image and sends it as a sticker to the recipient. This is helpful for sending semi-ephemeral things like QR codes.
   * The advantage is that it will not show up in the recipients gallery. This function automatiicaly converts images to the required webp format.
   * @param b64: This is the base64 string formatted with data URI. You can also send a plain base64 string but it may result in an error as the function will not be able to determine the filetype before sending.
   * @param to: The recipient id.
   */
  public async sendImageAsSticker(b64: string, to: string) {
    const buff = Buffer.from(
      b64.replace(/^data:image\/(png|gif|jpeg);base64,/, ''),
      'base64'
    );
    const mimeInfo = base64MimeType(b64);
    if (!mimeInfo || mimeInfo.includes('image')) {
      //non matter what, convert to webp, resize + autoscale to width 512 px
      const scaledImageBuffer = await sharp(buff, { failOnError: false })
        .resize({ width: 512, height: 512 })
        .toBuffer();
      const webp = sharp(scaledImageBuffer, { failOnError: false }).webp();
      const metadata: any = await webp.metadata();
      const webpBase64 = (await webp.toBuffer()).toString('base64');
      return await this.page.evaluate(
        ({ webpBase64, to, metadata }) =>
          WAPI.sendImageAsSticker(webpBase64, to, metadata),
        { webpBase64, to, metadata }
      );
    } else {
      console.log('Not an image');
      return false;
    }
  }

  public async sendMentioned(to: string, message: string, mentioned: string) {
    console.log(message, mentioned);
    return await this.page.evaluate(
      ({ to, message, mentioned }) => {
        WAPI.sendMessageMentioned(to, message, mentioned);
      },
      { to, message, mentioned }
    );
  }

  /**
   * TODO: Fix message not being delivered
   * Sends location to given chat id
   * @param to Chat id
   * @param latitude Latitude
   * @param longitude Longitude
   * @param caption Text caption
   */
  public async sendLocation(
    to: string,
    latitude: number,
    longitude: number,
    title?: string,
    subtitle?: string
  ) {
    // Create caption
    let caption = title || '';
    if (subtitle) {
      caption = `${title}\n${subtitle}`;
    }

    return await this.page.evaluate(
      ({ to, latitude, longitude, caption }) => {
        WAPI.sendLocation(to, latitude, longitude, caption);
      },
      { to, latitude, longitude, caption }
    );
  }

  /**
   * Get the generated user agent, this is so you can send it to the decryption module.
   * @returns String useragent of wa-web session
   */
  public async getGeneratedUserAgent(userAgent: string) {
    return await this.page.evaluate(
      ({ userAgent }) => WAPI.getGeneratedUserAgent(userAgent),
      { userAgent }
    );
  }

  /**
   * Clicks on 'use here' button (When it get unlaunched)
   */
  public async useHere() {
    const useHere: string = await this.page.evaluate(() => {
      return window.l10n.localeStrings[window.l10n._locale.l][0][
        window.l10n.localeStrings['en']?.[0].findIndex(
          (x: string) => x.toLowerCase() == 'use here'
        ) || 257
      ];
    });
    await this.page.waitForFunction(
      `[...document.querySelectorAll("div[role=button")].find(e=>{return e.innerHTML.toLowerCase()==="${useHere.toLowerCase()}"})`,
      { timeout: 0 }
    );
    await this.page.evaluate(
      `[...document.querySelectorAll("div[role=button")].find(e=>{return e.innerHTML.toLowerCase()=="${useHere.toLowerCase()}"}).click()`
    );
  }

  /**
   * Closes page and browser
   */
  public async close() {
    if (this.page) await this.page.close();
    if (this.page.browser) await this.page.browser().close();
  }
}
