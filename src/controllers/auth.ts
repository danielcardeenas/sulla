import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as qrcode from 'qrcode-terminal';
import { from, merge } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Validates if client is authenticated
 * @returns true if is authenticated, false otherwise
 * @param waPage
 */
export const isAuthenticated = (waPage: puppeteer.Page) => {
  return merge(needsToScan(waPage), isInsideChat(waPage))
    .pipe(take(1))
    .toPromise();
};

export const needsToScan = (waPage: puppeteer.Page) => {
  return from(
    waPage
      .waitForSelector('body > div > div > .landing-wrapper', {
        timeout: 0,
      })
      .then(() => false)
  );
};

export const isInsideChat = (waPage: puppeteer.Page) => {
  return from(
    waPage
      .waitForFunction(
        `
        (document.getElementsByClassName('app')[0] &&
        document.getElementsByClassName('app')[0].attributes &&
        !!document.getElementsByClassName('app')[0].attributes.tabindex) ||
        (document.getElementsByClassName('two')[0] &&
        document.getElementsByClassName('two')[0].attributes &&
        !!document.getElementsByClassName('two')[0].attributes.tabindex)
        `,
        {
          timeout: 0,
        }
      )
      .then(() => true)
  );
};

export async function retrieveQR(page: puppeteer.Page) {
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

async function decodeQR(
  page: puppeteer.Page
): Promise<{ code: string; data: string }> {
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
