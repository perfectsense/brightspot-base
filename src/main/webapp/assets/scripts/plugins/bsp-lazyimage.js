/*
 * TODO: Update lazyimage to 1.0.0 and put this in the brightspot-js-lazyimage repo
 *
 * Utility for lazy loading images
 *
 * This utility takes either a regular tag with a data-lazy and converts it to an image with src, or takes a picture element with
 * data-lazy and converts it to regular srcset attributes. It's compatible with (but does not need) picturefill, as it tries to
 * call it if it exists.
  *
 * Usage:
 * 1) require the utility: var lazyLoader  = require('lazy-loader');
 * 2) init the utility with the context element, as well as any options: self.lazyLoaderInstance.init(document);
 * 3) Call whatever public functions you need
 *
 *    addItems: Takes an array of items and adds them to the lazy loading queue. You can change options here, as you can
 *              reset the offset or throttleInterval if necessary
 *
 *    createCheckListeners: Listens to scroll and mutation events to see any of the images in the queue should be lazy loaded.
 *                          If they are visible and in the viewport, it loads them
 *
 *    checkItems: goes through the queue and checks to see if any images should be lazy loaded.
 *                If they are visible and in the viewport, it loads them
 *
 *    renderImage: Takes an image that was setup for lazy loading and laods it. This is used if you want to skip the checking of items and handle
 *                 your own checking
 *
 * Examples of supported HTML syntax:
 *
 * 1) <span data-lazy="asdf.jpg" alt="asdf" class="asdf"></span>
 *
 * 2) <img data-lazy="asdf.jpg" alt="asdf" class="asdf"></img>
 *
 * 3) <div>
 *        <span data-lazy="asdf.jpg" alt="asdf" class="asdf"></span>
 *        <span data-lazy="asdf.jpg" alt="asdf" class="asdf"></span>
 *    </div>
 *
 * 4) <picture class="asdf">
 *        <source data-lazy="/asdf.jpg" media="(max-width: 767px)">
 *        <img data-lazy="asdf.jpg" alt="Responsive Image">
 *    </picture>
 */


import $ from 'jquery';
import bsp_utils from 'bsp-utils';

