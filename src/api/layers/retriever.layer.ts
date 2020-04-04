import { Page } from 'puppeteer';
import {
  Chat,
  Contact,
  ContactStatus,
  Message,
  PartialMessage,
} from '../model';
import { SenderLayer } from './sender.layer';

declare module WAPI {
  const getAllChatsWithNewMsg: () => Chat[];
  const getAllNewMessages: () => any;
  const getAllChats: () => Chat[];
  const getAllChatsWithMessages: (withNewMessageOnly?: boolean) => Chat[];
  const getContact: (contactId: string) => Contact;
  const getAllContacts: () => Contact[];
  const getChatById: (contactId: string) => Chat;
  const getChat: (contactId: string) => Chat;
  const getProfilePicFromServer: (chatId: string) => any;
  const loadEarlierMessages: (contactId: string) => Message[];
  const getStatus: (contactId: string) => ContactStatus;
  const asyncLoadAllEarlierMessages: (contactId: string) => void;
  const loadAllEarlierMessages: (contactId: string) => void;
  const getNumberProfile: (contactId: string) => any;
  const getUnreadMessages: (
    includeMe: boolean,
    includeNotifications: boolean,
    useUnreadCount: boolean
  ) => any;
  const getAllUnreadMessages: () => PartialMessage[];
  const getAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[];
  const loadAndGetAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean
  ) => Message[];
}

export class RetrieverLayer extends SenderLayer {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Retrieves all chats
   * @returns array of [Chat]
   */
  public async getAllChatsgetAllChats(withNewMessageOnly = false) {
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
      (withNewMessageOnly: boolean) =>
        WAPI.getAllChatsWithMessages(withNewMessageOnly),
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
   * Retrieves all contacts
   * @returns array of [Contact]
   */
  public async getAllContacts() {
    return await this.page.evaluate(() => WAPI.getAllContacts());
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
   * @param chatId Chat id
   * @returns Url of the chat picture or undefined if there is no picture for the chat.
   */
  public async getProfilePicFromServer(chatId: string) {
    return this.page.evaluate(
      (chatId) => WAPI.getProfilePicFromServer(chatId),
      chatId
    );
  }

  /**
   * Load more messages in chat object from server. Use this in a while loop
   * @param contactId
   * @returns contact detial as promise
   */
  public async loadEarlierMessages(contactId: string) {
    return this.page.evaluate(
      (contactId) => WAPI.loadEarlierMessages(contactId),
      contactId
    );
  }

  /**
   * Retrieves status of given contact
   * @param contactId
   */
  public async getStatus(contactId: string) {
    return this.page.evaluate(
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
    return this.page.evaluate(
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
    return this.page.evaluate(
      (contactId) => WAPI.loadAllEarlierMessages(contactId),
      contactId
    );
  }

  /**
   * Checks if a number is a valid whatsapp number
   * @param contactId, you need to include the @c.us at the end.
   * @returns contact detial as promise
   */
  public async getNumberProfile(contactId: string) {
    return this.page.evaluate(
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
      ({ includeMe, includeNotifications, useUnreadCount }) =>
        WAPI.getUnreadMessages(includeMe, includeNotifications, useUnreadCount),
      { includeMe, includeNotifications, useUnreadCount }
    );
  }

  /**
   * Retrieves all unread messages (where ack is -1)
   * @returns list of messages
   */
  public async getAllUnreadMessages() {
    return this.page.evaluate(() => WAPI.getAllUnreadMessages());
  }

  /**
   * Retrieves all new messages (where isNewMsg is true)
   * @returns List of messages
   */
  public async getAllNewMessages() {
    return this.page.evaluate(() => WAPI.getAllNewMessages());
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
   * Loads and Retrieves all Messages in a chat
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
}
