function DataGenerator(){

    var Promise = global.Promise || require('promise');
    var log = require('./logger');
    var traverse = require('traverse-async').traverse;
    var Chance = require('chance');
    var chance = new Chance();
    var moment = require('moment');

    /*
    * Each macro function should implement Promises because so that they support async by default.
    * --------------------------------------------------------------------------------------------
    */

    /* Returns a random RGB value excluding lighter colors
    * @format: valid values are "hex", "shorthex", "rgb". (default is "rgb")
    * @threshold: allows you to specify a color cap (does not work unless "rgb" format is used)
    */
    this.color = function(format, threshold) {
        format = format || 'rgb';
        threshold = threshold || 255;
        return new Promise(function(resolve, reject) {
            if (format === 'rgb'){
                var r, g, b;
                r = chance.natural({min: 0, max: threshold});
                g = chance.natural({min: 0, max: threshold});
                b = chance.natural({min: 0, max: threshold});
                resolve('rgb('+ r +','+ g +','+ b +')');
            }
            resolve(chance.color({format:format}));
        });
    };

    /*
    * Returns a paragraph of fake text surrounded in `<p>` tags
    * @amount: number of paragraphs (default is 1)
    */
    this.paragraph = function(amount) {
        amount = amount || 1;
        var paragraphs = "";
        return new Promise(function(resolve, reject) {
            for(var i=0; i<amount; i++){
                paragraphs += '<p>'+chance.paragraph()+'</p>';
            }
            resolve(paragraphs);
        });
    };

    /*
    * Returns a sentence of fake text.
    * @wordCount: number of words in the sentence (default is 5)
    */
    this.sentence = function(wordCount) {
        wordCount = wordCount || 5;
        return new Promise(function(resolve, reject) {
            resolve(chance.sentence({words: wordCount}));
        });
    };

    /*
    * Returns a word of fake text
    * @amount: number of words (default is 1)
    */
    this.word = function(amount) {
        amount = amount || 1;
        var words = "";
        return new Promise(function(resolve, reject) {
            for(var i=0; i<amount; i++){
                words += chance.word()+" ";
            }
            resolve(words);
        });
    };

    /*
    * Returns a random Date string in the specified format.
    */
    this.date = function() {
        return new Promise(function(resolve, reject) {
          resolve(moment(chance.date()).format("MMMM DD, YYYY"));
        })
    };

    /*
    * Accepts either a single integer or range string
    * in either of these formats: '3' or '0-3'.
    * Returns a random value within the range.
    */
    this.getRepititions = function(val) {
        var repeatCount, repititions;

        repeatCount = val.split('-');

        if (repeatCount.length === 1){
          repititions = repeatCount;
        }
        else if (repeatCount.length > 1){
          repititions = chance.natural({min: +repeatCount[0], max: +repeatCount[1]});
        }

        return repititions;
    };

    // March through the provided data and execute macros
    this.process = function(data) {
        var funcString;
        var self = this;

        return new Promise(function(resolve, reject){
          var promises = {};

          var queue = traverse(data, function(value, next){
            var key, parent, path, matches, matchlen;

            if (typeof value === "string"){

              // does the string contain any substitution strings
              // with the "special prefix"?
              matches = value.match(/(\{\{[^\{]+\}\})/g);

              if (matches){
                matchlen = matches.length;
                parent = this.parent;
                key = this.key;
                path = this.path.join(".");

                // process each match
                for (var n=0; n<matchlen; n++){
                  var idx = n;
                  funcString = matches[n].slice(2, -2);

                  // executes the macro string as a function in the context of this node
                  this.node = eval('self.'+funcString);

                  // remember the unresolved Promises.
                  // Then, start removing them as they resolve...
                  promises[path] = this.node.then(function(value) {
                    parent[key] = parent[key].replace(matches[idx], value);
                    delete promises[path];
                    if (Object.keys(promises).length === 0) {
                      // We're done substituting the data
                      resolve(data);
                    }
                  }, function(err) {
                      // An error occurred in a Promise
                  });
                }
              }
            }

            return next();
          }, function(newObj) {
              // This gets called when the data doesn't contain any special replacement keys
              if (Object.keys(promises).length === 0) {
                resolve(data);
              }
              log.success("Done generating data");
          });

        });
    };

}

// export as a singleton
module.exports = exports = new DataGenerator();
