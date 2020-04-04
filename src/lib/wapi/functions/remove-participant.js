/**
 * Removes participant from group
 * @param {string} groupId Chat id ('0000000000-00000000@g.us')
 * @param {string} participantId Participant id'000000000000@c.us'
 * @param {Function} done Optional callback
 */
export async function removeParticipant(groupId, participantId, done) {
  const chat = Store.Chat.get(groupId);
  const participant = chat.groupMetadata.participants.get(participantId);
  return window.Store.Participants.removeParticipants(chat, [participant]).then(
    () => {
      done(true);
      return true;
    }
  );
}
