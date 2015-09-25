/**
 * TODO: Move to brighspot-js-carousel
 */
import $ from 'jquery';
import bsp_carousel from 'bsp-carousel-thumbnav';
import historyAPI from 'native.history';

export default {

    // defaults for full screen gallery. Options can be passed in through HTML
    defaults : {

        nav: {
            themeConfig: {
                centerMode: true,
                centerPadding: '0px',
                focusOnSelect: true,
                slidesToShow: 8,
                slidesToScroll: 1
            }
        },

        stage: {
            themeConfig: {
                arrows: true
            }
        }

    },

    init($el, options) {
        var self = this;

        self.$el = $el;
        self.options = $.extend(self.defaults, options);

        self.saveElements();
        self.buildCarousel();
        self.addThumbCaptionClicks();

        // if we are dynamic we want to remove the thumbs, which includes the counter inside
        if(self.options.dynamicSlideLoad) {
            self.$el.find('.bsp-carousel-gallery-thumbs').remove();
            self._manageHistory();
        } else {
            self.createCounter();
        }
    },

    _manageHistory() {
        var self = this;

        self.$carousel.on('carousel:init carousel:afterChange', () => {
            var currentSlide = self.carousel.stage.$el[0].slick.$slides[self.carousel.stage.currentSlide()];
            var url = $(currentSlide).find('[data-url]').attr('data-url');

            if(url) {
                History.replaceState({},'',url);
            }
        });
    },

    saveElements() {
        var self = this;

        self.$counter = this.$el.find('.bsp-carousel-gallery-count');
        self.$carousel = this.$el.find('.bsp-carousel-gallery');
    },

    buildCarousel() {
        var self = this;

        self.carousel = Object.create(bsp_carousel);

        self.carousel.init(self.$carousel, self.options);
    },

    addThumbCaptionClicks() {
        var self = this;

        self.$el.find('.bsp-carousel-gallery-thumbs').on('click', function() {
            self.$el.removeClass('captions-visible');
            self.$el.toggleClass('thumbs-visible');
            return false;
        });

        self.$el.find('.bsp-carousel-gallery-caption-trigger').on('click', function() {
            self.$el.removeClass('thumbs-visible');
            self.$el.toggleClass('captions-visible');
            return false;
        });
    },

    createCounter() {
        var self = this;

        this.$carousel.on('carousel:init carousel:afterChange', () => {
            self.$counter.html((self.carousel.stage.currentSlide()+1) + ' of ' + self.carousel.stage.slideCount());
        });
    }

};
