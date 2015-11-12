import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_scroll_checker from './base-scroll-checker';

export default bsp_utils.plugin(false, 'base', 'scroll-checker', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_scroll_checker);
        moduleInstance.init($(item), options);
    }
});
