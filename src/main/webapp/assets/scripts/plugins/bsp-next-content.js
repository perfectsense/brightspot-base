import $ from 'jquery';
import bsp_utils from 'bsp-utils';

class NextContent {
    constructor($el, options) {
        $el.on('click', (e) => {
            $.get(options.url).then((html) => {
                $el.replaceWith(html);
            });
            e.preventDefault();
        });
    }
}

export default bsp_utils.plugin(false, 'bsp', 'next-content', {
    '_each': function(item) {
        new NextContent($(item), this.option(item));
    }
});
