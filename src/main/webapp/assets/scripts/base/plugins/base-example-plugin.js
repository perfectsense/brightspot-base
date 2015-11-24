import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_example from './base-example';

export default bsp_utils.plugin(false, 'base', 'example', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_example);
        moduleInstance.init($(item), options);
    }
});
