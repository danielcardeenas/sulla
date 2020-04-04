<p align="center">
  <a href="https://github.com/danielcardeenas/sulla">
    <img width="30%" src="https://github.com/danielcardeenas/sulla/blob/master/img/logo.jpg?raw=true" alt="Sulla logo">
  </a>
</p>

# Sulla

[![npm version](https://img.shields.io/npm/v/sulla.svg?color=%2378e08f)](https://www.npmjs.com/package/sulla)
![npm type definitions](https://img.shields.io/npm/types/sulla)
![GitHub last commit](https://img.shields.io/github/last-commit/danielcardeenas/sulla)
[![GitHub license](https://img.shields.io/github/license/danielcardeenas/sulla)](https://github.com/danielcardeenas/sulla/blob/master/LICENSE)

> Sulla is a javascript library which provides a high-level API control to Whatsapp so it can be configured to automatize resposes or any data that goes trough Whatsapp effortlessly.
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

<img align="left" src="https://github.com/danielcardeenas/sulla/blob/master/img/auth.gif?raw=true" height="320">

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

## Usage


## Maintainers
Maintainers are needed, I cannot keep with all the updates by myself. If you are interested please open a Pull Request.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
