/**
 * Promotes participant as Admin in given group
 * @param {string} groupId Chat id ('0000000000-00000000@g.us')
 * @param {string} participantId Participant id'000000000000@c.us'
 * @param {Function} done Optional callback
 */
export async function promoteParticipant(groupId, particiapntId, done) {
  const chat = Store.Chat.get(groupId);
  const participant = chat.groupMetadata.participants.get(particiapntId);
  return window.Store.Participants.promoteParticipants(chat, [
    participant,
  ]).then(() => {
    done(true);
    return true;
  });
}
