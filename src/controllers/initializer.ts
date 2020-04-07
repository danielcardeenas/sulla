import * as ora from 'ora';
import { readFileSync } from 'fs';
import { Whatsapp } from '../api/whatsapp';
import { CreateConfig } from '../config/create-config';
import { isAuthenticated, isInsideChat, retrieveQR } from './auth';
import { initWhatsapp, injectApi } from './browser';
const spinner = ora();

/**
 * Should be called to initialize whatsapp client
 */
export async function create(
  session = 'session',
  catchQR?: (qrCode: string) => void,
  options: CreateConfig = {
    headless: true,
    devtools: false,
    useChrome: true,
    debug: false,
  }
) {
  spinner.start('Initializing whatsapp');
  let waPage = await initWhatsapp(session, options);
  spinner.succeed();

  spinner.start('Authenticating');
  const authenticated = await isAuthenticated(waPage);

  // If not authenticated, show QR and wait for scan
  if (authenticated) {
    spinner.succeed();
  } else {
    spinner.info('Authenticate to continue');
    const { data } = await retrieveQR(waPage);
    if (catchQR) {
      catchQR(data);
    }

    // Wait til inside chat
    await isInsideChat(waPage).toPromise();
    spinner.succeed();
  }

  spinner.start('Injecting api');
  waPage = await injectApi(waPage);
  spinner.succeed('Whatsapp is ready');

  if (options.debug) {
    const debugURL = `http://localhost:${readFileSync(
      `./${session}/DevToolsActivePort`
    ).slice(0, -54)}`;
    console.log(`\nDebug: \x1b[34m${debugURL}\x1b[0m`);
  }

  return new Whatsapp(waPage);
}
