function HandlebarsRenderer() {

  var log = require('./logger');
  var fs = require('fs');
  var path = require('path');
  var hbs = require('handlebars');
  var recursiveReadSync = require('recursive-readdir-sync');
  var extend = require('extend');

  // Returns the JSON data given a file's uri using our precedence/fallback logic
  this.getJSONData = function(uri) {
    var rootPath;
    var len = this.config.dataPaths.length;

    // If the first path in the template paths isn't found,
    // then fallback on the next and so on.
    for (var n=0; n<len; n++){
      rootPath = this.config.dataPaths[n];
      try {
        return JSON.parse(fs.readFileSync(path.join(rootPath, uri), "utf8"));
      } catch (ex) {
        //log.error("Couldn't find because ("+ex+"), for ["+rootPath+uri+"]. Falling back on next file...");
      }
    }

    throw new Error(uri + " doesn't exist!");
  };

  // Returns the template string given a file's uri using our precedence/fallback logic
  this.getTemplateAsString = function(uri) {
    var rootPath;
    var len = this.config.templatePaths.length;

    // If the first path in the template paths isn't found,
    // then fallback on the next and so on.
    for (var n=0; n<len; n++){
      rootPath = this.config.templatePaths[n];
      try {
        return fs.readFileSync(path.join(rootPath, uri), "utf8");
      } catch (ex) {
        //log.error("Couldn't find because ("+ex+"), for ["+rootPath+uri+"]. Falling back on next file...");
      }
    }

    throw new Error(uri + " doesn't exist!");
  };

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
      if (!context) {
        return '';
      }

      if (typeof context !== 'object') {
        return context.toString();
      }

      context = extend(true, context, fullScope.hash);
      var partial = hbs.partials[context['_template']];
      var template = hbs.compile(partial);
      var hydrated = template(context);
      return new hbs.SafeString(hydrated);
    });
  }

}

// export as a singleton
module.exports = exports = new HandlebarsRenderer();
