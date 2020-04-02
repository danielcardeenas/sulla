/**
 * Retrieves contacts filtered with `isMyContact` property
 * @param {Function} done Callback function (optional)
 * @returns {Array} List of contacts
 */
export const getMyContacts = function (done) {
  const contacts = window.Store.Contact.filter(
    (contact) => contact.isMyContact === true
  ).map((contact) => WAPI._serializeContactObj(contact));
  if (done !== undefined) done(contacts);
  return contacts;
};
