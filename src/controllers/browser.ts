import * as ChromeLauncher from 'chrome-launcher';
import * as path from 'path';
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { CreateConfig } from '../config/create-config';
import { puppeteerConfig } from '../config/puppeteer.config';
import chalk = require('chalk');
import StealthPlugin = require('puppeteer-extra-plugin-stealth');

export async function initWhatsapp(session: string, options: CreateConfig) {
  const browser = await initBrowser(session, options);
  const waPage = await getWhatsappPage(browser);
  await waPage.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  );

  await waPage.goto(puppeteerConfig.whatsappUrl);
  return waPage;
}

export async function injectApi(page: Page) {
  await page.waitForFunction(() => {
    // @ts-ignore
    return webpackJsonp !== undefined;
  });

  await page.addScriptTag({
    path: require.resolve(path.join(__dirname, '../lib/wapi', 'wapi.js')),
  });
  await page.addScriptTag({
    path: require.resolve(
      path.join(__dirname, '../lib/middleware', 'middleware.js')
    ),
  });

  // Make sure WAPI is initialized
  await page.waitForFunction(() => {
    // @ts-ignore
    return !!WAPI.getWAVersion;
  });

  return page;
}

/**
 * Initializes browser, will try to use chrome as default
 * @param session
 */
async function initBrowser(
  session: string,
  options: CreateConfig,
  extras = {}
) {
  if (options.useChrome) {
    const chromePath = getChrome();
    if (chromePath) {
      extras = { ...extras, executablePath: chromePath };
    } else {
      console.log('Chrome not found, using chromium');
      extras = {};
    }
  }

  // Use stealth plugin to avoid being detected as a bot
  puppeteer.use(StealthPlugin());

  const browser = await puppeteer.launch({
    // headless: true,
    headless: options.headless,
    devtools: options.devtools,
    userDataDir: path.join(process.cwd(), session),
    args: options.browserArgs
      ? options.browserArgs
      : [...puppeteerConfig.chroniumArgs],
    ...extras,
  });
  return browser;
}

async function getWhatsappPage(browser: Browser) {
  const pages = await browser.pages();
  console.assert(pages.length > 0);
  return pages[0];
}

/**
 * Retrieves chrome instance path
 */
function getChrome() {
  try {
    const chromeInstalations = ChromeLauncher.Launcher.getInstallations();
    return chromeInstalations[0];
  } catch (error) {
    return undefined;
  }
}
