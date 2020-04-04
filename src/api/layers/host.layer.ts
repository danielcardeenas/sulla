import { Page } from 'puppeteer';
import { HostDevice } from '../model';
import { SocketState } from '../model/enum';

declare module WAPI {
  const getHost: () => HostDevice;
  const getWAVersion: () => string;
  const isConnected: () => boolean;
  const getBatteryLevel: () => number;
  const getGeneratedUserAgent: (userAgent?: string) => string;
}

export class HostLayer {
  constructor(public page: Page) {
    this.page = page;
  }
  /**
   * @returns Current host device details
   */
  public async getHostDevice() {
    return await this.page.evaluate(() => WAPI.getHost());
  }

  /**
   * Retrieves WA version
   */
  public async getWAVersion() {
    return await this.page.evaluate(() => WAPI.getWAVersion());
  }

  /**
   * Retrieves the connecction state
   */
  public async getConnectionState(): Promise<SocketState> {
    return await this.page.evaluate(() => {
      //@ts-ignore
      return Store.State.default.state;
    });
  }

  /**
   * Retrieves if the phone is online. Please note that this may not be real time.
   */
  public async isConnected() {
    return await this.page.evaluate(() => WAPI.isConnected());
  }

  /**
   * Retrieves Battery Level
   */
  public async getBatteryLevel() {
    return await this.page.evaluate(() => WAPI.getBatteryLevel());
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
}
