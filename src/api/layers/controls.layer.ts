import { Page } from 'puppeteer';
import { GroupLayer } from './group.layer';

declare module WAPI {
  const deleteConversation: (chatId: string) => boolean;
  const clearChat: (chatId: string) => void;
  const deleteMessages: (
    contactId: string,
    messageId: string[] | string,
    onlyLocal: boolean
  ) => any;
}

export class ControlsLayer extends GroupLayer {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Deletes the given chat
   * @param chatId
   * @returns boolean
   */
  public async deleteChat(chatId: string) {
    return this.page.evaluate(
      (chatId) => WAPI.deleteConversation(chatId),
      chatId
    );
  }

  /**
   * Deletes all messages of given chat
   * @param chatId
   * @returns boolean
   */
  public async clearChat(chatId: string) {
    return this.page.evaluate((chatId) => WAPI.clearChat(chatId), chatId);
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
    onlyLocal = false
  ) {
    return await this.page.evaluate(
      ({ contactId, messageId, onlyLocal }) =>
        WAPI.deleteMessages(contactId, messageId, onlyLocal),
      { contactId: chatId, messageId, onlyLocal }
    );
  }
}
