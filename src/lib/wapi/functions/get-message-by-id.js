/**
 * Retrieves message by given id
 * @param {string} id Message id
 * @param {Function} done
 */
export function getMessageById(id, done) {
  let result = false;
  try {
    let msg = window.Store.Msg.get(id);
    if (msg) {
      result = WAPI.processMessageObj(msg, true, true);
    }
  } catch (err) {}

  if (done !== undefined) {
    done(result);
  } else {
    return result;
  }
}
