/*
 * Template test js
 *
 */
import Handlebars from 'bower/handlebars';
import $ from 'jquery';
import { bsp_utils } from 'bsp-utils';

var module = {
    init: function($el, options) {
        $.get('/render/test.hbs').then(function(template) {
            $el.html(Handlebars.compile(template)({
                testVar: 'testVarValue'
            }));
        });
    }
};

export default bsp_utils.plugin(false, 'bsp', 'require-template-test', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(module);
        moduleInstance.init($(item), options);
    }
});