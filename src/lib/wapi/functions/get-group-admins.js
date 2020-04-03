import { _getGroupParticipants } from './get-group-participants';

/**
 * Retrieves group admins
 * @param {string} id Group id
 * @param {Function} done Optional callback
 */
export async function getGroupAdmins(id, done) {
  const output = (await _getGroupParticipants(id))
    .filter((participant) => participant.isAdmin)
    .map((admin) => admin.id);

  if (done !== undefined) done(output);
  return output;
}
