import { Page, Response } from 'puppeteer';

export function waitForResponse<T>(
  page: Page,
  url: string,
  withFn?: (response: Response) => boolean | Promise<boolean>
): Promise<{ response: T; statusCode: number }> {
  return new Promise((resolve, reject) => {
    page.on('response', async function callback(response) {
      if (response.url().includes(url)) {
        // Generate result
        const genResult = async () => {
          const json = await response
            .json()
            .then((r: T) => r as T)
            .catch(() => null);

          if (json) {
            resolve({ response: json, statusCode: response.status() });
          }
          page.removeListener('response', callback);
        };

        if (withFn !== undefined) {
          if (await withFn(response)) {
            genResult();
          }
        } else {
          genResult();
        }
      }
    });
  });
}

export const jsonable = async (response: Response) => {
  try {
    await response.json();
    return true;
  } catch (err) {
    return false;
  }
};
