import { Message } from '../model';

declare module WAPI {
  const reply: (
    to: string,
    content: string,
    quotedMsg: string | Message
  ) => void;
}

/**
 * Replies to given mesage id of given chat id
 * @param to Chat id
 * @param content Message body
 * @param quotedMsg Message id to reply to.
 */
export async function reply(to: string, content: string, quotedMsg: string) {
  return await this.page.evaluate(
    ({ to, content, quotedMsg }) => {
      WAPI.reply(to, content, quotedMsg);
    },
    { to, content, quotedMsg }
  );
}
