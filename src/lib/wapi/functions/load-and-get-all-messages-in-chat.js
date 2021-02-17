const promiseTimeout = function (ms, promise) {
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]);
};

/**
 * Loads and Retrieves all Messages in a chat
 * @param {string} id Chat id
 * @param {boolean} includeMe
 * @param {boolean} includeNotifications
 * @param {Function} done Optional callback
 */
export async function loadAndGetAllMessagesInChat(
  id,
  includeMe,
  includeNotifications,
  done
) {
  return WAPI.loadAllEarlierMessages(id).then((_) => {
    const chat = WAPI.getChat(id);
    let output = [];
    const messages = chat.msgs._models;

    for (const i in messages) {
      if (i === 'remove') {
        continue;
      }
      const messageObj = messages[i];

      try {
        let message = WAPI.processMessageObj(
          messageObj,
          includeMe,
          includeNotifications
        );
        if (message) output.push(message);
      } catch (err) {
        console.log(i);
        console.log(err);
      }
    }
    if (done !== undefined) done(output);
    return output;
  });
}
