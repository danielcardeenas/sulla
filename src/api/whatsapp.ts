import { Page } from 'puppeteer';
import { ExposedFn } from './functions/exposed.enum';
import { Chat } from './model/chat';
import { Contact } from './model/contact';
import { Message } from './model/message';
import { Id } from './model/id';

declare module WAPI {
  const waitNewMessages: (rmCallback: boolean, callback: Function) => void;
  const sendMessage: (to: string, content: string) => void;
  const sendSeen: (to: string) => void;
  const getAllContacts: () => Contact[];
  const getAllChats: () => Chat[];
  const getAllChatsWithNewMsg: () => Chat[];
  const getAllGroups: () => Chat[];
  const getGroupParticipantIDs: (groupId: string) => Id[];
  const getContact: (contactId: string) => Contact;
  const sendContact: (to: string, contact: string | string[]) => any;
  const sendMessageWithThumb: (
    thumb: string,
    url: string,
    title: string,
    description: string,
    to: string
  ) => boolean;
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
   * Sends a text message to given chat
   * @param to chat id: xxxxx@us.c
   * @param content text message
   */
  public async sendText(to: string, content: string) {
    return await this.page.evaluate(
      ({ to, content }) => {
        WAPI.sendSeen(to);
        WAPI.sendMessage(to, content);
      },
      { to, content }
    );
  }

  /**
   * Sends a text message to given chat with thumbnail
   * @param to chat id: xxxxx@us.c
   * @param thumb base64 thumbnail image
   * @param url canonical url
   * @param title title of the preview
   * @param description description of the preview
   *
   */
  public async sendTextWithPreview(
    to: string,
    thumb: string,
    url: string,
    title: string,
    description: string
  ) {
    return await this.page.evaluate(
      ({ to, content }) => {
        WAPI.sendSeen(to);
        WAPI.sendMessageWithThumb(thumb, url, title, description, to);
      },
      { thumb, url, title, description, to }
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
   * Retrieves all contacts
   * @returns array of [Contact]
   */
  public async getAllContacts() {
    return await this.page.evaluate(() => WAPI.getAllContacts());
  }

  /**
   * Retrieves all chats
   * @returns array of [Chat]
   */
  public async getAllChats(withNewMessageOnly = false) {
    if (withNewMessageOnly) {
      return await this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
    } else {
      return await this.page.evaluate(() => WAPI.getAllChats());
    }
  }

  /**
   * Retrieve all groups
   * @returns array of groups
   */
  public async getAllGroups(withNewMessagesOnly = false) {
    if (withNewMessagesOnly) {
      // prettier-ignore
      const chats = await this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
      return chats.filter(chat => chat.isGroup);
    } else {
      const chats = await this.page.evaluate(() => WAPI.getAllChats());
      return chats.filter(chat => chat.isGroup);
    }
  }

  /**
   * Retrieves group members as [Id] objects
   * @param groupId group id
   */
  public async getGroupMembersId(groupId: string) {
    return await this.page.evaluate(
      groupId => WAPI.getGroupParticipantIDs(groupId),
      groupId
    );
  }

  /**
   * Returns group members [Contact] objects
   * @param groupId
   */
  public async getGroupMembers(groupId: string) {
    const membersIds = await this.getGroupMembersId(groupId);
    const actions = membersIds.map(memberId => {
      return this.getContact(memberId._serialized);
    });
    return await Promise.all(actions);
  }

  /**
   * Retrieves contact detail object of given contact id
   * @param contactId
   * @returns contact detial as promise
   */
  public async getContact(contactId: string) {
    return await this.page.evaluate(
      contactId => WAPI.getContact(contactId),
      contactId
    );
  }
}
