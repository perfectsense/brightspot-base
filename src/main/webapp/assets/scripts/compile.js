/**
 *  This JS is what we will use to precompile our plugins. We will list our plugins here and they will become available to use
 */

define(function (require) {
	require('bsp-utils'); // bsp-utils is pulled in via bower and includes standard utils and the bsp-plugin
	
    // Plugins
    require('bsp-carousel-plugin');
    require('bsp-carousel-thumbnav-plugin');
    require('bsp-share');
    require('plugins/bsp-toggle');

    // This is the plugin that enables client side rendering of handlebar templates. This should be build into a styleguide.js, but we 
    // are not doign that quite yet
    require('bsp-template-plugin');
 });
