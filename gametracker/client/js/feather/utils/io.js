define(function (require, exports) {

  function load(url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);

      if (xhr.overrideMimeType) {
        xhr.overrideMimeType('text/plain');
      }

      xhr.addEventListener('load', function io_load(e) {
        if (e.target.status === 200 || e.target.status === 0) {
          resolve(e.target.responseText);
        } else {
          reject(Error(xhr.statusText));
        }
      });

      xhr.addEventListener('error', function() {
        reject(Error('Network Error'));
      });

      xhr.send();
    });
  }

  function loadJSON (url, callback) {
    var xhr = new XMLHttpRequest();

    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('application/json');
    }

    xhr.open('GET', url);

    xhr.responseType = 'json';
    xhr.addEventListener('load', function io_loadjson(e) {
      if (e.target.status === 200 || e.target.status === 0) {
        callback(null, e.target.response);
      } else {
        callback(new L10nError('Not found: ' + url));
      }
    });
    xhr.addEventListener('error', callback);
    xhr.addEventListener('timeout', callback);

    // the app: protocol throws on 404, see https://bugzil.la/827243
    try {
      xhr.send(null);
    } catch (e) {
      callback(new L10nError('Not found: ' + url));
    }
  }

  exports.load = load;
  exports.loadJSON = loadJSON;

});
