/**
 * Registers a callback for state change event
 * It could be [UNLAUNCHED, OPENING, PAIRING, CONNECTED, TIMEOUT]
 * @param callback - function - Callback function to be called when the device state changes
 */

export function addOnStateChange() {
  window.WAPI.onStateChange = function (callback) {
    window.Store.State.default.on('change:state', callback);
    return true;
  };
}
