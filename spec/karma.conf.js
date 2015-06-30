module.exports = function(config) {
	var _ = require('lodash');
	var path = require('path');
	var projectRoot = path.resolve(__dirname, '../..');
	var scriptDir = projectRoot + '/src/main/webapp/assets/scripts';
	
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
				paths: {
					'babel': '/base/node_modules/babel-core/browser.js',
					'jquery': '/base/bower_components/jquery/dist/jquery.js',
					'bsp-utils': '/base/bower_components/bsp-utils/bsp-utils.js'
				},
				transpiler: 'babel'
			},
			files: [
				'node_modules/babel-core/browser.js',
				'bower_components/jquery/dist/jquery.js',
				'bower_components/bsp-utils/bsp-utils.js',
				'src/main/webapp/assets/scripts/!(main).js',
				'src/main/webapp/assets/scripts/**/*.js',
				'spec/**/*.js'
			]
		}
	});
};