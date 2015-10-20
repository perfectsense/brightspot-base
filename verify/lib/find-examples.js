var ENDS_WITH = require('./polyfill/string-ends-with.js');
var FS = require('fs');
var PATH = require('path');

function addExamples(examples, prefix) {
  FS.readdirSync(prefix).forEach(function (file) {
    var path = PATH.join(prefix, file);
    var stat = FS.lstatSync(path);

    if (stat.isDirectory()) {
      addExamples(examples, path);

    } else if (ENDS_WITH(path, '.json')) {
      examples.push(path);
    }
  });
}

module.exports = function (prefix) {
  var examples = [ ];

  if (!prefix) {
    prefix = 'styleguide'
  }

  addExamples(examples, prefix);

  return examples;
};

