/**
 * Unblocks contact
 * @param {string} id Contact id (00000000@c.us)
 * @param {Function} done Optional callback
 */
export function unblockContact(id, done) {
  const contact = window.Store.Contact.get(id);
  if (contact !== undefined) {
    contact.setBlock(!1);
    done(true);
    return true;
  }
  done(false);
  return false;
}
