var ENDS_WITH = require('./lib/polyfill/string-ends-with.js');
var FS = require('fs');

// Group all errors by originating file.
var errorsByFile = { };

function addError(file, type, message) {
  var errors = errorsByFile[file];

  if (!errors) {
    errors = errorsByFile[file] = [ ];
  }

  errors.push({
    type: type,
    message: message
  });
}

// Group all objects by their template path for later analysis.
var objects = { };

function verifyExample(example, json) {
  if (typeof json !== 'object') {
    return;
  }

  if (Array.isArray(json)) {
    json.forEach(function (item) {
      verifyExample(example, item);
    });

  } else {

    // Make sure that JSON objects have either _dataUrl or _template entry.
    if (!json._dataUrl) {
      var template = json._template;

      if (template) {
        (objects[template] = objects[template] || [])[example] = json;

        Object.keys(json).forEach(function (key) {
          verifyExample(example, json[key]);
        });

      } else {
        addError(example, 'TEMPLATE', JSON.stringify(json, function (key, value) {
          return key === "" ? value : "...";
        }));
      }
    }
  }
}

// Verify all styleguide example JSON files.
require('./lib/find-examples.js')().forEach(function (example) {
  verifyExample(example, JSON.parse(FS.readFileSync(example, 'utf8')));
});

var PARTIAL_RE = /\{\{>.*?}}/g;
var HTML_RE = /\{\{\{\s*(.*?)\s*}}}/g;

function verifyTemplate(template) {
  var templateString = FS.readFileSync(template, 'utf8');
  var match;

  // Make sure that partials aren't used.
  while ((match = PARTIAL_RE.exec(templateString)) != null) {
    addError(template, 'PARTIAL', match[0]);
  }

  // Make sure that unescaped HTML output is intentional.
  while ((match = HTML_RE.exec(templateString)) != null) {
    var expr = match[1];

    if (expr !== 'html' && !ENDS_WITH(expr, 'Html')) {
      addError(template, 'HTML', match[0]);
    }
  }
}

// Verify all Handlebars templates.
require('./lib/find-templates.js')().forEach(function (template) {
  verifyTemplate(template);
});

// Display all errors.
Object.keys(errorsByFile).sort().forEach(function (file) {
  console.warn(file);

  errorsByFile[file].forEach(function (error) {
    console.warn("\t" + error.type + ": " + error.message);
  });
});
