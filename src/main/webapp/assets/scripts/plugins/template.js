/*
 * Template test js
 *
 */
(function(globals, factory) {

    "use strict";

    define(['jquery','bsp-utils','bsp-templates'], factory);

})(this, function($, bsp_utils, bsp_templates, globals) {

    "use strict";

    var module = {
        init: function($el, options) {
            if (typeof options.template !== 'string' || typeof bsp_templates[options.template] !== 'function') {
                return;
            }
            if (typeof options.data === 'object') {
                $el.html( bsp_templates[options.template](options.data) );
            } else if (typeof options.dataUrl === 'string') {
                $.get(options.dataUrl).then(function(data) {
                    $el.html( bsp_templates[options.template](data));
                });
            } else {
                $el.html( bsp_templates[options.template]({}) );
            }
        }
    };

    return bsp_utils.plugin(globals, 'bsp', 'template', {
        '_each': function(item) {
            var options = this.option(item);
            var moduleInstance = Object.create(module);
            moduleInstance.init($(item), options);
        }
    });

});
