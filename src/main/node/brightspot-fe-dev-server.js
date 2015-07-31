var _ = require('lodash');
var express = require('express');
var fs = require('fs');
var parser = require('xml2json');
var path = require('path');
var targetNameFromPomXml = function(file) {
	var xml = parser.toJson( fs.readFileSync(file), { object: true } );
	return xml.project.artifactId + '-' + xml.project.version;
};
var defaults = {
	brightSpotBaseRelPath: 'node_modules/brightspot-base',
	pom: 'pom.xml',
	wwwroot: 'styleguide',
	srcRelPath: 'src/main/webapp',
	host: 'localhost',
	port: 3000
};
module.exports = {
	listen: function(config) {
		var app = express();
		var target;

		console.log('BRIGHTSPOT FRONT END DEVELOPMENT SERVER');
		console.log('=======================================');

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

		// assets/render looks for file in project first, then in target
		var serverPaths = [
			{ '/assets': config.projectDir + '/' + config.srcRelPath + '/assets' },
			{ '/assets': config.targetPath + '/assets' },
			{ '/assets': config.projectDir + '/' + config.brightSpotBaseRelPath  + '/' + config.srcRelPath + '/assets' },
			{ '/render': config.projectDir + '/' + config.srcRelPath + '/render' },
			{ '/render': config.targetPath + '/render' },
			{ '/render': config.projectDir + '/' + config.brightSpotBaseRelPath  + '/' + config.srcRelPath + '/render' }
		];
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

		// start the server
		app.listen(config.port, config.host, function() {
			console.log('Listening on %s:%s', config.host, config.port);
		});
	}
};