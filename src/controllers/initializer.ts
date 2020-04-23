import { readFileSync } from 'fs';
import latestVersion from 'latest-version';
import { Page } from 'puppeteer';
import { from, interval, timer } from 'rxjs';
import { map, takeUntil, tap, delay, switchMap } from 'rxjs/operators';
import { Whatsapp } from '../api/whatsapp';
import { CreateConfig, defaultOptions } from '../config/create-config';
import { upToDate } from '../utils/semver';
import { isAuthenticated, isInsideChat, retrieveQR } from './auth';
import { initWhatsapp, injectApi } from './browser';
import chalk = require('chalk');
import boxen = require('boxen');
import Spinnies = require('spinnies');
import { events } from './events';
const { version } = require('../../package.json');

// Global
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

  // Check for updates if needed
  if (!updatesChecked) {
    spinnies.add('sulla-version-spinner', { text: 'Checking for updates...' });
    checkSullaVersion(spinnies);
    updatesChecked = true;
  }

  // Initialize whatsapp
  spinnies.add(`${session}-auth`, { text: 'Creating whatsapp instace...' });

  const mergedOptions = { ...defaultOptions, ...options };
  let waPage = await initWhatsapp(session, mergedOptions);

  // emitted when page crashes
  waPage.on('error', function (err) {
    events.emit('error', err);
    // TODO: Should we do something here to handle the page crash?
  });

  // emitted when an uncaught exception happens within the page.
  waPage.on('pageerror', function (err) {
    events.emit('pageError', err);
  });

  events.emit('initialized', waPage);

  spinnies.update(`${session}-auth`, { text: 'Authenticating...' });
  const authenticated = await isAuthenticated(waPage);

  // If not authenticated, show QR and wait for scan
  if (authenticated) {
    // Wait til inside chat
    await isInsideChat(waPage).toPromise();
    spinnies.succeed(`${session}-auth`, { text: 'Authenticated' });
    events.emit('authenticated');
  } else {
    spinnies.update(`${session}-auth`, {
      text: `Authenticate to continue`,
    });

    if (mergedOptions.refreshQR <= 0) {
      const { data, asciiQR } = await retrieveQR(waPage);
      events.emit('qrCode', data, asciiQR);
      if (catchQR) {
        catchQR(data, asciiQR);
      }

      if (mergedOptions.logQR) {
        console.log(`Scan QR for: ${session}                `);
        console.log(asciiQR);
      }
    } else {
      grabQRUntilInside(waPage, mergedOptions, session, catchQR);
    }

    // Wait til inside chat
    await isInsideChat(waPage).toPromise();
    spinnies.succeed(`${session}-auth`, { text: 'Authenticated' });
    events.emit('authenticated');
  }

  spinnies.add(`${session}-inject`, { text: 'Injecting api...' });
  waPage = await injectApi(waPage);
  spinnies.succeed(`${session}-inject`, { text: 'Injecting api' });

  if (mergedOptions.debug) {
    const debugURL = `http://localhost:${readFileSync(
      `./${session}/DevToolsActivePort`
    ).slice(0, -54)}`;
    console.log(`\nDebug: \x1b[34m${debugURL}\x1b[0m`);
  }

  return new Whatsapp(waPage);
}

function grabQRUntilInside(
  waPage: Page,
  options: CreateConfig,
  session: string,
  catchQR: (qrCode: string, asciiQR: string) => void
) {
  const isInside = isInsideChat(waPage);
  timer(0, options.refreshQR)
    .pipe(
      takeUntil(isInside),
      switchMap(() => retrieveQR(waPage))
    )
    .subscribe(({ data, asciiQR }) => {
      if (catchQR) {
        catchQR(data, asciiQR);
      }
      if (options.logQR) {
        console.clear();
        console.log(`Scan QR for: ${session}                `);
        console.log(asciiQR);
      }
    });
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
