/**
 * Retrieves common groups of given participant
 * @param {string} participantId
 * @param {Function} done Optional callback
 */
export async function getCommonGroups(participantId, done) {
  let output = [];
  groups = window.WAPI.getAllGroups();
  for (let idx in groups) {
    try {
      participants = await window.WAPI.getGroupParticipantIDs(groups[idx].id);
      if (
        participants.filter((participant) => participant == participantId)
          .length
      ) {
        output.push(groups[idx]);
      }
    } catch (err) {
      console.log('Error in group:');
      console.log(groups[idx]);
      console.log(err);
    }
  }

  if (done !== undefined) {
    done(output);
  }
  return output;
}
