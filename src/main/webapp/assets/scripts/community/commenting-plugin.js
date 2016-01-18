import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import Commenting from './commenting';

export default bsp_utils.plugin(false, 'bsp', 'commenting', {
    '_each': function(item) {
        var options = this.option(item);
        new Commenting($(item), options);
    }
});
