/**
 * Fetches contact object from store by ID
 * @param {string} id constact id
 * @param {Function} done Callback (optional)
 * @returns {Contact} contact object
 */
export const getContact = function (id, done) {
  const found = window.Store.Contact.get(id);

  if (done !== undefined) done(window.WAPI._serializeContactObj(found));
  return window.WAPI._serializeContactObj(found);
};
