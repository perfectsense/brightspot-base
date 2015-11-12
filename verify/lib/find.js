var ENDS_WITH = require('./polyfill/string-ends-with.js');
var FS = require('fs');
var PATH = require('path');

function addPaths(paths, prefix, suffix) {
  FS.readdirSync(prefix).forEach(function (file) {
    var path = PATH.join(prefix, file);
    var stat = FS.lstatSync(path);

    if (stat.isDirectory()) {
      addPaths(paths, path, suffix);

    } else if (ENDS_WITH(path, suffix)) {
      paths.push(path);
    }
  });

  return paths;
}

module.exports = function (prefix, suffix) {
  return addPaths([ ], prefix, suffix);
};

