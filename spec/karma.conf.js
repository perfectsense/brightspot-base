module.exports = function(config) {
	var _ = require('lodash');
	var path = require('path');
	var projectRoot = path.resolve(__dirname, '../..');
	var scriptDir = projectRoot + '/src/main/webapp/assets/scripts';
	var files = [];
	var paths = {
		'babel': '/base/node_modules/bsp-grunt/lib/browser.js',
		'jquery': '/base/bower_components/jquery/dist/jquery.js',
		'bsp-utils': '/base/bower_components/bsp-utils/bsp-utils.js'
	};
	_.map(paths, function(val) {
		files.push(val.replace(/^\/base\//, ''));
	});
	files.push('src/main/webapp/assets/scripts/!(main).js');
	files.push('src/main/webapp/assets/scripts/**/*.js');
	files.push('spec/unit/**/*.js');

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
			files: files
		}
	});
};