/**
 * Converts base64 string to a file
 * @returns The file
 * @param {string} base64
 * @param {string} filename
 */
export function base64ToFile(base64, filename) {
  var arr = base64.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
