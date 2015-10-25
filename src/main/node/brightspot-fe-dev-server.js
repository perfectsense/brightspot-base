var Promise = global.Promise || require('promise');
var log = require('./logger');
var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var cors = require('cors');
var favicon = require('serve-favicon');
var hbs = require('handlebars');
var parser = require('xml2json');
var path = require('path');
var hbsRenderer = require('./handlebars-renderer');
var DataGenerator = require('./data-generator');
var traverse = require('traverse');
var serverConfig;

var defaults = {
  brightSpotBaseRelPath: 'node_modules/brightspot-base',
  pom: 'pom.xml',
  wwwroot: 'styleguide',
  srcRelPath: 'src/main/webapp',
  host: 'localhost',
  port: 3000
};

function Template() {
}

Template.prototype.toHTML = function () {
  var partial = hbs.partials[this._template];
  var template = hbs.compile(partial);

  return template(this);
};

var targetNameFromPomXml = function(file) {
  var xml = parser.toJson( fs.readFileSync(file), { object: true } );
  return xml.project.artifactId + '-' + xml.project.version;
};

var _prepareResponse = function(config, req, res, next) {
  var dataFileUri;

  // if the originalUrl ends with a "/" then default to loading the "index.json" file.
  // eg: localhost:3000/pages/example/
  if (req.originalUrl.slice(-1) === '/'){
    dataFileUri = req.originalUrl + 'index.json';
  }
  // if the request has an ".html" extension then just return the response with no additional processing
  else if (req.originalUrl.slice(-5) === '.html') {
    next();
  }
  // otherwise, assume the user wants a data file and just append the ".json" extension
  else {
    dataFileUri = req.baseUrl + '.json';
  }

  // First, get the entrypoint template as a string
  hbsRenderer.registerPartials();

  if (req.query.iframe === 'true') {
    var data = hbsRenderer.getJSONData(dataFileUri);

    traverse(data).forEach(function (value) {
      var dataUrl = value._dataUrl;

      if (dataUrl) {
        this.update(hbsRenderer.getJSONData(dataUrl));
      }
    });

    new DataGenerator(Math.floor(Math.random() * 1000)).process(data);

    function convert(data) {
      if (typeof data === 'object') {
        if (Array.isArray(data)) {
          return data.map(function (item) {
            return convert(item);
          });

        } else {
          var copy = data._template ? new Template() : {};

          Object.keys(data).forEach(function (key) {
            copy[key] = convert(data[key]);
          });

          return copy;
        }
      }

      return data;
    }

    var template = hbs.compile(hbsRenderer.getTemplateAsString('iframe.hbs'));

    return res.send(template(convert(data)));

  } else {
    var template = hbs.compile(hbsRenderer.getTemplateAsString('main.hbs'));
    var paths = [ ];

    function addPaths(prefix) {
      fs.readdirSync(prefix).forEach(function (file) {
        var p = path.join(prefix, file);
        var stat = fs.lstatSync(p);

        if (stat.isDirectory()) {
          addPaths(p);

        } else if (p.slice(-5) === '.json') {
          paths.push(p.slice(config.wwwroot.length, -5));
        }
      });
    }

    addPaths(config.wwwroot);

    return res.send(template({ 'paths': paths }));
  }
};

module.exports = {
  listen: function(config) {
    var app = express();
    var target;

    log.welcome();

    app.set('env', 'development');
    app.use(cors());

    // merge config with defaults
    config = _.extend({}, defaults, config);

    // check project dir
    if (!fs.existsSync(config.projectDir)) {
      console.error('ERROR: Project directory %s not specified or does not exist', config.projectDir);
      process.exit(1);
    }

    // configure/check target path
    config.targetPath = config.projectDir + '/target/' + targetNameFromPomXml( config.projectDir + '/' + config.pom );
    if (!fs.existsSync(config.targetPath)) {
      console.error('ERROR: Target dir %s does not exist', config.targetRelPath);
      process.exit(1);
    }

    // configure/check brightspot base path
    config.brightspotBasePath = config.projectDir + '/' + config.brightSpotBaseRelPath + '/' + config.wwwroot;
    if (!fs.existsSync(config.brightspotBasePath)) {
      console.error('WARNING: Brightspot Base dir %s does not exist', config.brightspotBasePath);
    }

    // configure/check project server root
    config.projectServerRoot = config.projectDir + '/' + config.wwwroot;
    if (!fs.existsSync(config.projectServerRoot)) {
      console.error('ERROR: Styleguide dir %s does not exist', config.projectServerRoot);
      process.exit(1);
    }

    // server root looks for files in project first, then in brightspot base
    if (fs.existsSync(config.projectServerRoot)) {
      app.use( express.static(config.projectServerRoot) );
      console.log('Serving / from %s', config.projectServerRoot);
    } else {
      console.log('WARNING: Path %s does not exist', config.projectServerRoot);
    }

    if (fs.existsSync(config.brightspotBasePath)) {
      app.use( express.static(config.brightspotBasePath) );
      console.log('Serving / from %s', config.brightspotBasePath);
    } else {
      console.log('WARNING: Path %s does not exist', config.brightspotBasePath);
    }

    log.success(config.projectDir);
    log.success(config.targetPath);
    log.success(config.brightspotBasePath);
    log.success(config.projectServerRoot);
    log.success(config.srcRelPath);

    // TemplatePaths are a list of relative paths to template directories.
    // Order matters; where the first item has the highest precedence for the application to serve from
    config.templatePaths = [
      config.projectDir + '/' + config.srcRelPath + '/render',
      config.targetPath + '/render',
      config.projectDir + '/' + config.brightSpotBaseRelPath  + '/' + config.srcRelPath + '/render'
    ];

    // DataPaths are a list of relative paths to data/json directories
    // Order matters; where the first item has the highest precedence for the application to serve from
    config.dataPaths = [
      config.projectServerRoot,
      config.projectDir + '/' + config.brightSpotBaseRelPath + '/' + config.wwwroot
    ];

    // assets/render looks for file in project first, then in target
    var serverPaths = [
      { '/assets': config.projectDir + '/' + config.srcRelPath + '/assets' },
      { '/assets': config.targetPath + '/assets' },
      { '/assets': config.projectDir + '/' + config.brightSpotBaseRelPath  + '/' + config.srcRelPath + '/assets' },
      { '/render': config.projectDir + '/' + config.srcRelPath + '/render' },
      { '/render': config.targetPath + '/render' },
      { '/render': config.projectDir + '/' + config.brightSpotBaseRelPath  + '/' + config.srcRelPath + '/render' }
    ];

    // define all the static paths to serve from
    _.forEach(serverPaths, function(value) {
      _.forEach(value, function(localPath, serverPath) {
        if (fs.existsSync(localPath)) {
          console.log('Serving %s from %s', serverPath, localPath);
          app.use( serverPath, express.static(localPath) );
        } else {
          console.log('WARNING: Path %s does not exist', localPath);
        }
      });
    });

    // Init the server-side template renderer
    hbsRenderer.init(config);

    // serves the Favicon
    //app.use(favicon(config.projectDir + '/' + config.srcRelPath + '/assets/images/favicon.ico'));

    app.use(require('./placeholder-image')());

    // After app.use() is configured above for the static asset paths from the filesystem,
    // we can handle all other requests and pass them through our custom middleware which renders the HBS templates.
    app.use('*', function(req, res, next) {
      _prepareResponse(config, req, res, next);
    });

    // start the server
    app.listen(config.port, config.host, function() {
      console.log('Listening on %s:%s', config.host, config.port);
    });
  }
};
