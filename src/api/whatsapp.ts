import { Page } from 'puppeteer';
import { GroupLayer } from './layers/group.layer';

declare global {
  interface Window {
    l10n: any;
  }
}

export class Whatsapp extends GroupLayer {
  constructor(public page: Page) {
    super(page);
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
}
