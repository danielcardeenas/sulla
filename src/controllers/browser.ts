import * as path from 'path';
import * as puppeteer from 'puppeteer';
import { puppeteerConfig } from '../config/puppeteer.config';

export async function initWhatsapp(
  session: string,
  headless: boolean,
  devtools: boolean
) {
  const browser = await initBrowser(session, headless, devtools);
  const waPage = await getWhatsappPage(browser);
  await waPage.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36'
  );

  await waPage.goto(puppeteerConfig.whatsappUrl);
  return waPage;
}

export async function injectApi(page: puppeteer.Page) {
  await page.addScriptTag({
    path: require.resolve(path.join(__dirname, '../lib/wapi', 'wapi.js'))
  });
  await page.addScriptTag({
    path: require.resolve(
      path.join(__dirname, '../lib/middleware', 'middleware.js')
    )
  });

  return page;
}

async function initBrowser(
  session: string,
  headless: boolean,
  devtools: boolean
) {
  const browser = await puppeteer.launch({
    headless: headless,
    devtools: devtools,
    userDataDir: path.join(process.cwd(), session),
    args: [...puppeteerConfig.chroniumArgs]
  });
  return browser;
}

async function getWhatsappPage(browser: puppeteer.Browser) {
  const pages = await browser.pages();
  console.assert(pages.length > 0);
  return pages[0];
}
