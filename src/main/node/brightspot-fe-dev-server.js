/**
 * Brightspot front end development server 
 */
var fs = require('fs');
var parser = require('xml2json');
var express = require('express');
var app = express();

var checkDirExists = function(dir) {
	if (!fs.existsSync(dir)) {
		console.error('Directory %s not found', dir);
		process.exit(1);
	}
	return true;
};
var checkFileExists = function(file) {
	if (!fs.existsSync(file)) {
		console.error('File %s not found', file);
		process.exit(1);
	}
	return true;
};
var targetNameFromPomXml = function(file) {
	var xml = parser.toJson( fs.readFileSync(file), { object: true } );
	return xml.project.artifactId + '-' + xml.project.version;
};

module.exports = {
	listen: function(config) {
		var pomFile = config.projectDir + '/pom.xml';
		var targetName = targetNameFromPomXml(pomFile);
		var targetDir = config.projectDir + '/target/' + targetName;
		var host = 'localhost';
		var port = 3000;
		var srcRelPath = 'src/main/webapp';
		var projectSrcDir = config.projectDir + '/' + srcRelPath;
		var projectServerRoot = config.projectDir + '/styleguide';
		var brightspotBaseServerRoot = config.projectDir + '/node_modules/brightspot-base';

		checkDirExists(config.projectDir);
		checkFileExists(pomFile);
		checkDirExists(targetDir);
		checkDirExists(projectSrcDir);
		checkDirExists(projectServerRoot);

		if (typeof config.port === 'number') {
			port = config.port;
		}
		if (typeof config.host === 'string') {
			host = config.host;
		}

		/**
		 * Look in the src for files under /assets or /render first.
		 * If found, serve from there. If not, look in target and serve
		 * from there if found. If not found there, serve a 404.
		 */
		app.get(/^\/(assets|render)\/(.*)$/, function(req, res, next) {
			var fileRelPath = req.params[0] + '/' + req.params[1];
			var projectFile = projectSrcDir + '/' + fileRelPath;
			var targetFile = targetDir + '/' + fileRelPath;
			if (fs.existsSync(projectFile))
			{
				console.log('Serving project file: ', projectFile);
				res.send( fs.readFileSync(projectFile) );
			}
			else if (fs.existsSync(targetFile))
			{
				console.log('Serving target file: ', targetFile);
				res.send( fs.readFileSync(targetFile) );
			}
			else
			{
				res.sendStatus(404);
			}
		});

		/**
		 * @todo should set this up to serve Brightspot Base styleguide files
		 * if local styleguide files not found
		 */
		app.use( express.static(projectServerRoot) );

		app.listen(port, host, function() {
			console.log('BRIGHTSPOT FRONT END DEVELOPMENT SERVER');
			console.log('=======================================');
			console.log('Listening on %s:%s', host, port);
		});
	}
};