/** @todo: move to external repo */
import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import TableSort from './bsp-table-sort';

export default bsp_utils.plugin(false, 'bsp', 'table-sort', {
    '_each': function(item) {
        new TableSort($(item), this.option(item));
    }
});