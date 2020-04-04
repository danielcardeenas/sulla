import { Page } from 'puppeteer';
import * as sharp from 'sharp';
import { base64MimeType, fileToBase64 } from '../helpers';
import { Message } from '../model';
import { ListenerLayer } from './listener.layer';

declare module WAPI {
  const sendSeen: (to: string) => void;
  const startTyping: (to: string) => void;
  const stopTyping: (to: string) => void;
  const sendMessage: (to: string, content: string) => string;
  const sendImage: (
    imgBase64: string,
    to: string,
    filename: string,
    caption: string
  ) => any;
  const sendMessageWithTags: (to: string, content: string) => string;
  const sendMessageWithThumb: (
    thumb: string,
    url: string,
    title: string,
    description: string,
    chatId: string
  ) => void;
  const reply: (
    to: string,
    content: string,
    quotedMsg: string | Message
  ) => void;
  const sendFile: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => any;
  const sendVideoAsGif: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => void;
  const sendContact: (to: string, contact: string | string[]) => any;
  const forwardMessages: (
    to: string,
    messages: string | string[],
    skipMyMessages: boolean
  ) => any;
  const sendImageAsSticker: (
    webpBase64: string,
    to: string,
    metadata?: any
  ) => void;
  const sendLocation: (
    to: string,
    latitude: string,
    longitude: string,
    caption: string
  ) => void;
  const sendMessageMentioned: (...args: any) => any;
  const sendMessageToID: (id: string, message: string) => any;
}

export class SenderLayer extends ListenerLayer {
  constructor(public page: Page) {
    super(page);
  }

  /**
   * Sends a text message to given chat
   * @param to chat id: xxxxx@us.c
   * @param content text message
   */
  public async sendText(to: string, content: string): Promise<string> {
    return this.page.evaluate(
      ({ to, content }) => {
        WAPI.sendSeen(to);
        return WAPI.sendMessage(to, content);
      },
      { to, content }
    );
  }

  /**
   * Experimental!
   * Sends a text message to given chat even if its a non-existent chat
   * @param to chat id: xxxxx@us.c
   * @param content text message
   */
  public async sendMessageToId(to: string, content: string): Promise<string> {
    return this.page.evaluate(
      ({ to, content }) => {
        WAPI.sendSeen(to);
        return WAPI.sendMessageToID(to, content);
      },
      { to, content }
    );
  }

  /**
   * Sends image message
   * @param to Chat id
   * @param imgBase64
   * @param filename
   * @param caption
   */
  public async sendImage(
    to: string,
    path: string,
    filename: string,
    caption?: string
  ) {
    const data = await fileToBase64(path);
    return this.page.evaluate(
      ({ to, data, filename, caption }) => {
        WAPI.sendImage(data, to, filename, caption);
      },
      { to, data, filename, caption }
    );
  }
  /**
   * Sends text message with @tags mentions
   *
   * Example:
   * "Hello @8114285934 from sulla!"
   * @param to chat id
   * @param content message body
   * @returns message id
   */
  public sendTextWithTags(to: string, content: string): Promise<string> {
    return this.page.evaluate(
      ({ to, content }) => {
        WAPI.sendSeen(to);
        return WAPI.sendMessageWithTags(to, content);
      },
      { to, content }
    );
  }

  /**
   * Sends message with thumbnail
   * @param thumb
   * @param url
   * @param title
   * @param description
   * @param chatId
   */
  public async sendMessageWithThumb(
    thumb: string,
    url: string,
    title: string,
    description: string,
    chatId: string
  ) {
    return this.page.evaluate(
      ({ thumb, url, title, description, chatId }) => {
        WAPI.sendMessageWithThumb(thumb, url, title, description, chatId);
      },
      {
        thumb,
        url,
        title,
        description,
        chatId,
      }
    );
  }

