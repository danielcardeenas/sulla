import * as path from 'path';
import { Page } from 'puppeteer';
import * as qrcode from 'qrcode-terminal';
import { BehaviorSubject, from, merge, of, race } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { htmlAuthQuery } from './constants/html-auth-query';

const networkAuthenticated = new BehaviorSubject(false);
const htmlAuthenticated = (page: Page) => {
  return from(
    page
      .waitForFunction(htmlAuthQuery, {
        timeout: 0,
      })
      .then(() => true)
  );
};

/**
 * Detects login via network requests listening
 * @param waPage 
 */
export const listenNetworkAuth = (waPage: Page) => {
  waPage.on('response', async function callback(response) {
    if (response.url().includes('_priority_components')) {
      networkAuthenticated.next(true);
      waPage.removeListener('response', callback);
    }
  });
};

/**
 * Validates if client is authenticated
 * @returns true if is authenticated, false otherwise
 * @param waPage
 */
export const isAuthenticated = (waPage: Page) => {
  return merge(needsToScan(waPage), isInsideChat(waPage))
    .pipe(take(1))
    .toPromise();
};

export const needsToScan = (waPage: Page) => {
  return from(
    waPage
      .waitForSelector('body > div > div > .landing-wrapper', {
        timeout: 0,
      })
      .then(() => false)
  );
};

export const isInsideChat = (waPage: Page) => {
  if (networkAuthenticated.getValue()) {
    return of(true);
  }

  return race([
    networkAuthenticated.pipe(filter((auth) => auth)),
    htmlAuthenticated(waPage),
  ]);
};

export async function retrieveQR(page: Page) {
  const { code, data } = await decodeQR(page);
  const asciiQR = await asciiQr(code);
  return { code, data, asciiQR };
}

async function asciiQr(code: string): Promise<string> {
  return new Promise((resolve, reject) => {
    qrcode.generate(code, { small: true }, (qrcode) => {
      resolve(qrcode);
    });
  });
}

async function decodeQR(page: Page): Promise<{ code: string; data: string }> {
  await page.waitForSelector('canvas', { timeout: 0 });
  await page.addScriptTag({
    path: require.resolve(path.join(__dirname, '../lib/jsQR', 'jsQR.js')),
  });

  return await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    // @ts-ignore
    const code = jsQR(
      context.getImageData(0, 0, canvas.width, canvas.height).data,
      canvas.width,
      canvas.height
    );

    return { code: code.data, data: canvas.toDataURL() };
  });
}
