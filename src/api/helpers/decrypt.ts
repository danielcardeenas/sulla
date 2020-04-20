import * as crypto from 'crypto';
import * as hkdf from 'futoin-hkdf';
import { Message } from '../model';
import { MediaType } from '../model/enum';

/**
 * Decrypts given message file
 * @param encBase64 .enc file as base64
 * @param message Message object
 * @returns dectypted file as buffer
 */
export function decrypt(encBase64: string, message: Message) {
  const encBuffer = Buffer.from(encBase64, 'base64');
  const file = generateFile(encBuffer, message.mediaKey, message.type);
  return file;
}

/**
 * Generates buffer file from enc file and media key
 * @param encBuffer
 * @param mediaKeyBase64
 * @param mediaType
 */
function generateFile(
  encBuffer: Buffer,
  mediaKeyBase64: string,
  mediaType: string
) {
  // Generic derivation
  const expandedDerivation = expandDerivation(mediaType, mediaKeyBase64);

  // Dechipher
  const deciphed = decipher(expandedDerivation);

  // Decode
  encBuffer = encBuffer.slice(0, -10);
  const decoded = deciphed.update(encBuffer);
  const fileBuffer = Buffer.from(decoded as any, 'utf-8');
  return fileBuffer;
}

/**
 * Executes HMAC-based Extract-and-Expand Key Derivation Function (HKDF).
 * @param mediaType
 * @param mediaKeyBase64
 */
function expandDerivation(mediaType: string, mediaKeyBase64: string) {
  const options: hkdf.Options = {
    salt: new Uint8Array(32) as any,
    info: `WhatsApp ${mediaType && MediaType[mediaType.toUpperCase()] || 'Unknown'} Keys`,
    hash: 'sha256',
  };

  // required output length in bytes
  const length = 112;
  const mediaKeyBuffer = Buffer.from(mediaKeyBase64, 'base64');

  // Generic derivation
  return hkdf(mediaKeyBuffer, length, options);
}

function decipher(expandedDerivation: Buffer) {
  const cropped = expandedDerivation.slice(0, 16);
  const cipherKey = expandedDerivation.slice(16, 48);
  return crypto.createDecipheriv('aes-256-cbc', cipherKey, cropped);
}
