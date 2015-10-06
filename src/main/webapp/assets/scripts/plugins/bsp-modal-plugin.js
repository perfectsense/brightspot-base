/**
 *  TODO: Create a bsp-modal repo and move this
 */
import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_modal from './bsp-modal';

export default bsp_utils.plugin(false, 'bsp', 'modal', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_modal);
        moduleInstance.init($(item), options);
    }
});
