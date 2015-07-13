import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_infinite_content from './bsp-infinite-content';

export default bsp_utils.plugin(false, 'bsp', 'infinite-content', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_infinite_content);
        moduleInstance.init($(item), options);
    }
});