var bsp_lazyimage = {

    settings: {
        'checkVisibility'   : false,
        'context'           : document,
        'loadedClass'       : 'lazy-loaded',
        'nativeImageLoading': true,
        'offset'            : 250,
        'preloaderIconClass': 'bsp-spinner',
        'throttleInterval'  : 250
    },

    // this is just used right now to override any of the default settings.
    // wanted to leave this here in case we want to add additional items into init
    init: function(element, options) {

        var self = this;

        self.settings.context = element;

        $.extend(self.settings, options);

        self.modernBrowser = window.MutationObserver || window.WebKitMutationObserver;

    },

    // Public function to add items to array we check against. We allow additional options here so you
    // can override the defaults, or initial items, per new set of items
    addItems: function(items, options) {

        var self = this;

        $.extend(self.settings, options);

        self.items.push.apply(self.items,items);

        self.checkItems();
    },

    // Creates a scroll, resize, and mutation event listener and checks against the current array of items
    createCheckListeners: function() {
        var self = this;
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        self.items = [];

        // our own private scroll and resize events, debounced so that we do not trigger scroll eleventy times per scroll
        $(window).on('scroll.lazyLoader resize.lazyLoader', bsp_utils.throttle(self.settings.throttleInterval,function() {

            // if we have any items to check,go ahead and check
            if(self.items.length) {
                self.checkItems();
            }

        }));

        // allows all the self/this to work
        function checkItemClosure() {
            if(self.items.length) {
                self.checkItems();
            }
        }

        // we check the mutation observer if it's around. What this allows us to do is only lazy load items that are visible at first
        // and as things become visible in the DOM, we go ahead and lazy load them
        if (self.modernBrowser) {
            new MutationObserver(bsp_utils.throttle(self.settings.throttleInterval, checkItemClosure)).observe(self.settings.context, {
                'childList'     : true,
                'subtree'       : true,
                'attributes'    : true
            });

        // But if mutation observer is not available, brute-force it with an interval (IE8/9/10)
        } else {
            setInterval(checkItemClosure, self.settings.throttleInterval);
        }

    },

    // Does the check to see if an item should be rendered. We check the visibility as well as it's location in the viewport
    checkItems: function() {
        var self = this;

        // go through the array of items and check if they are in the viewport
        // if we do need to render them, do that, and then remove them out of the array so
        // we do not check them again
        for (var i=0; i < self.items.length;) {

            var $item = $(self.items[i]);
            var visible = true;

            // by default, we just check the viewport. If we want the optional visibility check, dooo it
            if (self.settings.checkVisibility) {
                visible = $item.is(":visible");
            }

            // if you are visible, do stuff. If you are, just move on to the next item
            // here we also check if you're a not modern browser. If you are old, we skip the visible check
            if (visible || !self.modernBrowser) {
                // if you are in the viewport, then render the image, and remove yourself from the array, since you're loaded
                // if you aren't in the viewport, move on and check the next item
                if(self._isInViewportOrAbove($item)) {
                    self.renderImage($item);
                    self.items.splice(i,1);
                }
                else {
                    i++;
                }
            } else{
                i++;
            }

        }

    },

    // Public function that renders the image and sets a loading class. This is used by other functions in this utility
    // or it can be called directly if you'd like to roll your own event handlers
    renderImage: function(el) {

        var self = this;
        var $el = $(el);
        var $lazyImage;
        var $preloader = $el.find('.' + self.settings.preloaderIconClass);

        // for picturefill, we have to change all the data-lazy to srcssets
        // for normal images, we replace the src with data-lazy
        if($el.prop('tagName') === 'PICTURE') {

            // find every data-srcset, make a new srcset with that data
            $el.find('[data-lazy]').each(function () {
                $(this).attr('srcset', $(this).attr('data-lazy'));
            });

            $el.addClass(self.settings.loadedClass);

            // if we are using picture fill reevaluate so it will pick up the image
            if (typeof(window.picturefill) === 'function') {
                window.picturefill({ 'reevaluate': true });
            }

            $preloader.remove();

        } else {

            // find the source
            if($el.data('lazy')) {
                $lazyImage = $el;
            } else {
                $lazyImage = $el.find('[data-lazy]');
            }

            // if we have an image to load, do it
            if($lazyImage.length) {

                $lazyImage.each(function() {

                    var $this = $(this);

                    // support for requestAnimationFrame. We let the site determine polyfills, and we support either
                    if(window.requestAnimationFrame) {
                        window.requestAnimationFrame(function() {
                            self._loadImage($el, $this);
                        });
                    } else {
                        self._loadImage($el, $this);
                    }

                });

            }
        }

    },

    // Private function to load the image and replace the actual image
    _loadImage: function($parent, $image) {
        var self = this;

        // we grab the image path, had some issues pulling this later, so we're grabbing and caching now, it's always here now
        var imagePath = $image.attr('data-lazy');

        // cache the preloader if exists
        var preloader = $parent.find('.' + self.settings.preloaderIconClass);

        function replaceImage() {
            preloader.remove();

            // make sure we have an image path and something weird did not happen. Had an edge case where slick carousel would
            // intercept the data-lazy tags and do its own lazy loading, but the time did animation frame and got here, the image
            // was already lazy loaded for us and the data-lazy was gone, so the image path was undefined
            if(imagePath) {
                // replace image
                $image.replaceWith($('<img/>', {
                    'alt'   : $image.attr('alt'),
                    'class' : ($image.attr('class') || '') + ' ' + self.settings.loadedClass,
                    'src'   : imagePath,
                    'title' : $image.attr('title')
                }));
            }
        }

        // we have the option to allow for native image loading, or the arguably better UX option to let the images just pop in when they are ready
        if(self.settings.nativeImageLoading) {

            replaceImage();


        } else {

            // this is the temp image that we'll check for smoother loading
            var $tempImage = $('<img>').attr('src', imagePath);

            // now that we are loaded
            $tempImage.one('load', function() {

                replaceImage();

            }).each(function() {

                // gets around issues with caches images not triggering load sometimes
                if(this.complete) {
                    $(this).load();
                }
            });

        }

    },


    // Simple check to see if the item is in the viewport or above. We do this on purpose so that if we enter
    // the page halfway through, we will load all the images above us, to make sure the page won't jump if we scroll up
    _isInViewportOrAbove: function($item) {
        var self = this;

        var elementPosition = $item.offset();
        var elementWidth = $item.width();
        var offset = self.settings.offset;

        self.scrollTop = $(window).scrollTop();
        self.scrollLeft = $(window).scrollLeft();
        self.windowHeight = $(window).height();
        self.windowWidth = $(window).width();

        // window height, how much we are scrolled and our offset. We want to make sure the element is above this
        var verticalPosition = self.windowHeight + self.scrollTop + offset;

        // window width, how much we are scrolled and the offset. We want to make sure the element is greater than 0 and to the left of this
        var horizontalPosition = self.windowWidth + self.scrollLeft + offset;

        // make sure we are in or above the vertical viewport and insize the horizontal one
        if (((elementPosition.left + elementWidth) > 0) && ((verticalPosition > elementPosition.top) && (horizontalPosition > elementPosition.left))) {
            return true;
        } else {
            return false;
        }

    }

};

export default bsp_lazyimage;
