import { Page } from 'puppeteer';
import { ExposedFn } from './helpers/exposed.enum';
import { Chat } from './model/chat';
import { Contact } from './model/contact';
import { Id } from './model/id';
import { Message } from './model/message';
import { sendImage } from './functions';

declare module WAPI {
  const waitNewMessages: (rmCallback: boolean, callback: Function) => void;
  const sendMessage: (to: string, content: string) => void;
  const sendSeen: (to: string) => void;
  const getAllContacts: () => Contact[];
  const getAllChats: () => Chat[];
  const getAllChatsWithNewMessages: () => Chat[];
  const getAllGroups: () => Chat[];
  const getGroupParticipantIDs: (groupId: string) => Id[];
  const getContact: (contactId: string) => Contact;
  const sendContact: (to: string, contact: string | string[]) => any;
  const sendMessageMentioned: (...args: any) => any;
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
      return await this.page.evaluate(() => WAPI.getAllChatsWithNewMessages());
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
      const chats = await this.page.evaluate(() => WAPI.getAllChatsWithNewMessages());
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
    return await this.page.evaluate(
      (groupId) => WAPI.getGroupParticipantIDs(groupId),
      groupId
    );
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
    return await Promise.all(actions);
  }

  /**
   * Retrieves contact detail object of given contact id
   * @param contactId
   * @returns contact detial as promise
   */
  public async getContact(contactId: string) {
    return await this.page.evaluate(
      (contactId) => WAPI.getContact(contactId),
      contactId
    );
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
   * Sends a text message to given chat
   * @param to chat id: xxxxx@us.c
   * @param content text message
   */
  public sendImage = sendImage;

  // /**
  //  * TODO: Fix message not being delivered
  //  * Sends location to given chat id
  //  * @param to Chat id
  //  * @param latitude Latitude
  //  * @param longitude Longitude
  //  * @param caption Text caption
  //  */
  // public async sendLocation(
  //   to: string,
  //   latitude: number,
  //   longitude: number,
  //   title?: string,
  //   subtitle?: string
  // ) {
  //   // Create caption
  //   let caption = title || '';
  //   if (subtitle) {
  //     caption = `${title}\n${subtitle}`;
  //   }

  //   return await this.page.evaluate(
  //     ({ to, latitude, longitude, caption }) => {
  //       WAPI.sendLocation(to, latitude, longitude, caption);
  //     },
  //     { to, latitude, longitude, caption }
  //   );
  // }
}
