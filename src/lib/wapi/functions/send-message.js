export function sendMessage(id, message, done) {
  var chat = WAPI.getChat(id);
  if (chat) {
    if (done !== undefined) {
      chat.sendMessage(message).then(function() {
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        var trials = 0;

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
          // console.log(trials);
          
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
      chat.sendMessage(message);
      return true;
    }
  } else {
    if (done !== undefined) done(false);
    return false;
  }
}
