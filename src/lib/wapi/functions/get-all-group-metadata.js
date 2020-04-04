/**
 * Fetches all group metadata objects from store
 * @param {Function} done Optional callback
 */
export function getAllGroupMetadata(done) {
  const groupData = window.Store.GroupMetadata.map(
    (groupData) => groupData.all
  );

  if (done !== undefined) done(groupData);
  return groupData;
}
