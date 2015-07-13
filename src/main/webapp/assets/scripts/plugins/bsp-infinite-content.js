/**
 * The current infinite scroll is just a wrapper for the jquery waypoints ifinite functionality. 
 * Surround the infinite load content with a wrapper, give your content the appropriate class, and 
 * create a "load more" link outside the wrapper which links to the next piece of content. Once
 * the next piece of content doesn't contain the "load more" link, the infinite loading stops. 
 *
 * <div class="bsp-infinite-load-wrapper" data-bsp-infinite-scroll data-infinite-load-item-url="myURL.html">
 *      <div class="bsp-infinite-load-item">
 *          My Item Content Here
 *      </div>
 *      <!-- The plugin will place the bsp-infinite-load-item div out of next.html here -->
 * </div>
 * <a class="bsp-infinite-load-trigger" href="next.html">Next Content</a>
 *
 * This is the markup for the load status. This plugin will check the top of the page 
 * <ul class="bsp-infinite-load-status">
 *      <li><a href="myURL.html">Current Article</a></li>
 *      <li><a href="next.html">Next Article</a></li>
 * </ul>
 */

import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import waypoints from 'bower/waypoints/jquery.waypoints';
import infinite from 'bower/waypoints/infinite';

var bsp_infinite_scroll = {

	defaults: {
        // selector used for each infinite load item
        'itemSel'       : '.bsp-infinite-load-item', 
        // selector for the trigger which should contain a link to the next article inside of it
		'triggerSel'    : '.bsp-infinite-load-trigger', 
         // we have the optional marking of a status module. The status module should contain a list of links
         // and this plugin will mark the current item in view in this status list
        'navModuleSel'  : '.bsp-infinite-load-status',
        // the status list item gets this class to mark the current item
        'currentItemClass' : 'bsp-infinite-load-current',
        // we have to fi
        'itemUrlAttr'   : 'bsp-infinite-load-item-url',

        'additionalOffset' : 50
	},

    init: function($el, options) {

    	var self = this;
    	self.$el = $el;
    	self.settings = $.extend({}, self.defaults, options);

        // create infinite scroll to start with
        self.createInfiniteScroll();

        // setup nav Module selector so we can only crawl the DOM once
        self.navModule = $(self.settings.navModuleSel);

        // if there is no nav module, there is nothing to do here
        self.createItemWaypointsForNav();         

    },

    // we create the waypoints for the top of the content so that we can determine what 
    // content is on the screen to mark our nav module with the current position
    createItemWaypointsForNav: function() {
        var self = this;

        // if there is no nav module, there is nothing to do here
        if (!self.navModule) { 
            return;
        }

        // we grab the position of our first piece of content. This is what we use as our waypoint offset
        // this accounts for things like sticky headers or other things that might be above our content
        var position = $(self.settings.itemSel + ':first').offset().top;

        // we setup the waypoint for the last item on the page. This way as we load more items, we just
        // continue adding waypoints to the stack but only working with the last one
        self.waypoints = $(self.settings.itemSel + ':last').waypoint({
            handler: function(direction) {

                // if we hit this waypoint scrolling down, we want to mark this article as the one that's on the screen
                // it means the title or top is close to the location where the original was
                if(direction === 'down') {
                    self.currentArticleUrl = $(this.element).data(self.settings.itemUrlAttr);
                }

                // if we hit it on the way up, that means we are scrolling up, so go ahead and toss the previous one there
                // as you're going that direction
                if(direction === 'up') {
                    self.currentArticleUrl = $(this.element).prev().data(self.settings.itemUrlAttr);
                }

                // helper function to do the CSS classing
                self.markCurrentInNavModule();
            },
            // we use 50 px as the default additional offset, which marks the current item just before it comes back to the original point
            offset: position + self.settings.additionalOffset
        });

    },

    // the actual infinite scroll functionality is farmed out to waypoints shortcut
    // KISS method applied here as this seems to work pretty well, so why mess with it
    createInfiniteScroll: function() {
        var self = this;

        self.infinite = new Waypoint.Infinite({
            element   : self.$el[0],
            items     : self.settings.itemSel,
            more      : self.settings.triggerSel,
            onAfterPageLoad : function() {
                // after we load each item back into the DOM create the waypoints for it to mark itself in the nav
                self.createItemWaypoints();
            }
        });

    },

    markCurrentInNavModule: function() {
        var self = this;

        // if there is no nav module, there is nothing to do here
        if (!self.navModule) { return; }

        // go through all the list items and unmark them
        $(self.settings.navModuleSel).find('li').removeClass(self.settings.currentItemClass);

        // find the current article link we are viewing and mark it's parent list item as active
        $(self.settings.navModuleSel).find('a[href="' + self.currentArticleUrl + '"]').parents('li').addClass(self.settings.currentItemClass);

    }

};

export default bsp_infinite_scroll;