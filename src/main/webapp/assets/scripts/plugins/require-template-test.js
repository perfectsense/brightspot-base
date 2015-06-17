/*
 * Template test js
 *
 */
(function(globals, factory) {

    "use strict";

    define(['jquery','bsp-utils','handlebars'], factory);

})(this, function($, bsp_utils, Handlebars, globals) {

    "use strict";

    var module = {
        init: function($el, options) {
            $.get('/render/test.hbs').then(function(template) {
                $el.html(Handlebars.compile(template)({
                    testVar: 'testVarValue'
                }));
            });
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
