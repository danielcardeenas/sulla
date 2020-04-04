/**
 * Adds participant to group
 * @param {string} groupId Chat id ('0000000000-00000000@g.us')
 * @param {string} participantId Participant id'000000000000@c.us'
 * @param {Function} done Optional callback
 */
export async function addParticipant(groupId, participantId, done) {
  const chat = Store.Chat.get(groupId);
  const participant = Store.Contact.get(participantId);
  return window.Store.Participants.addParticipants(chat, [participant]).then(
    () => {
      done(true);
      return true;
    }
  );
}
