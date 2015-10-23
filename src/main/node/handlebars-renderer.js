function HandlebarsRenderer() {

  var Promise = global.Promise || require('promise');
  var log = require('./logger');
  var fs = require('fs');
  var path = require('path');
  var hbs = require('handlebars');
  var _ = require('cloneextend');
  var recursiveReadSync = require('recursive-readdir-sync');
  var templateRoot = path.join(__dirname, '../webapp/');
  var dataRoot = path.join(__dirname, '../../../styleguide');
  var Chance = require('chance');
  var chance = new Chance();
  var extend = require('extend');
  var dataGenerator = require('./data-generator');
  var self = this;
  var config = null;

  // Returns the JSON data given a file's uri using our precedence/fallback logic
  this.getJSONData = function(uri) {
    var self = this;

    return new Promise(function(resolve, reject) {
        var rootPath;
        var len = self.config.dataPaths.length;

        // If the first path in the template paths isn't found,
        // then fallback on the next and so on.
        for (var n=0; n<len; n++){
            rootPath = self.config.dataPaths[n];
            try {
                resolve(JSON.parse(fs.readFileSync(path.join(rootPath, uri), "utf8")));
                break;
            } catch (ex) {
                //log.error("Couldn't find because ("+ex+"), for ["+rootPath+uri+"]. Falling back on next file...");
            }
        };
    });
  }

  // Returns the template string given a file's uri using our precedence/fallback logic
  this.getTemplateAsString = function(uri) {
    var self = this;

    return new Promise(function(resolve, reject) {
        var rootPath;
        var len = self.config.templatePaths.length;

        // If the first path in the template paths isn't found,
        // then fallback on the next and so on.
        for (var n=0; n<len; n++){
            rootPath = self.config.templatePaths[n];
            try {
                resolve(fs.readFileSync(path.join(rootPath, uri), "utf8"));
                break;
            } catch (ex) {
                //log.error("Couldn't find because ("+ex+"), for ["+rootPath+uri+"]. Falling back on next file...");
            }
        };
    });
  }

  // Creates and returns the entire JSON view-model when provided an entrypoint JSON structure.
  this.createViewModel = function(theObject, theKey) {
    var theKey = theKey || '_dataUrl';
    var partialJSON;
    function recursiveSearch(theObject, parent) {
      // visits each key within the context of the search
      for (var key in theObject){
        // if the current node itself is an object, then we need to visit it's child nodes
        if (typeof theObject[key] == "object" && theObject[key] !== null) {
          recursiveSearch(theObject[key], theObject);
        }
        // otherwise, does one of the leaf keys in this object match our special key?
        else {
          if(theObject[theKey]) {
            console.log('assembling view-model with: ', theObject[theKey]);
            // read the data file from disk
            self.getJSONData(theObject[theKey])
                .then(function(partialJSON){
                    // remove the leaf since we don't want to shoot ourselves in the foot and process it in the future
                    delete theObject[theKey];
                    // merge the data using 'add', which allows us to prevent predefined leaf nodes
                    // from being overwritten by the merged data.
                    _.add(theObject, partialJSON);
                    // continue on
                    recursiveSearch(theObject, parent);
                });
          }
          // if the special key wasn't found, check for a "_repeat" key
          else if (theObject['_repeat']) {
            var insertionIndex = parent.indexOf(theObject);
            repititions = dataGenerator.getRepititions(theObject['_repeat']);
            if (repititions > 1){
              repititions--;
              delete theObject['_repeat'];
              for (var n=0; n<repititions; n++){
                parent.splice(insertionIndex, 0, _.clone(theObject));
              }
            }
            // when reptititions are "0", remove the object from its parent
            else if (repititions <= 0){
              parent.splice(insertionIndex, 1);
            }
          }
        }
      }
    }

    // let's do it!
    recursiveSearch(theObject, null);
    console.log('-----------------');
    // all done
    return theObject;
  }

  /*
  * This convenience method registers all the partials into Handlebars found under the provided paths.
  * It does so by recursively reading each file from disk and then processing it's filepath to normalize
  * it for the Handlebars registry.
   */
  this.registerPartials = function() {
    var filepaths, partialCount = 0;
    var len = this.config.templatePaths.length;

    /*
    * Looping backwards through the template filepaths is important
    * because it allows us to ask HBS to register overtop existing partials
    * which preserves the file precedence for overrides.
     */
    for (var i=len; i-- > 0;){
        try {
          filepaths = recursiveReadSync(this.config.templatePaths[i]);
          filepaths.map(function(filepath){
            // get the portion of the filepath under the 'render'
            // strip off the leading slash
            // strip off the trailing extension (.hbs)
            var name = filepath.split('render')[1].split(/\/(.*)$/)[1].split('.hbs')[0];
            // get the portion of the filepath rooted at the 'render'
            var relPath = filepath.substr(filepath.lastIndexOf('render'))
            // register this partial with Handlebars
            hbs.registerPartial(name, fs.readFileSync(filepath, "utf8"));
            partialCount++;
            return {"name": name, "relPath": relPath};
          });
        } catch(err){
            log.error('Path does not exist');
        }
    }

    if (partialCount){
      log.success('Registered: '+ partialCount +' Partials');
    }
  }

  this.init = function(config){
    this.config = config;

    // Handles rendering of partials ("_template" strings)
    hbs.registerHelper('render', function(context, fullScope) {
      context = extend(true, context, fullScope.hash);
      var partial = hbs.partials[context['_template']];
      var template = hbs.compile(partial);
      var hydrated = template(context);
      return new hbs.SafeString(hydrated);
    });

    this.registerPartials();
  }

}

// export as a singleton
module.exports = exports = new HandlebarsRenderer();
