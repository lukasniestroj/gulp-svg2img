'use strict';

const through2 = require('through2');
const svg2img = require('svg2img');
const path = require('path');

module.exports = function(options) {
  return through2.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file); // Do nothing if no contents
      return callback();
    }
    if (file.isStream()) {
      return callback();
    }
    if (file.isBuffer()) {
      const content = String(file.contents.toString());
      svg2img(content, options, function (error, buffer) {
        const filename = file.path;
        file.path = filename.replace(path.extname(filename), `.${options?.format ?? 'png'}`)
        file.contents = buffer;
        return callback(null, file);
      });
    }
  })
}
