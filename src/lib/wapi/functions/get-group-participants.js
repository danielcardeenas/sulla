/**
 * Fetches group participants
 * @param {string} id Group id
 */
export async function _getGroupParticipants(id) {
  const metadata = await WAPI.getGroupMetadata(id);
  return metadata.participants;
}
