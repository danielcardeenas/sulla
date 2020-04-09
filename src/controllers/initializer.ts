import { readFileSync } from 'fs';
import latestVersion from 'latest-version';
import { Whatsapp } from '../api/whatsapp';
import { CreateConfig } from '../config/create-config';
import { isAuthenticated, isInsideChat, retrieveQR } from './auth';
import { initWhatsapp, injectApi } from './browser';
import { upToDate } from '../utils/semver';
import chalk = require('chalk');
import boxen = require('boxen');

const { version } = require('../../package.json');

/**
 * Should be called to initialize whatsapp client
 */
export async function create(
  session = 'session',
  catchQR?: (qrCode: string) => void,
  options?: CreateConfig
) {
  const defaultOptions: CreateConfig = {
    headless: true,
    devtools: false,
    useChrome: true,
    debug: false,
  };

  checkSullaVersion();
  let waPage = await initWhatsapp(session, { ...defaultOptions, ...options });

  console.log('Initializing sulla');
  console.log('Authenticating');
  const authenticated = await isAuthenticated(waPage);

  // If not authenticated, show QR and wait for scan
  if (authenticated) {
  } else {
    console.log('Authenticate to continue');
    const { data, asciiQR } = await retrieveQR(waPage);
    if (catchQR) {
      catchQR(data);
    }

    // Wait til inside chat
    await isInsideChat(waPage).toPromise();
  }

  console.log('Injecting api');
  waPage = await injectApi(waPage);
  console.log('Whatsapp is ready');

  if (options.debug) {
    const debugURL = `http://localhost:${readFileSync(
      `./${session}/DevToolsActivePort`
    ).slice(0, -54)}`;
    console.log(`\nDebug: \x1b[34m${debugURL}\x1b[0m`);
  }

  return new Whatsapp(waPage);
}

/**
 * Checs for a new versoin of sulla and logs
 */
function checkSullaVersion() {
  latestVersion('sulla').then((latest) => {
    if (!upToDate(version, latest)) {
      logUpdateAvailable(version, latest);
    }
  });
}

/**
 * Logs a boxen of instructions to update
 * @param current
 * @param latest
 */
function logUpdateAvailable(current: string, latest: string) {
  // prettier-ignore
  const newVersionLog = 
  `There is a new version of ${chalk.bold(`sulla`)} ${chalk.gray(current)} ➜  ${chalk.bold.green(latest)}\n` + 
  `Update your package by running:\n\n` +
  `${chalk.bold('\>')} ${chalk.blueBright('npm update sulla')}`;

  console.log(boxen(newVersionLog, { padding: 1 }));
  console.log(
    `For more info visit: ${chalk.underline(
      'https://github.com/danielcardeenas/sulla/blob/master/UPDATES.md'
    )}\n`
  );
}
