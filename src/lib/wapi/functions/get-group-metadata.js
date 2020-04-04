/**
 * Fetches group metadata object from store by ID
 * @param {string} id Group id
 * @param {Function} done Optional callback
 * @returns Group metadata object
 */
export async function getGroupMetadata(id, done) {
  let output = window.Store.GroupMetadata.find(id);
  if (done !== undefined) done(output);
  return output;
}
