import { GroupChangeEvent, Id } from '.';

export interface ParticipantEvent {
  by: Id;
  action: GroupChangeEvent;
  who: [Id];
}
