module.exports = function(config) {
	var _ = require('lodash');
	
	/**
	 * Systemjs needs paths resolved, Karma needs
	 * a list of files loaded. Load order matters to
	 * SystemJS. So we share that config here.
	 */
	var files = [];
	var nodeDir = '/base/node_modules';
	var bowerDir = '/base/bower_components';
	var paths = {
		'babel': nodeDir + '/bsp-grunt/lib/browser.js',
		'jquery': bowerDir + '/jquery/dist/jquery.js',
		'bsp-utils': bowerDir + '/bsp-utils/bsp-utils.js'
	};
	_.map(paths, function(val) {
		files.push(val.replace(/^\/base\//, ''));
	});

	config.set({
		autoWatch: true,
		basePath: '..',
		browsers: ['PhantomJS'],
		captureConsole: true,
		files: [],
		frameworks: ['systemjs','jasmine'],
		plugins: [
			require('karma-jasmine'),
			require('karma-phantomjs-launcher'),
			require('karma-systemjs')
		],
		systemjs: {
			configFile: 'src/main/webapp/assets/scripts/config.js',
			config: {
				paths: paths,
				transpiler: 'babel'
			},
			files: files.concat([
				'src/main/webapp/assets/scripts/!(main).js',
				'src/main/webapp/assets/scripts/**/*.js',
				'spec/unit/**/*.js'
			])
		}
	});
};