/**
 * Check if phone is connected
 * @param {Function} done Optional callback
 */
export function isConnected(done) {
  // Phone Disconnected icon appears when phone is disconnected from the tnternet
  const isConnected =
    document.querySelector('*[data-icon="alert-phone"]') !== null
      ? false
      : true;

  if (done !== undefined) done(isConnected);
  return isConnected;
}
