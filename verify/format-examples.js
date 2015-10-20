var FS = require('fs');

function addTemplateToAttributes(json) {
  switch (typeof json) {
    case 'object' :
      Object.keys(json).forEach(function (key) {
        if (key === 'attributes'
            && !json[key]._template) {

          json[key]._template = 'common/attributes';
        }

        addTemplateToAttributes(json[key]);
      });

      break;

    case 'array' :
      json.forEach(function (item) {
        addTemplateToAttributes(item);
      });

      break;
  }
}

require('./lib/find-examples.js')().forEach(function (example) {
  var oldText = FS.readFileSync(example, 'utf8');
  var json = JSON.parse(oldText);

  addTemplateToAttributes(json);

  var newText = JSON.stringify(json, null, '  ');

  if (oldText !== newText) {
    FS.writeFileSync(example, newText, 'utf8');
    console.log('Changed', example);
  }
});