  /**
   * Replies to given mesage id of given chat id
   * @param to Chat id
   * @param content Message body
   * @param quotedMsg Message id to reply to.
   */
  public async reply(to: string, content: string, quotedMsg: string) {
    return await this.page.evaluate(
      ({ to, content, quotedMsg }) => {
        WAPI.reply(to, content, quotedMsg);
      },
      { to, content, quotedMsg }
    );
  }

  /**
   * Sends file
   * base64 parameter should have mime type already defined
   * @param to Chat id
   * @param base64 base64 data
   * @param filename
   * @param caption
   */
  public async sendFileFromBase64(
    to: string,
    base64: string,
    filename: string,
    caption?: string
  ) {
    return this.page.evaluate(
      ({ to, base64, filename, caption }) => {
        WAPI.sendFile(base64, to, filename, caption);
      },
      { to, base64, filename, caption }
    );
  }

  /**
   * Sends file from path
   * @param to Chat id
   * @param path File path
   * @param filename
   * @param caption
   */
  public async sendFile(
    to: string,
    path: string,
    filename: string,
    caption?: string
  ) {
    const base64 = await fileToBase64(path);
    return this.page.evaluate(
      ({ to, base64, filename, caption }) => {
        WAPI.sendFile(base64, to, filename, caption);
      },
      { to, base64, filename, caption }
    );
  }

  /**
   * Sends a video to given chat as a gif, with caption or not, using base64
   * @param to chat id xxxxx@us.c
   * @param base64 base64 data:video/xxx;base64,xxx
   * @param filename string xxxxx
   * @param caption string xxxxx
   */
  public async sendVideoAsGif(
    to: string,
    path: string,
    filename: string,
    caption: string
  ) {
    const base64 = await fileToBase64(path);
    return await this.page.evaluate(
      ({ to, base64, filename, caption }) => {
        WAPI.sendVideoAsGif(base64, to, filename, caption);
      },
      { to, base64, filename, caption }
    );
  }

  /**
   * Sends a video to given chat as a gif, with caption or not, using base64
   * @param to chat id xxxxx@us.c
   * @param base64 base64 data:video/xxx;base64,xxx
   * @param filename string xxxxx
   * @param caption string xxxxx
   */
  public async sendVideoAsGifFromBase64(
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
   * Sends contact card to iven chat id
   * @param to Chat id
   * @param contactsId Example: 0000@c.us | [000@c.us, 1111@c.us]
   */
  public async sendContact(to: string, contactsId: string | string[]) {
    return this.page.evaluate(
      ({ to, contactsId }) => WAPI.sendContact(to, contactsId),
      { to, contactsId }
    );
  }

  /**
   * Forwards array of messages (could be ids or message objects)
   * @param to Chat id
   * @param messages Array of messages ids to be forwarded
   * @param skipMyMessages
   */
  public async forwardMessages(
    to: string,
    messages: string | string[],
    skipMyMessages: boolean
  ) {
    return this.page.evaluate(
      ({ to, messages, skipMyMessages }) =>
        WAPI.forwardMessages(to, messages, skipMyMessages),
      { to, messages, skipMyMessages }
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
   * Sets a chat status to seen. Marks all messages as ack: 3
   * @param chatId chat id: xxxxx@us.c
   */
  public async sendSeen(chatId: string) {
    return this.page.evaluate((chatId) => WAPI.sendSeen(chatId), chatId);
  }

  /**
   * Starts typing ('Typing...' state)
   * @param chatId
   */
  public async startTyping(to: string) {
    return this.page.evaluate(({ to }) => WAPI.startTyping(to), { to });
  }

  /**
   * Stops typing
   * @param to Chat id
   */
  public async stopTyping(to: string) {
    return this.page.evaluate(({ to }) => WAPI.stopTyping(to), { to });
  }

  /**
   * New version for sendign @tagged messages
   */
  // public async sendMentioned(to: string, message: string, mentioned: string) {
  //   console.log(message, mentioned);
  //   return await this.page.evaluate(
  //     ({ to, message, mentioned }) => {
  //       WAPI.sendMessageMentioned(to, message, mentioned);
  //     },
  //     { to, message, mentioned }
  //   );
  // }
}
