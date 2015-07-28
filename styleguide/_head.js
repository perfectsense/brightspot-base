/* jshint ignore:start */
document.write('<link rel="stylesheet/less" type="text/css" href="/assets/styles/main.less" />');
document.write('<script src="/assets/scripts/less.js"></script>');
document.write('<script src="/assets/scripts/system.js"></script>');
document.write('<script src="/assets/scripts/config.js"></script>');
/* jshint ignore:end */

document.addEventListener("DOMContentLoaded", function(event) {
	System.config({ baseURL: '/assets/scripts' });
	System.import('main');
	System.import('bsp-template-plugin');
});