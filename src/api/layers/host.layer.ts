import { Page } from 'puppeteer';
import { HostDevice } from '../model';
import { SocketState } from '../model/enum';

declare module WAPI {
  const getHost: () => HostDevice;
  const getWAVersion: () => string;
  const isConnected: () => boolean;
  const getBatteryLevel: () => number;
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
}
