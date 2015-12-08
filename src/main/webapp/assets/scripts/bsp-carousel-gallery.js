/* Moved this inside this repo temporarily to develop deep linking for bsp-carousel-gallery. Will move back/version once it's ready */

import $ from 'jquery';
import bsp_carousel_thumbnav from 'bsp-carousel-thumbnav';
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
            deepLinkId : 'slide-',
            deepLinking : true,
            interstitials: true,
            interstitialClass: 'interstitial',
            themeConfig: {
                arrows: true
            }
        }

    },

    init($el, options) {
        var self = this;

        self.$el = $el;
        self.options = $.extend(true, self.defaults, options);

        self.saveElements();
        self.buildCarousel();

        self.carousel.$stage[0].focus();

        self.addThumbCaptionClicks();
        self.addInterstitials();

        // This is the default behavior for a full carousel that also has dynamic slides
        // we want to manage the history so we replace the browser URL with the URL of the slide itself
        // we also want to remove the thumbs, as it get unwieldly having a possible million thumbnails
        // we can change this behavior to allow for more options or configurations if we need to later
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

        self.carousel = Object.create(bsp_carousel_thumbnav);

        // if there is no nav in the DOM, disable it to make sure not to cause JS errors
        if(self.$el.find('.bsp-carousel-nav').length === 0) {
            self.options.nav = 'disable';
        }

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

    addInterstitials() {
        var self = this;
        var stage = self.carousel.stage;

        stage.bind('carousel:beforeChange', (e, carousel, currentSlide, nextSlide) => {
            if (stage.slideIsInterstitial(nextSlide)) {
                self.$el.addClass('interstitial-showing');
            } else {
                self.$el.removeClass('interstitial-showing');
            }
        });
        stage.bind('carousel:afterChange', (e, carousel, currentSlide) => {
            var currentAdjusted = self.carousel.stage.currentSlideAdjustedForInterstitials();
            var $current;
            var $interstitial;
            self.$el.find('.bsp-carousel-gallery-interstitial').each((key, interstitial) => {
                var destroy = $(interstitial).data('destroy');
                if (typeof destroy === 'function') {
                    destroy();
                }
            });
            if (currentAdjusted == 'interstitial') {
                $current = $(self.carousel.stage.$el[0].slick.$slides[currentSlide]);
                $interstitial = $current.find('.bsp-carousel-gallery-interstitial');
                var options = $interstitial.data().options;
                self.createInterstitial($interstitial, JSON.parse(options));
            }
        });
    },

    createInterstitial($el, options) {
        var self = this;
        var $counter = $el.find('.bsp-carousel-gallery-interstitial-counter');
        var $content = $el.find('.bsp-carousel-gallery-interstitial-content');
        var stage = this.carousel.stage;
        var counterInterval;
        var resizeHandler = () => {
            $content.css({
                height: stage.$el.height()
            });
        };
        $.get(options.contentUrl).then((response) => {
            var duration = options.countDuration;
            if (options.countPosition) {
                $counter.addClass(options.countPosition);
                $counter.addClass('counting');
            }
            if (!options.navEnabled) {
                stage.disableNav();
            }
            if (!options.navVisible) {
                stage.hideNav();
            }
            if (!options.countDisable && typeof options.countDuration === 'number') {
                $counter.html(options.countMessage.replace('{n}', duration));
                duration--;
                counterInterval = setInterval(() => {
                    if (duration > 0) {
                        $counter.html(options.countMessage.replace('{n}', duration));
                        duration--;
                    } else {
                        clearInterval(counterInterval);
                        $counter.empty().removeClass('counting');
                        stage.enableNav();
                        stage.showNav();
                    }
                }, 1000);
            }
            $content.html(response);
        });
        $el.data('destroy', () => {
            clearInterval(counterInterval);
            $content.empty();
            $counter.removeClass('topLeft topMiddle topRight bottomLeft bottomMiddle bottomLeft counting');
            $el.data('destroy', null);
            $(window).off('resize', resizeHandler);
        });
        $(window).on('resize', resizeHandler);
        resizeHandler();
    },

    createCounter() {
        var self = this;

        this.$carousel.on('carousel:init carousel:afterChange', () => {
            var count = self.carousel.stage.currentSlideAdjustedForInterstitials();
            if (typeof count === 'number') {
                self.$counter.html((count+1) + ' of ' + self.carousel.stage.slideCountMinusInterstitials());
            } else {
                self.$counter.html('');
            }
        });
    }

};
