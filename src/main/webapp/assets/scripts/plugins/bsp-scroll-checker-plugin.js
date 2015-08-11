/** @todo move to bsp-scroll-checker repo */
import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_scroll_checker from './bsp-scroll-checker';

export default bsp_utils.plugin(false, 'bsp', 'scroll-checker', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_scroll_checker);
        moduleInstance.init($(item), options);
    }
});