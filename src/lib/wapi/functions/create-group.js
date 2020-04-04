/**
 * Creates group
 * @param {string} name Group name
 * @param {string[]} contactsId Contacts ids
 */
export async function createGroup(name, contactsId) {
  if (!Array.isArray(contactsId)) {
    contactsId = [contactsId];
  }

  return await window.Store.WapQuery.createGroup(name, contactsId);
}
