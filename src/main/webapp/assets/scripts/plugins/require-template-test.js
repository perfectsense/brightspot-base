/*
 * Template test js
 *
 */
(function(globals, factory) {

    "use strict";

    define(['jquery','bsp-utils','templates/test'], factory);

})(this, function($, bsp_utils, template, globals) {

    "use strict";

    var module = {
        init: function($el, options) {
			$el.html(template({
				testVar: 'testVarValue'
			}));
        }
    };

    return bsp_utils.plugin(globals, 'bsp', 'require-template-test', {
        '_each': function(item) {
            var options = this.option(item);
            var moduleInstance = Object.create(module);
            moduleInstance.init($(item), options);
        }
    });

});
