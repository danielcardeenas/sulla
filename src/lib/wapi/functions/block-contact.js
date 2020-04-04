/**
 * Blocks contact
 * @param {string} id Contact id (00000000@c.us)
 * @param {Function} done Optional callback
 */
export function blockContact(id, done) {
  const contact = window.Store.Contact.get(id);
  if (contact !== undefined) {
    contact.setBlock(!0);
    done(true);
    return true;
  }
  done(false);
  return false;
}
