/* jshint ignore:start */

// we use compiled CSS by default. If you'd like to switch to using browser compiled .less
// run localStorage.setItem('useLESS',true); in your console
if(localStorage.getItem('useLESS')) {

	// our non compiled main LESS
	document.write('<link rel="stylesheet/less" type="text/css" href="/assets/styles/main.less" />');
	document.write('<script src="/assets/scripts/less.js"></script>');

	// styleguide CSS overrides
	document.write('<link rel="stylesheet" type="text/css" href="/styleguide.css" />');

} else {
	// our compiled CSS copied over from target via Grunt task
	document.write('<link rel="stylesheet" type="text/css" href="/assets/styles/main.min.css" />');

	// styleguide CSS overrides
	document.write('<link rel="stylesheet" type="text/css" href="/styleguide.css" />');
}

// we use compiled JS by default. If you'd like to switch to using browser compiled .js using systemJS
// run localStorage.setItem('useSystemJS',true); in your console
if(localStorage.getItem('useSystemJS')) {

	document.write('<script src="/assets/scripts/system.js"></script>');
	document.write('<script src="/assets/scripts/config.js"></script>');

	document.addEventListener("DOMContentLoaded", function(event) {
		System.config({ baseURL: '/assets/scripts' });
		System.import('main');
		System.import('bsp-template-plugin');
	});

} else {
	document.write('<script src="/assets/scripts/main.min.js"></script>');
}
/* jshint ignore:end */



