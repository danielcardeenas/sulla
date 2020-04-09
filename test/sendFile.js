const { create } = require('../dist/index');

var client;

async function startClient() {
  client = await create('session', () => console.log('QR Code received'), {
    headless: false,
    devtools: true,
  });

  client.onStateChange((state) => {
    if (state === 'UNLAUNCHED') {
      client.useHere();
    }
  });

  await client.sendFile(
    process.argv[2] + '@c.us',
    './media/GoPro.mp4',
    'GoPro.mp4',
    'Test file send'
  );
}

console.log('Test send file to: ' + process.argv[2]);

startClient().catch(console.error);
