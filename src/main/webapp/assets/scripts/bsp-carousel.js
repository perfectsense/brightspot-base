/* Moved this inside this repo temporarily to develop deep linking for bsp-carousel-gallery. Will move back/version once it's ready */

import $ from 'jquery';
import slick from './slick';

var bsp_carousel = {};

(function() {
    bsp_carousel.themes = {
        'carousel-dots': {
            dots: true
        },
        'carousel-horizontal-thumbnails': {
            lazyLoad: 'progressive',
            slidesToShow: 4,
            slidesToScroll: 4
        }
    };

    bsp_carousel.defaults = {
        'dynamicSlideLoad'  : false,
        'dynamicCount'      : 1
    }

    bsp_carousel.init = function($el, options) {
        var self = this;
        this.$el = $el;

        console.log(options);

        self.options = $.extend(true, self.defaults, options);
        this.themeOptions = this.mergeOptions(options);

        this.addClasses(options);
        this._createSlickMethodsAvailablePromise();
        this.addEvents();

        console.log(self.options);

        if(self.options.deepLinking) {
            this.handleDeepLinking();
        }

        // if we are a dynamic slide load, we go ahead and create all the event bindings up front
        // and also make sure that we remove infinite status. Dynamic and infinite do not go together
        if(self.options.dynamicSlideLoad) {
            this._createDynamicSlideLoad();
            this.themeOptions.infinite = false;
        }

        this._interstitialsEnabled = true;
        this._interstitialClass = 'interstitial'; // wtf, don't know why this doesn't save when passed as an option

        $el.slick(this.themeOptions);
        $el.data('bsp_carousel', this);

        return this;
    };

    bsp_carousel.handleDeepLinking = function() {
        var self = this;
        var hash = window.location.hash;
        var deepLinkSlide;

        if(hash.indexOf(self.options.deepLinkId) > -1) {
            deepLinkSlide = hash.replace('#' + self.options.deepLinkId,'');
        }

        if(deepLinkSlide) {
            self.themeOptions.initialSlide = deepLinkSlide-1;
        } else {
            window.location.hash = self.options.deepLinkId + 1;
        }

        this.$el.on('carousel:afterChange', function() {
            if(self.currentSlideAdjustedForInterstitials() === 'interstitial') {
                window.location.hash = '';
            } else {
                window.location.hash = self.options.deepLinkId + (self.currentSlideAdjustedForInterstitials()+1);
            }
        });
    };

    bsp_carousel.mergeOptions = function(options) {
        var merged = {};
        if (typeof options != 'object') {
            options = merged;
        }
        if (options.theme) {
            merged = this.themes[options.theme];
        }
        if (options.themeConfig) {
            merged = $.extend({}, merged, options.themeConfig);
        }
        return merged;
    };

    bsp_carousel.addClasses = function(options) {
        this.$el.addClass('bsp-carousel');
        if (typeof options != 'undefined' && options.theme) {
            this.$el.addClass(options.theme);
        }
    };

    /** bind events to element */
    bsp_carousel.bind = function(event, callback) {
        this.$el.on(event, callback);
    };

    /** trigger events, always pass self as first arg of callback followed by other args */
    bsp_carousel.trigger = function() {
        var args = $.makeArray(arguments);
        var event = args.shift();
        args.unshift(this);
        this.$el.trigger.apply(this.$el, [event, args]);
    };

    /** slick event abstractions */
    bsp_carousel.addEvents = function() {
        var self = this;
        this.bind('afterChange', function(event, slick, currentSlide) {
            self.trigger('carousel:afterChange', currentSlide);
        });
        this.bind('beforeChange', function(event, slick, currentSlide, nextSlide) {
            self.trigger('carousel:beforeChange', currentSlide, nextSlide);
        });
        this.bind('edge', function(event, slick, direction) {
            self.trigger('carousel:edge', direction);
        });
        this.bind('reinit', function() {
            self.trigger('carousel:reinit');
        });
        this.bind('setPosition', function() {
            self.trigger('carousel:setPosition');
        });
        this.bind('swipe', function(event, slick, direction) {
            self.trigger('carousel:swipe', direction);
        });
        self._slickMethodsAvailablePromise.done(function() {
            self.trigger('carousel:init');
        });
        this.bind('carousel:swipe', function(e) {
            if (!self.getOption('swipe')) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    };

    /** slick method abstractions */
    bsp_carousel.currentSlide = function() {
        return this._slickMethod('slickCurrentSlide');
    };
    bsp_carousel.goTo = function(i, doNotAnimate) {
        this._slickMethod('slickGoTo', i, doNotAnimate);
    };
    bsp_carousel.next = function() {
        this._slickMethod('slickNext');
    };
    bsp_carousel.prev = function() {
        this._slickMethod('slickPrev');
    };
    bsp_carousel.pause = function() {
        this._slickMethod('slickPause');
    };
    bsp_carousel.play = function() {
        this._slickMethod('slickPlay');
    };
    bsp_carousel.reInit = function() {

        if (this._slickMethodsAvailable()) {
            this.$el.slick('unslick');
            this.$el.slick(this.themeOptions);
        }

    };
    bsp_carousel.add = function(ele, index, addBefore) {
        this._slickMethod('slickAdd', ele, index, addBefore);
    };
    bsp_carousel.remove = function(index, removeBefore) {
        this._slickMethod('slickRemove', index, removeBefore);
    };
    bsp_carousel.filter = function(selectorOrFunction) {
        this._slickMethod('slickFilter', selectorOrFunction);
    };
    bsp_carousel.unfilter = function(i) {
        this._slickMethod('slickUnfilter', i);
    };
    bsp_carousel.getOption = function(option) {
        return this._slickMethod('slickGetOption', option);
    };
    bsp_carousel.setOption = function(option, value) {
        this._slickMethod('slickSetOption', option, value);
    };
    bsp_carousel.destroy = function() {
        this._slickMethod('unslick');
    };

    /** extra helper methods */
    bsp_carousel.slideCount = function() {
        return this._slickMethod('getSlick').slideCount;
    };
    bsp_carousel.slideCountMinusInterstitials = function() {
        return this.slideCount() - this.$el.find('.slick-slide.'+this._interstitialClass+':not(.slick-cloned)').length;
    };
    bsp_carousel.currentSlideAdjustedForInterstitials = function() {
        var self = this;
        var current = this.currentSlide();
        var interstitialsBeforeCount = 0;
        if (self.slideIsInterstitial(current)) {
            return 'interstitial';
        } else {
            self.$el.find('.slick-slide:not(.slick-cloned)').each((key, slide) => {
                if (key <= current && self.slideIsInterstitial(key)) {
                    interstitialsBeforeCount++;
                }
            });
            return current - interstitialsBeforeCount;
        }
    };
    bsp_carousel.slideIsInterstitial = function(index) {
        var $slide = this.$el.find('[data-slick-index="'+index+'"]');
        return $slide.hasClass(this._interstitialClass);
    };
    bsp_carousel.disableNav = function() {
        this.setOption('swipe', false);
        this.$el.find('.slick-prev, .slick-next')
            .addClass('slick-disabled')
            .attr('disabled', 'disabled');
    };
    bsp_carousel.enableNav = function() {
        this.setOption('swipe', true);
        this.$el.find('.slick-prev, .slick-next')
            .removeClass('slick-disabled')
            .removeAttr('disabled');
    };
    bsp_carousel.hideNav = function() {
        this.setOption('swipe', false);
        this.$el.addClass('nav-hide');
    };
    bsp_carousel.showNav = function() {
        this.setOption('swipe', true);
        this.$el.removeClass('nav-hide');
    };

    /** private methods */

    // helper to get more slides. We make sure we meet the criteria, ajax in, and add slides
    bsp_carousel._tryToGetMoarSlides = function() {
        var self = this;
        var getNext;

        // we want to make sure we stay ahead the correct amount. If we are into the slideshow more than we should be
        // fetching each time, it means it's time to fetch
        console.log(self.slideCount());
        console.log(self.currentSlideAdjustedForInterstitials()+1);
         console.log(self.options.dynamicCount);
        if(self.slideCount() - (self.currentSlideAdjustedForInterstitials()+1) < self.options.dynamicCount) {

            self.options.dynamicIndex = self.slideCount();

            getNext = $.get(self.options.dynamicEndpoint + '?i=' + self.options.dynamicIndex + '&n=' + self.options.dynamicCount);

            getNext.done(function(data) {
                self.add(data);
            });
        }
    },

    // TODO: Make this code pretty with more functions and create some APIs to do this dynamically
    // for now, this will work to get the job done
    bsp_carousel._createDynamicSlideLoad = function() {
        var self = this;

        // if we were not provided an endpoint, get out
        if (!self.options.dynamicEndpoint) {
            return false;
        }

        self.bind('carousel:init', (event, slick, currentSlide) => {

            self._tryToGetMoarSlides();

            self.bind('beforeChange', (event, slick, currentSlide, nextSlide) => {

                if(nextSlide > currentSlide) {
                    self.sliderDirection = 'forward';
                } else {
                    self.sliderDirection = 'backward';
                }

            });

            self.bind('afterChange', (event, slick, currentSlide) => {

                if(self.sliderDirection === 'forward') {
                    self._tryToGetMoarSlides();
                }

            });

        });

    };

    /**
     * slick methods are not available yet when slick's init event fires,
     * so instead creating our own init event that doesn't fire until slick
     * is fully loaded and methods are available
     */
    bsp_carousel._slickMethod = function() {
        if (this._slickMethodsAvailable()) {
            return this.$el.slick.apply(this.$el, arguments);
        } else {
            if (arguments[0] == 'getSlick') {
                return {
                    slideCount: 0
                };
            }
        }
    };
    bsp_carousel._slickMethodsAvailable = function() {
        if (this._slickMethodsFound) {
            return true;
        } else {
            try {
                this.$el.slick('getSlick');
                this._slickMethodsFound = true;
                return true;
            } catch(e) {}
        }
    };
    bsp_carousel._createSlickMethodsAvailablePromise = function() {
        var self = this;
        var deferred = $.Deferred();
        var checks = 0;
        self._slickMethodsAvailablePromise = deferred.promise();
        self._checkSlickInterval = setInterval(function() {
            if (self._slickMethodsAvailable()) {
                deferred.resolve();
                clearInterval(self._checkSlickInterval);
            } else if (checks > 10) {
                deferred.reject();
                clearInterval(self._checkSlickInterval);
            }
            checks++;
        }, 100);
    };
})();

export default bsp_carousel;
