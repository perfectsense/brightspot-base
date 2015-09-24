// TODO: This is in this repo until we create pretty enough code around the dynamic loading to move it out back to it's own repo

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

    bsp_carousel.init = function($el, options) {
        this.$el = $el;
        this.addClasses(options);
        this._createSlickMethodsAvailablePromise();
        this.addEvents();

        // if we are a dynamic slide load, we go ahead and create all the event bindings up front
        // and also make sure that we remove infinite status. Dynamic and infinite do not go together
        if(options.dynamicSlideLoad) {
            this._createDynamicSlideLoad();
            options.themeConfig.infinite = false;
        }

        options = this.mergeOptions(options);

        $el.slick(options);
        $el.data('bsp_carousel', this);

        return this;
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
    };

    /** slick method abstractions */
    bsp_carousel.currentSlide = function() {
        return this._slickMethod('slickCurrentSlide');
    };
    bsp_carousel.goTo = function(i) {
        this._slickMethod('slickGoTo', i);
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

    /** private methods */

    // TODO: Make this code pretty with more functions and create some APIs to do this dynamically
    // for now, this will work to get the job done
    bsp_carousel._createDynamicSlideLoad = function() {
        var self = this;

        self.bind('init', (event, slick, currentSlide) => {

            var $currentSlide = $(slick.$slides[0]);

            var $urlDataElement = $currentSlide.find('[data-next-url],[data-prev-url]');

            // there are no URLs to load, so we will not do anything at all
            if(!$urlDataElement.length) {
                return false;
            }

            var nextSlideUrl = $urlDataElement.attr('data-next-url');
            var prevSlideUrl = $urlDataElement.attr('data-prev-url');

            var getNext = $.get(nextSlideUrl);
            var getPrev = $.get(prevSlideUrl);

            $.when(getNext, getPrev).done(function(dataNext, dataPrev) {

                slick.slickAdd($('<div class="bsp-carousel-slide">').html(dataNext[0]));
                slick.slickAdd($('<div class="bsp-carousel-slide">').html(dataPrev[0]), 0, true);
                slick.goTo(1, true);

                var direction;

                self.bind('beforeChange', (event, slick, currentSlide, nextSlide) => {

                    if(nextSlide > currentSlide) {
                        direction = 'forward';
                    } else {
                        direction = 'backward';
                    }

                });

                self.bind('afterChange', (event, slick, currentSlide) => {

                    if(direction === 'forward') {

                        if(!slick.$slides[currentSlide+1]) {

                            $currentSlide = $(slick.$slides[currentSlide]);

                            $urlDataElement = $currentSlide.find('[data-next-url],[data-prev-url]');

                            nextSlideUrl = $urlDataElement.attr('data-next-url');

                            if(nextSlideUrl) {
                                getNext = $.get(nextSlideUrl);

                                getNext.done(function(data) {
                                    slick.slickAdd($('<div class="bsp-carousel-slide">').html(data));
                                });
                            }
                        }

                    } else {

                        if(!slick.$slides[currentSlide-1]) {

                            $currentSlide = $(slick.$slides[currentSlide]);

                            $urlDataElement = $currentSlide.find('[data-next-url],[data-prev-url]');

                            prevSlideUrl = $urlDataElement.attr('data-prev-url');

                            if(prevSlideUrl) {

                                getPrev = $.get(prevSlideUrl);

                                getPrev.done(function(data) {
                                    slick.slickAdd($('<div class="bsp-carousel-slide">').html(data), 0, true);
                                    slick.goTo(1, true);
                                });
                            }
                        }

                    }

                });
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
