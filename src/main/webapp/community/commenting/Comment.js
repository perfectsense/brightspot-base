import $ from 'jquery';
import bspUtils from 'bsp-utils';

class Comment {
    constructor($context, options) {
        this.$context = $context;
        this.settings = $.extend({}, {
            selectors: {
                prefix: '.Comment'
            }
        }, options);
    }
}

export default bspUtils.plugin(false, 'bsp', 'community-comment', {
    '_each': function(item) {
        new Comment($(item), this.option(item));
    }
});
