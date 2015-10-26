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
var url = require('url');
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
  var reqPath = req.path;

  hbsRenderer.registerPartials();

  if (req.query.iframe === 'true') {
    var filesPath = path.join(config.wwwroot, reqPath);

    if (!fs.statSync(filesPath).isDirectory()) {
      return res.end(404);
    }

    var files = [ ];

    fs.readdirSync(filesPath).forEach(function (file) {

      if (file.slice(0, 1) !== '_' && file.slice(-5) === '.json') {
        var data = hbsRenderer.getJSONData(path.join(filesPath, file).slice(config.wwwroot.length));

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

        files.push({
          name: file,
          data: convert(data)
        });
      }
    });

    var template = hbs.compile(hbsRenderer.getTemplateAsString('iframe.hbs'));

    return res.send(template({ files: files }));

  } else {
    var groups = [ ];

    fs.readdirSync(config.wwwroot).forEach(function (group) {
      if (group.slice(0, 1) !== '_') {
        var groupPath = path.join(config.wwwroot, group);

        if (fs.statSync(groupPath).isDirectory()) {
          var examples = [ ];

          fs.readdirSync(groupPath).forEach(function (example) {
            if (example.slice(0, 1) !== '_') {
              var examplePath = path.join(groupPath, example);

              if (fs.statSync(examplePath).isDirectory()) {
                examples.push({
                  name: example,
                  path: examplePath.slice(config.wwwroot.length)
                });
              }
            }
          });

          if (examples.length > 0) {
            groups.push({
              name: group,
              examples: examples
            });
          }
        }
      }
    });

    var template = hbs.compile(hbsRenderer.getTemplateAsString('main.hbs'));

    return res.send(template({ groups: groups }));
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
    app.use('/', function(req, res, next) {
      _prepareResponse(config, req, res, next);
    });

    // start the server
    app.listen(config.port, config.host, function() {
      console.log('Listening on %s:%s', config.host, config.port);
    });
  }
};
