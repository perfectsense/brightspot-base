/* jshint ignore:start */
document.write('<link rel="stylesheet/less" type="text/css" href="/assets/styles/main.less" />');
document.write('<link rel="stylesheet/less" type="text/css" href="/styleguide.less" />');
document.write('<script src="/assets/scripts/less.js"></script>');
document.write('<script src="/assets/scripts/system.js"></script>');
document.write('<script src="/assets/scripts/config.js"></script>');

document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');

/* jshint ignore:end */

document.addEventListener("DOMContentLoaded", function(event) {
	System.config({ baseURL: '/assets/scripts' });
	System.import('main');
	System.import('bsp-template-plugin');
});