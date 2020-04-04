/**
 * Retrives battery level
 * If plugged in, it will return 100%
 * @returns {number}
 */
export function getBatteryLevel() {
  if (window.Store.Conn.plugged) {
    return 100;
  }
  output = window.Store.Conn.battery;
  if (done !== undefined) {
    done(output);
  }
  return output;
}
