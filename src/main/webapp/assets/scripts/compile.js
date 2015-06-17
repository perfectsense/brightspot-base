/**
 *  This JS is what we will use to precompile our plugins. We will list our plugins here and they will become available to use
 */

define(function (require) {
	require('bsp-utils'); // bsp-utils is pulled in via bower and includes standard utils and the bsp-plugin
	
    // Plugins
    require('bsp-carousel-plugin');
    require('bsp-carousel-thumbnav-plugin');
    require('bsp-share');
    require('bsp-template-plugin');

    // test including handlebars partials
    require('plugins/require-template-test');
    require('bsp-templates-partials');
 });
