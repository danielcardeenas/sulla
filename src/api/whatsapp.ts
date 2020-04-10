import { Page } from 'puppeteer';
import { decrypt } from './helpers/decrypt';
import { ControlsLayer } from './layers/controls.layer';
import { Message } from './model';

declare module WAPI {
  const arrayBufferToBase64: (buffer: ArrayBuffer) => string;
}

export class Whatsapp extends ControlsLayer {
  constructor(public page: Page) {
    super(page);
  }

  /**
   * Get the puppeteer page instance
   * @returns The Whatsapp page
   */
  get waPage(): Page {
    return this.page;
  }

  /**
   * Clicks on 'use here' button (When it get unlaunched)
   * This method tracks the class of the button
   * Whatsapp web might change this class name over the time
   * Dont rely on this method
   */
  public async useHere() {
    await this.page.waitForFunction(
      () => {
        const useHereClass = '._1WZqU.PNlAR';
        return document.querySelector(useHereClass);
      },
      { timeout: 0 }
    );

    await this.page.evaluate(() => {
      const useHereClass = '._1WZqU.PNlAR';
      (<any>document.querySelector(useHereClass)).click();
    });
  }

  /**
   * Closes page and browser
   */
  public async close() {
    if (this.page) {
      await this.page.close();
    }

    if (this.page.browser) {
      await this.page.browser().close();
    }
  }

  /**
   * Decrypts message file
   * @param message Message object
   * @returns Decrypted file buffer (null otherwise)
   */
  public async downloadFile(message: Message) {
    if (message.isMedia) {
      const url = message.clientUrl;
      const encBase64 = await this.page.evaluate((url: string) => {
        return fetch(url)
          .then((response) => response.arrayBuffer())
          .then((bytes) => WAPI.arrayBufferToBase64(bytes));
      }, url);

      return decrypt(encBase64, message);
    } else {
      return null;
    }
  }
}
