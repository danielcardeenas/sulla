/**
 * Retrieves chat by its name
 * @param {string} name Chat name
 * @param {Function} done callback
 */
export function getChatByName(name, done) {
  const found = window.Store.Chat.find((chat) => chat.name === name);
  if (done !== undefined) done(found);
  return found;
}
