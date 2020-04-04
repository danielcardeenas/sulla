<p align="center">
  <a href="https://github.com/danielcardeenas/sulla">
    <img width="250px" src="https://github.com/danielcardeenas/sulla/blob/master/img/logo.jpg?raw=true" alt="Sulla logo">
  </a>
</p>

# Sulla

[![npm version](https://img.shields.io/npm/v/sulla.svg?color=%2378e08f)](https://www.npmjs.com/package/sulla)
![npm type definitions](https://img.shields.io/npm/types/sulla)
![GitHub last commit](https://img.shields.io/github/last-commit/danielcardeenas/sulla)
[![GitHub license](https://img.shields.io/github/license/danielcardeenas/sulla)](https://github.com/danielcardeenas/sulla/blob/master/LICENSE)

> Sulla is a javascript library which provides a high-level API control to Whatsapp so it can be configured to automatize resposes or any data that goes through Whatsapp effortlessly.
>
> It is built using [puppeteer](https://github.com/GoogleChrome/puppeteer) and based on [this python wrapper](https://github.com/mukulhase/WebWhatsapp-Wrapper)
>
> By deafult sulla will try to use Google Chrome driver if installed, if not, it will use integrated Chromium instance

## Installation

```bash
> npm i sulla
```

## Getting started

```javascript
// Supports ES6
// import { create, Whatsapp } from 'sulla';
const sulla = require('sulla');

sulla.create().then((client) => start(client));

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Hi') {
      client.sendText(message.from, '👋 Hello from sulla!');
    }
  });
}
```

<img align="left" src="https://github.com/danielcardeenas/sulla/blob/master/img/auth.gif?raw=true" width="370px">

##### After executing `create()` function, **sulla** will create an instance of whatsapp web. If you are not logged in, it will print a QR code in the terminal. Scan it with your phone and you are ready to go!

##### Sulla will remember the session so there is no need to authenticate everytime.

##### Multiples sessions can be created at the same time by pasing a session name to `create()` function:

```javascript
// Init sales whatsapp bot
sulla.create('sales').then((salesBot) => {...});

// Init support whatsapp bot
sulla.create('support').then((supportBot) => {...});
```
<br>

## Basic functions (usage)
Not every available function is listed, for further look, every function available can be found in [here](/src/api/layers). 

### Chatting
```javascript
// Send basic text
await client.sendText(chatId, '👋 Hello from sulla!');

// Send image
await client.sendImage(chatId, 'path/to/img.jpg', 'something.jpg', 'Caption text');

// Send @tagged message
await client.sendMentioned(chatId, 'Hello @5218113130740 and @5218243160777!', ['5218113130740', '5218243160777']);

// Reply to a message
await client.reply(chatId, 'This is a rely!', message.id.toString());

// Send file (sulla will take care of mime types, just need the path)
await client.sendFile(chatId, 'path/to/file.pdf', 'cv.pdf', 'Curriculum');

// Send gif
await client.sendVideoAsGif(chatId, 'path/to/video.mp4', 'video.gif', 'Gif image file');

// Send contact
// contactId: 52155334634@c.us
await client.sendContact(chatId, contactId);

// Forwards messages
await client.forwardMessages(chatId, [message.id.toString()], true);

// Send sticker
await client.sendImageAsSticker(chatId, 'path/to/image.jpg');

// Send location
await client.sendLocation(chatId, 25.6801987, -100.4060626, 'Some address, Washington DC', 'Subtitle');

// Send seen ✔️✔️
await client.sendSeen(chatId);

// Start typing...
await client.startTyping(chatId);

// Stop typing
await client.stopTyping(chatId);

// Set chat state (0: Typing, 1: Recording, 2: Paused)
await client.setChatState(chatId, 0 | 1 | 2)

```

### Group functions
```javascript
// groupId or chatId: leaveGroup 52123123-323235@g.us

// Leave group
await client.leaveGroup(groupId);

// Get group members
await client.getGroupMembers(groupId);

// Get group members ids
await client.getGroupMembersIds(groupId);

// Generate group invite url link
await client.getGroupInviteLink(groupId);

// Create group (title, participants to add)
await client.createGroup('Group name', ['123123@c.us', '45456456@c.us']);

// Remove participant
await client.removeParticipant(groupId, '123123@c.us');

// Add participant
await client.addParticipant(groupId, '123123@c.us');

// Promote participant (Give admin privileges)
await client.promoteParticipant(groupId, '123123@c.us');

// Demote particiapnt (Revoke admin privileges)
await client.demoteParticipant(groupId, '123123@c.us');

// Get group admins
await client.getGroupAdmins(groupId);

```

### Profile functions
```javascript
// Set client status
await client.setProfileStatus('On vacations! ✈️');

// Set client profile name
await client.setProfileName('Sulla bot');
```

### Device functions
```javascript
// Get device info
await client.getHostDevice();

// Get connection state
await client.getConnectionState();

// Get battery level
await client.getBatteryLevel();

// Is connected
await client.isConnected();

// Get whatsapp web version
await client.getWAVersion();
```

### Events
```javascript
// Listen to messages
client.onMessage(message => {
  ...
})

// Listen to state changes
client.onStateChange(state => {
  ...
});

// Listen to ack's
client.onAck(ack => {
  ...
});

// Listen to live location
// chatId: 'phone@c.us'
client.onLiveLocation(chatId, (liveLocation) => {
  ...
});

// Listen to group participant changes
client.onParticipantsChanged(chatId, (participantChange) => {
  ...
});

// Listen when client has been added to a group
client.onAddedToGroup(chatEvent => {
  ...
});

```

### Other
```javascript
// Delete chat
await client.deleteChat(chatId);

// Clear chat messages
await client.clearChat(chatId);

// Delete message (last parameter: delete only locally)
await client.deleteMessage(chatId, message.id.toString(), false)
```

## Misc
There are some tricks for a better usage of sulla.

#### Keep session alive:
```javascript
// In case of being logged out of whatsapp web
// Force it to keep the current session
client.onStateChange((state) => {
  if (state === 'UNLAUNCHED') {
    client.useHere();
  }
});
```

#### Send message to new contacts (non-added)
Also see [Whatsapp links](https://faq.whatsapp.com/en/26000030/)
```javascript
await client.sendMessageToId('5212234234@c.us', 'Hello from sulla! 👋')
```

#### Multiple sessions
If you need to run multiple sessions at once just pass a session name to `create()` method.
```javascript
async () => {
  const marketingClient = await sulla.create('marketing');
  const salesClient = await sulla.create('sales');
  const supportClient = await sulla.create('support');
} 
```

#### Closing (saving) sessions
Close the session properly to ensure the session is saved for the next time you log in (So it wont ask for QR scan again).
So instead of CTRL+C,
```javascript
// Catch ctrl+C
process.on('SIGINT', function() {
  client.close();
});

// Try-catch close
try {
   ...
} catch (error) {
   client.close();
}
```

## Development
Building sulla is really simple altough it contians 3 main projects inside
1. Wapi project 
```bash
> npm run build:wapi
```
2. Middleeware
```bash
> npm run build:build:middleware
> npm run build:jsQR
```
3. Sulla
```bash
> npm run build:sulla
```

To build the entire project just run
```bash
> npm run build
```

## Maintainers
Maintainers are needed, I cannot keep with all the updates by myself. If you are interested please open a Pull Request.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
