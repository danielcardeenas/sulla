import * as fs from 'fs';

/**
 * Converts given file into base64 string
 * @param path file path
 */
export function fileToBase64(path: string) {
  const base64 = fs.readFileSync(path, { encoding: 'base64' });
  const data = `data:${'image/jpeg'};base64,${base64}`;
  return data;
}
