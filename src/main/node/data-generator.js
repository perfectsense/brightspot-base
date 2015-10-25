var Chance = require('chance');
var _ = require('lodash');
var traverse = require('traverse');

function DataGenerator(seed) {
  this.chance = new Chance(seed);
}

DataGenerator.prototype.image = function (width, height) {
  return '/placeholder-image/' + this.chance.guid() + '/' + width + 'x' + height;
};

DataGenerator.prototype.name = function () {
  return this.chance.name();
};

DataGenerator.prototype._count = function (count) {
  if (Array.isArray(count)) {
    return this.chance.integer({
      min: count[0],
      max: count[1]
    });

  } else {
    return count;
  }
};

DataGenerator.prototype._repeat = function (count, separator, callback) {
  var items = [ ];

  for (count = this._count(count); count > 0; -- count) {
    items.push(callback.call(this));
  }

  return items.join(separator)
};

function capitalize(string) {
  return string.length > 0 ? string.slice(0, 1).toUpperCase() + string.slice(1) : '';
}

DataGenerator.prototype.words = function (wordCount) {
  return capitalize(this._repeat(wordCount || [ 12, 18 ], ' ', function () {
    return this.chance.bool({ likelihood: 5 }) ?
      this.chance.name() :
      this.chance.word();
  }));
};

DataGenerator.prototype.sentences = function (sentenceCount, wordCount) {
  return this._repeat(sentenceCount || [ 3, 7 ], ' ', function () {
    return capitalize(this.words(wordCount)) + '.';
  });
};

DataGenerator.prototype.paragraphs = function (paragraphCount, sentenceCount, wordCount) {
  return this._repeat(paragraphCount || [ 1, 3 ], '', function () {
    return '<p>' + this.sentences(sentenceCount, wordCount) + '</p>';
  });
};

DataGenerator.prototype.process = function (data) {
  var self = this;

  traverse(data).forEach(function (value) {
    var node = this;

    // If there are any objects with _repeat entry in the list,
    // clone them.
    if (Array.isArray(value)) {
      var newArray = [ ];

      value.forEach(function (item) {
        var repeat = item._repeat;

        if (repeat) {
          for (repeat = self._count(repeat); repeat > 0; -- repeat) {
            newArray.push(_.clone(item, true));
          }

        } else {
          newArray.push(item);
        }
      });

      node.update(newArray);

    } else if (typeof value === 'string') {

      // Handlebars-like variable substitution.
      value.replace(/\{\{(.*?)}}/, function (match, invocation) {
        if (invocation.indexOf('(') < 0) {
          invocation += '()';
        }

        try {
          node.update(eval('self.' + invocation));

        } catch (err) {
          throw new Error(invocation + ' is not a valid DataGenerator function invocation! ' + err.stack);
        }
      });
    }
  });
};

module.exports = DataGenerator;
