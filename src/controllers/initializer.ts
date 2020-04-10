import { readFileSync } from 'fs';
import latestVersion from 'latest-version';
import { Whatsapp } from '../api/whatsapp';
import { CreateConfig } from '../config/create-config';
import { isAuthenticated, isInsideChat, retrieveQR } from './auth';
import { initWhatsapp, injectApi } from './browser';
import { upToDate } from '../utils/semver';
import chalk = require('chalk');
import boxen = require('boxen');
import Spinnies = require('spinnies');
const { version } = require('../../package.json');

let updatesChecked = false;

/**
 * Should be called to initialize whatsapp client
 */
export async function create(
  session = 'session',
  catchQR?: (qrCode: string, asciiQR: string) => void,
  options?: CreateConfig
) {
  const spinnies = new Spinnies();
  const defaultOptions: CreateConfig = {
    headless: true,
    devtools: false,
    useChrome: true,
    debug: false,
    logQR: true,
    browserArgs: [''],
  };

  // Check for updates if needed
  if (!updatesChecked) {
    spinnies.add('sulla-version-spinner', { text: 'Checking for updates...' });
    checkSullaVersion(spinnies);
    updatesChecked = true;
  }

  // Initialize whatsapp
  spinnies.add(`${session}`, { text: 'Creating whatsapp instace...' });

  const mergedOptions = { ...defaultOptions, ...options };
  let waPage = await initWhatsapp(session, mergedOptions);

  spinnies.update(`${session}`, { text: 'Authenticating...' });
  const authenticated = await isAuthenticated(waPage);

  // If not authenticated, show QR and wait for scan
  if (authenticated) {
  } else {
    spinnies.update(`${session}`, {
      text: `Authenticate to continue`,
    });

    const { data, asciiQR } = await retrieveQR(waPage);
    if (catchQR) {
      catchQR(data, asciiQR);
    }

    if (mergedOptions.logQR) {
      console.log(`Scan QR for: ${session}`);
      console.log(asciiQR);
    }

    // Wait til inside chat
    await isInsideChat(waPage).toPromise();
    spinnies.succeed(`${session}`, { text: 'Authenticated' });
  }

  console.info('Injecting api');
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
function checkSullaVersion(spinnies) {
  latestVersion('sulla').then((latest) => {
    if (!upToDate(version, latest)) {
      logUpdateAvailable(version, latest);
    }

    spinnies.succeed('sulla-version-spinner', { text: 'Checking for updates' });
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
