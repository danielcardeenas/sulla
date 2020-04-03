import { SocketState } from '../model/enum/socket-state';

/**
 * Retrieves the connecction state
 * @returns { SocketState }
 */
export async function getConnectionState(): Promise<SocketState> {
  return await this.page.evaluate(() => {
    //@ts-ignore
    return Store.State.default.state;
  });
}
