/**
 * Leaves group
 * @param {string} groupId The group id
 */
export function leaveGroup(groupId) {
  groupId = typeof groupId == "string" ? groupId : groupId._serialized;
  var group = WAPI.getChat(groupId);
  return group.sendExit();
};
