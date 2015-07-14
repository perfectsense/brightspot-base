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


// TODO: this plugin should bower in waypoints and history.js in it's own repo, then push everything out to dist

import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import waypoints from 'bower/waypoints/jquery.waypoints';
import infinite from 'bower/waypoints/infinite';
import historyAPI from 'native.history';

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

        'additionalOffset' : 50,
        'scrollSpeed'      : 350
	},

    init: function($el, options) {

    	var self = this;
    	self.$el = $el;
    	self.settings = $.extend({}, self.defaults, options);

        // setup nav Module selector so we can only crawl the DOM once
        self.$navModule = $(self.settings.navModuleSel);

        // create infinite scroll to start with. This is for the "load more" at the bottom of the article
        self.createInfiniteScroll();

        // create the waypoints for the nav for when the user scrolls between articles, so the nav gets marked
        self.createItemWaypointsForNav();  

        // we have the first bit of content (loaded by server), replace the link on the first item
        self.replaceNavLinkWithScrollEvent();       
    },

    // we create the waypoints for the top of the content so that we can determine what 
    // content is on the screen to mark our nav module with the current position
    createItemWaypointsForNav: function() {
        var self = this;

        // if there is no nav module, there is nothing to do here
        if (!self.$navModule) { 
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

                // helper to deal with History
                self.createHistoryEntryAndAddMeta();
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
                self.createItemWaypointsForNav();

                // and also remove it's link in the nav with a scroll event
                self.replaceNavLinkWithScrollEvent();
            }
        });

    },

    replaceNavLinkWithScrollEvent: function() {
        var self = this;

        // if there is no nav module, there is nothing to do here
        if (!self.$navModule) { return; }

        // we get the URL from the content we just retrieved
        var $contentDiv = $(self.settings.itemSel + ':last');

        // the content div has the url of the article in it's data element
        var urlFromContentDiv = $contentDiv.data(self.settings.itemUrlAttr);

        // go into the nav module and find the link we need
        var $navLink = self.$navModule.find('a[href="' + urlFromContentDiv + '"]');

        // now that we have already loaded that item, we change it's href do scroll there instead
        $navLink.on('click', function(e) {
            e.preventDefault();

            self.smoothScrollHelper($contentDiv);
        });
    },

    markCurrentInNavModule: function() {
        var self = this;
        var $navLink = $(self.settings.navModuleSel).find('a[href="' + self.currentArticleUrl + '"]');
        
        // if there is no nav module, there is nothing to do here
        if (!self.$navModule) { return; }

        // go through all the list items and unmark them
        $(self.settings.navModuleSel).find('li').removeClass(self.settings.currentItemClass);

        // find the current article link we are viewing and mark it's parent list item as active
        $navLink.parents('li').addClass(self.settings.currentItemClass);
    },

    createHistoryEntryAndAddMeta: function() {
        var self = this;

        // Replace state in History API vs Push. We don't want to deal with the back
        // and forward buttons. That just gets too complicated and there is no need
        History.replaceState({},"",self.currentArticleUrl);
    },

    // we can go as crazy as we want with the scrolling code here. For now, simple jquery
    smoothScrollHelper: function($targetElement) {
        var self = this;

        // item we want (and adding any body top padding if we have fixed positioning)
        var itemTop = $targetElement.offset().top - parseInt($('body').css('padding-top')); 

        // go there via jquery, makes it easy
        $("html,body").animate({
            scrollTop: itemTop
        }, self.settings.scrollSpeed);

    }


};

export default bsp_infinite_scroll;