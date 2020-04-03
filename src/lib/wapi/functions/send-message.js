export function sendMessage(id, message, done) {
  let chat = WAPI.getChat(id);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (chat !== undefined) {
    if (done !== undefined) {
      chat.sendMessage(message).then(function () {
        let trials = 0;
        function check() {
          for (let i = chat.msgs.models.length - 1; i >= 0; i--) {
            let msg = chat.msgs.models[i];

            if (!msg.senderObj.isMe || msg.body != message) {
              continue;
            }
            done(WAPI._serializeMessageObj(msg));
            return True;
          }
          trials += 1;
          console.log(trials);
          if (trials > 30) {
            done(true);
            return;
          }
          sleep(500).then(check);
        }
        check();
      });
      return true;
    } else {
      return chat
        .sendMessage(message)
        .then((_) => chat.lastReceivedKey._serialized);
    }
  } else {
    if (done !== undefined) done(false);
    return false;
  }
}
