/**
 * @todo lodash in package.json
 */
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

		// merge config with defaults
		config = _.extend({}, defaults, config);

		// check project dir
		if (!fs.existsSync(config.projectDir)) {
			console.error('Project directory %s not specified or does not exist', config.projectDir);
			process.exit(1);
		}

		// configure/check target path
		config.targetPath = config.projectDir + '/target/' + targetNameFromPomXml( config.projectDir + '/' + config.pom );
		if (!fs.existsSync(config.targetPath)) {
			console.error('Target dir %s does not exist', config.targetRelPath);
			process.exit(1);
		}

		// configure/check brightspot base path
		config.brightspotBasePath = config.projectDir + '/' + config.brightSpotBaseRelPath + '/' + config.wwwroot;
		if (!fs.existsSync(config.brightspotBasePath)) {
			console.error('Target dir %s does not exist', config.brightspotBasePath);
			process.exit(1);
		}

		// server root looks for files in project first, then in brightspot base
		app.use( express.static(config.projectDir + '/' + config.wwwroot) );
		app.use( express.static(config.brightspotBasePath) );

		// assets/render/static looks for file in project first, then in target
		app.use( '/assets', express.static( config.projectDir + '/' + config.srcRelPath + '/assets') );
		app.use( '/assets', express.static( config.targetPath + '/assets') );
		app.use( '/render', express.static( config.projectDir + '/' + config.srcRelPath + '/render') );
		app.use( '/render', express.static( config.targetPath + '/render') );
		app.use( '/static', express.static( config.projectDir + '/' + config.srcRelPath + '/static') );
		app.use( '/static', express.static( config.targetPath + '/static') );

		// start the server
		app.listen(config.port, config.host, function() {
			console.log('BRIGHTSPOT FRONT END DEVELOPMENT SERVER');
			console.log('=======================================');
			console.log('Listening on %s:%s', config.host, config.port);
		});
	}
};