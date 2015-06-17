/**
 *  This JS kicks off our application. It defines the require config, and kicks off the loading of the plugins
 */
require.config({
    paths: {
    	'handlebars': 'bower/handlebars',
    	'bsp-template-plugin': 'bower/bsp-template-plugin'
    },
    shim: {
    },
    // wraps everything we compile in a closure
    wrap: true
});


require(['compile'], function() {
    // our best practices have our JS executing via the bsp-plugin pattern instead of being executed here
});
