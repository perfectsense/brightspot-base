import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_infinite_scroll from './bsp-infinite-scroll';

export default bsp_utils.plugin(false, 'bsp', 'infinite-scroll', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_infinite_scroll);
        moduleInstance.init($(item), options);
    }
});