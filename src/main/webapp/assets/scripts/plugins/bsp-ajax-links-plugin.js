/** @todo move to bsp-scroll-checker repo */
import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_ajax_links from './bsp-ajax-links';

export default bsp_utils.plugin(false, 'bsp', 'ajax-links', {

    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_ajax_links);
        moduleInstance.init($(item), options);
    }

});
