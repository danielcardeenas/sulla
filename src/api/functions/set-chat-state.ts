import { ChatState } from '../model';

declare module WAPI {
  const setChatState: (chatState: ChatState, chatId: string) => void;
}

/**
 * Sets the chat state
 * @param {ChatState} chatState Chat state to be set (TYPING (0), RECRDING (1) or PAUSED (2)).
 * @param {String} chatId
 */
export async function setChatState(chatState: ChatState, chatId: String) {
  return await this.page.evaluate(
    ({ chatState, chatId }) => {
      WAPI.setChatState(chatState, chatId);
    },
    //@ts-ignore
    { chatState, chatId }
  );
}
