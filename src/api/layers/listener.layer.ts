import { Page } from 'puppeteer';
import { ExposedFn } from '../helpers/exposed.enum';
import { Ack, Chat, LiveLocation, Message, ParticipantEvent } from '../model';
import { SocketState } from '../model/enum';
import { ProfileLayer } from './profile.layer';

declare module WAPI {
  const waitNewMessages: (rmCallback: boolean, callback: Function) => void;
  const allNewMessagesListener: (callback: Function) => void;
  const onStateChange: (callback: Function) => void;
  const onAddedToGroup: (callback: Function) => any;
  const onParticipantsChanged: (groupId: string, callback: Function) => any;
  const onLiveLocation: (chatId: string, callback: Function) => any;
}

export class ListenerLayer extends ProfileLayer {
  constructor(public page: Page) {
    super(page);
  }

  /**
   * Listens to messages received
   * @returns Observable stream of messages
   */
  public onMessage(fn: (message: Message) => void) {
    this.page.exposeFunction(ExposedFn.OnMessage, (message: Message) =>
      fn(message)
    );
  }

  /**
   * @event Listens to all new messages
   * @param to callback
   * @fires Message
   */
  public async onAnyMessage(fn: (message: Message) => void) {
    this.page
      .exposeFunction(ExposedFn.OnAnyMessage, (message: Message) => fn(message))
      .then((_) =>
        this.page.evaluate(() => {
          WAPI.allNewMessagesListener(window['onAnyMessage']);
        })
      );
  }

  /**
   * @event Listens to messages received
   * @returns Observable stream of messages
   */
  public onStateChange(fn: (state: SocketState) => void) {
    this.page
      .exposeFunction(ExposedFn.onStateChange, (state: SocketState) =>
        fn(state)
      )
      .then(() =>
        this.page.evaluate(() => {
          WAPI.onStateChange((_) => window['onStateChange'](_.state));
        })
      );
  }

  /**
   * @event Listens to messages acknowledgement Changes
   * @returns Observable stream of messages
   */
  public onAck(fn: (ack: Ack) => void) {
    this.page.exposeFunction(ExposedFn.onAck, (ack: Ack) => fn(ack));
  }

  /**
   * @event Listens to live locations from a chat that already has valid live locations
   * @param chatId the chat from which you want to subscribes to live location updates
   * @param fn callback that takes in a LiveLocation
   * @returns boolean, if returns false then there were no valid live locations in the chat of chatId
   * @emits <LiveLocation> LiveLocation
   */
  public async onLiveLocation(
    chatId: string,
    fn: (liveLocationChangedEvent: LiveLocation) => void
  ) {
    const method = 'onLiveLocation_' + chatId.replace('_', '').replace('_', '');
    return this.page
      .exposeFunction(method, (liveLocationChangedEvent: LiveLocation) =>
        fn(liveLocationChangedEvent)
      )
      .then((_) =>
        this.page.evaluate(
          ({ chatId, method }) => {
            //@ts-ignore
            return WAPI.onLiveLocation(chatId, window[method]);
          },
          { chatId, method }
        )
      );
  }

  /**
   * @param to group id: xxxxx-yyyy@us.c
   * @param to callback
   * @returns Stream of ParticipantEvent
   */
  public async onParticipantsChanged(
    groupId: string,
    fn: (participantChangedEvent: ParticipantEvent) => void
  ) {
    const method =
      'onParticipantsChanged_' + groupId.replace('_', '').replace('_', '');
    return this.page
      .exposeFunction(method, (participantChangedEvent: ParticipantEvent) =>
        fn(participantChangedEvent)
      )
      .then((_) =>
        this.page.evaluate(
          ({ groupId, method }) => {
            //@ts-ignore
            WAPI.onParticipantsChanged(groupId, window[method]);
          },
          { groupId, method }
        )
      );
  }

  /**
   * @event Fires callback with Chat object every time the host phone is added to a group.
   * @param to callback
   * @returns Observable stream of Chats
   */
  public async onAddedToGroup(fn: (chat: Chat) => any) {
    const method = 'onAddedToGroup';
    return this.page
      .exposeFunction(method, (chat: any) => fn(chat))
      .then((_) =>
        this.page.evaluate(() => {
          //@ts-ignore
          WAPI.onAddedToGroup(window.onAddedToGroup);
        })
      );
  }
}
