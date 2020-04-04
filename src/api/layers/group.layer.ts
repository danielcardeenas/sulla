import { Page } from 'puppeteer';
import { Contact, GroupCreation, Id } from '../model';
import { RetrieverLayer } from './retriever.layer';

declare module WAPI {
  const leaveGroup: (groupId: string) => any;
  const getGroupParticipantIDs: (groupId: string) => Id[];
  const getGroupInviteLink: (chatId: string) => Promise<string>;
  const createGroup: (
    groupName: string,
    contactId: string | string[]
  ) => GroupCreation;
  const removeParticipant: (groupId: string, contactId: string) => void;
  const addParticipant: (groupId: string, contactId: string) => void;
  const promoteParticipant: (groupId: string, contactId: string) => void;
  const demoteParticipant: (groupId: string, contactId: string) => void;
  const getGroupAdmins: (groupId: string) => Contact[];
}

export class GroupLayer extends RetrieverLayer {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Removes the host device from the group
   * @param groupId group id
   */
  public async leaveGroup(groupId: string) {
    return this.page.evaluate((groupId) => WAPI.leaveGroup(groupId), groupId);
  }

  /**
   * Retrieves group members as [Id] objects
   * @param groupId group id
   */
  public async getGroupMembersIds(groupId: string): Promise<Id[]> {
    return this.page.evaluate(
      (groupId: string) => WAPI.getGroupParticipantIDs(groupId),
      groupId
    );
  }

  /**
   * Returns group members [Contact] objects
   * @param groupId
   */
  public async getGroupMembers(groupId: string) {
    const membersIds = await this.getGroupMembersIds(groupId);
    const actions = membersIds.map((memberId) => {
      return this.getContact(memberId._serialized);
    });
    return Promise.all(actions);
  }

  /**
   * Generates group-invite link
   * @param chatId
   * @returns Invitation link
   */
  public async getGroupInviteLink(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.getGroupInviteLink(chatId),
      chatId
    );
  }

  /**
   * Creates a new chat group
   * @param groupName Group name
   * @param contacts Contacts that should be added.
   */
  public async createGroup(groupName: string, contacts: string | string[]) {
    return await this.page.evaluate(
      ({ groupName, contacts }) => WAPI.createGroup(groupName, contacts),
      { groupName, contacts }
    );
  }

  /**
   * Removes participant from group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async removeParticipant(groupId: string, participantId: string) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.removeParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Adds participant to Group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async addParticipant(groupId: string, participantId: string) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.addParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Promotes participant as Admin in given group
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async promoteParticipant(groupId: string, participantId: string) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.promoteParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Demotes admin privileges of participant
   * @param groupId Chat id ('0000000000-00000000@g.us')
   * @param participantId Participant id'000000000000@c.us'
   */
  public async demoteParticipant(groupId: string, participantId: string) {
    return await this.page.evaluate(
      ({ groupId, participantId }) =>
        WAPI.demoteParticipant(groupId, participantId),
      { groupId, participantId }
    );
  }

  /**
   * Retrieves group admins
   * @param chatId Group/Chat id ('0000000000-00000000@g.us')
   */
  public async getGroupAdmins(chatId: string) {
    return await this.page.evaluate(
      (chatId) => WAPI.getGroupAdmins(chatId),
      chatId
    );
  }
}
