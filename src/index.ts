import { Whatsapp } from './api/whatsapp';
import { create } from './controllers/initializer';

// export { Chat, Contact, Message } from './api/model';
// export { Whatsapp } from './api/whatsapp';
// export { create } from './controllers/initializer';

create().then(client => start(client));

async function start(client: Whatsapp) {
  client.onMessage(message => {
    if (message.body === 'Hi') {
      client.sendText(message.from, '👋 Hello from sulla!');
    }
  });
}
