import { Page } from 'puppeteer';
import { HostLayer } from './host.layer';

declare module WAPI {
  const setMyStatus: (to: string) => void;
  const setMyName: (name: string) => void;
}

export class ProfileLayer extends HostLayer {
  constructor(public page: Page) {
    super(page);
  }

  /**
   * Sets current user profile status
   * @param status
   */
  public async setProfileStatus(status: string) {
    return await this.page.evaluate(
      ({ status }) => {
        WAPI.setMyStatus(status);
      },
      { status }
    );
  }

  /**
   * Sets current user profile name
   * @param name
   */
  public async setProfileName(name: string) {
    return this.page.evaluate(
      ({ name }) => {
        WAPI.setMyName(name);
      },
      { name }
    );
  }
}
