import $ from 'jquery';
import bsp_utils from 'bsp-utils';

class GalleryGrid {
    constructor($el, options) {
        if (options.lowRes) {
            this.$el = $el;
            this.$grid = $el.find('.bsp-gallery-grid');
            this.$gallery = $el.find('.bsp-gallery-grid-gallery');
            this.addIndexes();
            this.addEvents();
        }
    }
    addIndexes() {
        var i = 0;
        this.$grid.find('.bsp-gallery-grid-thumb').each((key, thumb) => {
            var $thumb = $(thumb);
            $thumb.data('grid-index', i);
            i++;
        });
    }
    addEvents() {
        var self = this;
        this.$el.find('.bsp-gallery-grid-thumb').on('click', (e) => {
            self.thumbClickEvent( $(e.currentTarget) );
        });
        this.$gallery.find('a').on('click', (e) => {
            e.preventDefault();
        });
    }
    thumbClickEvent($thumb) {
        var carousel = this.$gallery.data('bsp_carousel');
        var index = $thumb.data('grid-index');
        carousel.goTo(index);
        this.hideGrid();
        this.showGallery();
    }
    hideGrid() {
        this.$el.removeClass('showing-grid');
        this.$grid.addClass('bsp-gallery-grid-hidden');
    }
    showGallery() {
        this.$gallery.removeClass('bsp-gallery-grid-hidden').addClass('bsp-gallery-grid-show');
    }
}

export default bsp_utils.plugin(false, 'bsp', 'gallery-grid', {
    '_each': function(item) {
        new GalleryGrid($(item), this.option(item));
    }
});
