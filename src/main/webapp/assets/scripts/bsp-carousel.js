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
        var self = this;
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

        this._interstitialsEnabled = true;
        this._interstitialClass = 'interstitial'; // wtf, don't know why this doesn't save when passed as an option

        this.options = this.mergeOptions(options);

        $el.slick(this.options);
        $el.data('bsp_carousel', this);

        // feels a little dirty, if someone has a better suggestion, please do a Pull Request
        // we are binding ourselves to the modal opening to reinit
        $('body').bind('bsp-modal:open', function() {
            self.reInit();
            // once we init, we trigger a resize, to make sure modal stays centered
            $(window).trigger('resize');
        });

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
    bsp_carousel.reInit = function() {

        if (this._slickMethodsAvailable()) {
            this.$el.slick('unslick');
            this.$el.slick(this.options);
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

    bsp_carousel._createDynamicSlideLoad = function() {
        var self = this;
        self.fetchInProgress = false;
        self.bind('carousel:init carousel:beforeChange', (e, carousel, currentSlide, nextSlide) => {
            if (!self.fetchInProgress) {
                var $nextSlide;
                var fetchNext;
                var fetchPrev;
                var fetchTimeout;
                var fetchTimeoutDuration = 7000;
                var nextUrl;
                var prevUrl;
                var slidesAhead;
                var slidesBehind;
                var slidesToScroll = self.getOption('slidesToScroll');
                var slidesToShow = self.getOption('slidesToShow');
                var slideCount = self.slideCount();
                var slidesToFetchBehind = 0;
                var slidesToFetchAhead = 0;
                var slidesToAppend = [];
                var slidesToPrepend = [];
                var slideAheadDeferred = $.Deferred();
                var slideBehindDeferred = $.Deferred();

                self.disableNav();
                self.hideNav();

                // no currentSlide or nextSlide on init event
                if (!nextSlide) {
                    nextSlide = self.currentSlide();
                }

                slidesAhead = self.slideCount() - nextSlide - 1;
                slidesBehind = nextSlide;
                $nextSlide = self.$el.find('[data-slick-index='+nextSlide+']');
                nextUrl = $nextSlide.find('[data-next-url]').data('next-url');
                prevUrl = $nextSlide.find('[data-prev-url]').data('prev-url');

                if (!nextUrl) {
                    nextUrl = self.$el.find('[data-slick-index='+(slideCount-1)+']').data('next-url');
                }

                self.fetchInProgress = true;

                slidesToFetchAhead = slidesToScroll;
                if (slidesBehind < slidesToScroll) {
                    slidesToFetchBehind = slidesToScroll;
                }

                // there may only be one slide in the data, make sure enough are
                // fetched to show the carousel with a full slidesToShow
                if (slideCount < slidesToShow) {
                    slidesToFetchAhead += (slidesToShow - slideCount);
                }

                if (nextUrl) {
                    fetchNext = (url) => {
                        if (!url) {
                            return;
                        }
                        $.get(url).done((data) => {
                            var tempDiv = document.createElement('div');
                            tempDiv.innerHTML = data;
                            slidesToAppend.push(data);
                            slidesToFetchAhead--;
                            if (slidesToFetchAhead > 0) {
                                nextUrl = $(tempDiv).find('[data-next-url]').data('next-url');
                                fetchNext(nextUrl);
                            } else {
                                slideAheadDeferred.resolve();
                            }
                        });
                    };
                    if (slidesToFetchAhead > 0) {
                        fetchNext(nextUrl);
                    } else {
                        slideAheadDeferred.resolve();
                    }
                } else {
                    slideAheadDeferred.resolve();
                }

                if (prevUrl) {
                    fetchPrev = (url) => {
                        if (!url) {
                            return;
                        }
                        $.get(url).done((data) => {
                            var tempDiv = document.createElement('div');
                            tempDiv.innerHTML = data;
                            slidesToPrepend.push(data);
                            slidesToFetchBehind--;
                            if (slidesToFetchBehind > 0) {
                                nextUrl = $(tempDiv).find('[data-prev-url]').data('prev-url');
                                fetchPrev(nextUrl);
                            } else {
                                slideBehindDeferred.resolve();
                            }
                        });
                    };
                    if (slidesToFetchBehind > 0) {
                        fetchPrev(prevUrl);
                    } else {
                        slideBehindDeferred.resolve();
                    }
                } else {
                    slideBehindDeferred.resolve();
                }
                
                $.when(
                    slideAheadDeferred.promise(),
                    slideBehindDeferred.promise()
                ).then(() => {
                    clearTimeout(fetchTimeout);
                    slidesToAppend.reverse();
                    $.each(slidesToAppend, (key, slide) => {
                        self.add(slide);
                    });
                    $.each(slidesToPrepend, (key, slide) => {
                        self.add(slide, 0, true);
                    });
                    self.fetchInProgress = false;
                    self.enableNav();
                    self.showNav();
                });

                // abort if it times out
                fetchTimeout = setTimeout(() => {
                    slideAheadDeferred.reject();
                    slideBehindDeferred.reject();
                    self.fetchInProgress = false;
                    self.enableNav();
                    self.showNav();
                }, fetchTimeoutDuration);

                e.preventDefault();
            }
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