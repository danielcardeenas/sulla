import * as jsSHA from '../jssha';

/**
 * Retrieves given file hash (SHA-256 -> Base64)
 * @param {Blob} data
 */
export async function getFileHash(data) {
  let buffer = await data.arrayBuffer();
  var sha = new jsSHA('SHA-256', 'ARRAYBUFFER');
  sha.update(buffer);
  return sha.getHash('B64');
}
