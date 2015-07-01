/** @todo move to bsp-carousel repo */
import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_carousel_gallery from './bsp-carousel-gallery';

export default bsp_utils.plugin(false, 'bsp', 'carousel-gallery', {
    '_each': function(item) {
        var options = this.option(item);
        var moduleInstance = Object.create(bsp_carousel_gallery);
        moduleInstance.init($(item), options);
    }
});