import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_toggle_item from './bsp-toggle-item';

export default bsp_utils.plugin(false, 'bsp', 'toggle-item', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_toggle_item);
        moduleInstance.init($(item), options);
    }
});