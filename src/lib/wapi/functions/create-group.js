/**
 * Creates group
 * @param {string} name Group name
 * @param {string[]} contactsId Contacts ids
 */
export function createGroup(name, contactsId) {
  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  return window.Store.Wap.createGroup(name, contactsId);
};