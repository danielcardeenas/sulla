/**
 * Retrieves satus
 * @param {string} to '000000000000@c.us'
 *
 * TODO: Test this function
 */
export async function getStatus(id) {
  return await Store.MyStatus.getStatus(id);
}
