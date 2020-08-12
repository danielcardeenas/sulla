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
[![codebeat badge](https://codebeat.co/badges/7e510d47-8689-49da-abd8-a9a29d106a2b)](https://codebeat.co/projects/github-com-danielcardeenas-sulla-master)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdanielcardeenas%2Fsulla.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdanielcardeenas%2Fsulla?ref=badge_shield)

> Sulla is a javascript library which provides a high-level API control to
> Whatsapp so it can be configured to automatize resposes or any data that goes
> trough Whatsapp effortlessly.
>
> It is built using [puppeteer](https://github.com/GoogleChrome/puppeteer) and
> it begin based on
> [this python wrapper](https://github.com/mukulhase/WebWhatsapp-Wrapper)
>
> By default sulla will try to use Google Chrome driver if installed, if not, it
> will use integrated Chromium instance

# Deprecated
> Project is no longer being maintained at the moment
> To use the updated service, access this other project that maintained the development Sulla
[Venom](https://github.com/orkestral/venom)

#### Changelog:
> ☑️ Add `refreshQR` option in `create()`
>
> ☑️ Add `openChat()` function with UI Layer
>
> ☑️ Self check for updates
>
> ☑️ More parameters to `create()`
>
> ☑️ Added d.ts types comments for friendlier development
>
> ☑️ Fixed video send, fixed optional `create()` parameters
>
> ☑️ Bundle size now just 300 kB
>
> ☑️ Added `debug` option and `useChrome` to `create()`

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
sulla.create('sales').then((salesClient) => {...});

// Init support whatsapp bot
sulla.create('support').then((supportClient) => {...});
```

<br>

## Optional create parameters

Sulla `create()` method third parameter can have the following optional
parameters:

```javascript
create('sessionName', qrCallback, {
  headless: true, // Headless chrome
  devtools: false, // Open devtools by default
  useChrome: true, // If false will use Chromium instance
  debug: false, // Opens a debug session
  logQR: true // Logs QR automatically in terminal
  browserArgs: [''] // Parameters to be added into the chrome browser instance
  refreshQR: 15000, // Will refresh QR every 15 seconds, 0 will load QR once. Default is 30 seconds
});
```

##### The type definition con be found in here: [CreateConfig.ts](https://github.com/danielcardeenas/sulla/blob/master/src/config/create-config.ts)

## Exporting QR code

By default QR code will appear on the terminal. If you need to pass the QR
somewhere else heres how:

```javascript
const fs = require('fs');

// Second create() parameter is the QR callback
sulla.create('session-marketing', (base64Qr, asciiQR) => {
  // To log the QR in the terminal
  console.log(asciiQR);

  // To write it somewhere else in a file
  exportQR(base64Qr, 'marketing-qr.png');
});

// Writes QR in specified path
function exportQR(qrCode, path) {
  qrCode = qrCode.replace('data:image/png;base64,', '');
  const imageBuffer = Buffer.from(qrCode, 'base64');

  // Creates 'marketing-qr.png' file
  fs.writeFileSync(path, imageBuffer);
}
```

## Downloading files

Puppeteer takes care of the file downloading. The decryption is being done as
fast as possible (outruns native methods). Supports big files!

```javascript
import fs = require('fs');
import mime = require('mime-types');

client.onMessage(async (message) => {
  if (message.isMedia) {
    const buffer = await client.downloadFile(message);
    // At this point you can do whatever you want with the buffer
    // Most likely you want to write it into a file
    const fileName = `some-file-name.${mime.extension(message.mimetype)}`;
    fs.writeFile(fileName, buffer, function (err) {
      ...
    });
  }
});
```

## Basic functions (usage)

Not every available function is listed, for further look, every function
available can be found in [here](/src/api/layers) and
[here](/src/lib/wapi/functions)

### Chatting
##### Here, `chatId` could be `<phoneNuber>@c.us` or `<phoneNumber>-<groupId>@c.us`

```javascript
// Send basic text
await client.sendText(chatId, '👋 Hello from sulla!');

// Send image
await client.sendImage(
  chatId,
  'path/to/img.jpg',
  'image-name.jpg',
  'Caption text'
);

// Send @tagged message
await client.sendMentioned(chatId, 'Hello @5218113130740 and @5218243160777!', [
  '5218113130740',
  '5218243160777',
]);

// Reply to a message
await client.reply(chatId, 'This is a reply!', message.id.toString());

// Send file (sulla will take care of mime types, just need the path)
await client.sendFile(chatId, 'path/to/file.pdf', 'cv.pdf', 'Curriculum');

// Send gif
await client.sendVideoAsGif(
  chatId,
  'path/to/video.mp4',
  'video.gif',
  'Gif image file'
);

// Send contact
// contactId: 52155334634@c.us
await client.sendContact(chatId, contactId);

// Forwards messages
await client.forwardMessages(chatId, [message.id.toString()], true);

// Send sticker
await client.sendImageAsSticker(chatId, 'path/to/image.jpg');

// Send location
await client.sendLocation(
  chatId,
  25.6801987,
  -100.4060626,
  'Some address, Washington DC',
  'Subtitle'
);

// Send seen ✔️✔️
await client.sendSeen(chatId);

// Start typing...
await client.startTyping(chatId);

// Stop typing
await client.stopTyping(chatId);

// Set chat state (0: Typing, 1: Recording, 2: Paused)
await client.setChatState(chatId, 0 | 1 | 2);
```

### Retrieving data

```javascript
// Retrieve contacts
const contacts = await client.getAllContacts();

// Retrieve all messages in chat
const allMessages = await client.loadAndGetAllMessagesInChat(chatId);

// Retrieve contact status
const status = await client.getStatus(contactId);

// Retrieve user profile
const user = await client.getNumberProfile(contactId);

// Retrieve all unread message
const messages = await client.getAllUnreadMessages();

// Retrieve all chats
const chats = await client.getAllChats();

// Retrieve all groups
const chats = await client.getAllGroups();

// Retrieve profile fic (as url)
const url = await client.getProfilePicFromServer(chatId);

// Retrieve chat/conversation
const chat = await client.getChat(chatId);
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

// chatId looks like this: '5518156745634-1516512045@g.us'
// Event interface is in here: https://github.com/danielcardeenas/sulla/blob/master/src/api/model/participant-event.ts
client.onParticipantsChanged(chatId, (event) => {
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
await client.deleteMessage(chatId, message.id.toString(), false);

// Retrieve a number profile / check if contact is a valid whatsapp number
const profile = await client.getNumberProfile('0000000@c.us');
```

## Misc

There are some tricks for a better usage of sulla.

#### Keep session alive:

```javascript
// In case of being logged out of whatsapp web
// Force it to keep the current session
// State change
client.onStateChange((state) => {
  console.log(state);
  const conflits = [
    sulla.SocketState.CONFLICT,
    sulla.SocketState.UNPAIRED,
    sulla.SocketState.UNLAUNCHED,
  ];
  if (conflits.includes(state)) {
    client.useHere();
  }
});
```

#### Send message to new contacts (non-added)

Also see [Whatsapp links](https://faq.whatsapp.com/en/26000030/) Be careful
since this can pretty much could cause a ban from Whatsapp, always keep your
contacts updated!

```javascript
await client.sendMessageToId('5212234234@c.us', 'Hello from sulla! 👋');
```

#### Multiple sessions

If you need to run multiple sessions at once just pass a session name to
`create()` method.

```javascript
async () => {
  const marketingClient = await sulla.create('marketing');
  const salesClient = await sulla.create('sales');
  const supportClient = await sulla.create('support');
};
```

#### Closing (saving) sessions

Close the session properly to ensure the session is saved for the next time you
log in (So it wont ask for QR scan again). So instead of CTRL+C,

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

### Debugging

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

## Sulla state

As of version `2.3.5` it seems that sulla has reached a very rich and stable
functionality and architecture. As much as I would love to, I cannot dedicate a
lot of time to this project so please consider checking out forked versions of
sulla where other developers can dedicate more time and support to it.

## Maintainers

Maintainers are needed, I cannot keep with all the updates by myself. If you are
interested please open a Pull Request.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdanielcardeenas%2Fsulla.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdanielcardeenas%2Fsulla?ref=badge_large)
