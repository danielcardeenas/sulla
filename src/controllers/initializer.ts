import * as ora from 'ora';
import { Whatsapp } from '../api/whatsapp';
import { isAuthenticated, isInsideChat, retrieveQR } from './auth';
import { initWhatsapp, injectApi } from './browser';
import { CreateConfig } from '../config/create-config';
const spinner = ora();

/**
 * Should be called to initialize whatsapp client
 */
export async function create(
  session?: string,
  options: CreateConfig = { headless: true, devtools: false }
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
    await retrieveQR(waPage);

    // Wait til inside chat
    await isInsideChat(waPage).toPromise();
    spinner.succeed();
  }

  spinner.start('Injecting api');
  waPage = await injectApi(waPage);
  spinner.succeed('Whatsapp is ready');

  return new Whatsapp(waPage);
}
