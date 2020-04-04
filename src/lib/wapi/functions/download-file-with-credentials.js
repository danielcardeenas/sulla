/**
 * Downloads given url file
 * @param {string} url
 * @param {Function} done Optional callback
 */
export function downloadFileWithCredentials(url, done) {
  let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        let reader = new FileReader();
        reader.readAsDataURL(xhr.response);
        reader.onload = function (e) {
          done(reader.result.substr(reader.result.indexOf(',') + 1));
        };
      } else {
        console.error(xhr.statusText);
      }
    } else {
      console.log(err);
      done(false);
    }
  };

  xhr.open('GET', url, true);
  xhr.withCredentials = true;
  xhr.responseType = 'blob';
  xhr.send(null);
}
