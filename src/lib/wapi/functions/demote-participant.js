/**
 * Demotes admin privileges of participant
 * @param {string} groupId Chat id ('0000000000-00000000@g.us')
 * @param {string} participantId Participant id'000000000000@c.us'
 * @param {Function} done Optional callback
 */
export async function demoteParticipant(groupId, participantId, done) {
  return window.Store.WapQuery.demoteParticipants(groupId, [
    participantId,
  ]).then(() => {
    const chat = Store.Chat.get(groupId);
    const participant = chat.groupMetadata.participants.get(participantId);
    window.Store.Participants.demoteParticipants(chat, [participant]).then(
      () => {
        done(true);
        return true;
      }
    );
  });
}
