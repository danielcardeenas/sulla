/**
 * Leaves group
 * @param {string} groupId The group id
 * @returns Promise
 */
export async function leaveGroup(groupId) {
  groupId = typeof groupId == 'string' ? groupId : groupId._serialized;
  var group = WAPI.getChat(groupId);
  return Store.GroupActions.sendExitGroup(group);
}
