// Fixing bug, will move this into correct repo once QA approves

/**
 *
 * The current infinite scroll is essentially just a wrapper for the jquery waypoints ifinite functionality.
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
 * We also support an additional nav where we can indicate the status as we scroll down the page
 *
 * This is the markup for the load status. This plugin will check the top of the content as you
 * scroll and when it loads and you get to that item, it will mark it as current on the li
 *
 * <ul class="bsp-infinite-load-status">
 *      <li><a href="myURL.html">Current Article</a></li>
 *      <li><a href="next.html">Next Article</a></li>
 * </ul>
 *
 * Lastly, we are doing light history management. Deciding to just do a simple replaceState on the history
 * this go around. It accomplishes us changing the URL for social media purposes and since this isn't a
 * big standalone single app page that tries to load up and down, we don't want to have to deal with
 * back button handling. We can enhance later if need be.
 *
 */


// TODO: this plugin should bower in waypoints and history.js in it's own repo, then push everything out to dist

import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import waypoints from 'jquery.waypoints';
import infinite from 'infinite';
import historyAPI from 'native.history';

var bsp_infinite_scroll = {

    defaults: {
        // wrapper selector
        // selector used for each infinite load item
        'itemSel'       : '.bsp-infinite-load-item',
        // selector for the trigger which should contain a link to the next article inside of it
        'triggerSel'    : '.bsp-infinite-load-trigger',
         // we have the optional marking of a status module. The status module should contain a list of links
         // and this plugin will mark the current item in view in this status list
        'navModuleSel'  : '.bsp-infinite-load-status',
        'navLinkSel'    : '.bsp-infinite-load-status ul li a',
        // the status list item gets this class to mark the current item
        'currentItemClass' : 'bsp-infinite-load-current',
        // we have to fi
        'itemUrlAttr'   : 'bsp-infinite-load-item-url',
        // the loading icon class
        'loadingIconClass' : 'bsp-loading-icon',

        'additionalOffset' : 50,
        'scrollSpeed'      : 350
    },

    init: function($el, options) {

        var self = this;
        self.$el = $el;
        self.settings = $.extend({}, self.defaults, options);

        self.$navModule = $(self.settings.navModuleSel);
        self.$loadMoreLink = self.$el.find(self.settings.triggerSel);
        self.useLoadMoreLink = true;

        // if we do not have nav or load more, get out
        if (!self.$loadMoreLink.length && !self.$navModule.length) {
            return false;
        }

        // if we have a the load more link, we want to use it to get the next article URL
        if (!self.$loadMoreLink.length) {
            self.useLoadMoreLink = false;
            self.articleList = self._createArticleListFromNav();
        }

        // create infinite scroll to start with. This is for the "load more" at the bottom of the article
        self.createInfiniteScroll();

        // create the waypoints for the nav for when the user scrolls between articles, so the nav gets marked
        self.createItemWaypointsForNav();

        // we have the first bit of content (loaded by server), replace the link on the first item
        // this function gets called by the wayponts as you scroll past articles otherwise
        self.replaceNavLinkWithScrollEvent();
    },

    _getNextArticle: function() {
        var self = this;

        if (self.useLoadMoreLink) {
            return self.$loadMoreLink.attr('href');
        } else {
            var currentUrl = self.$el.find(self.settings.itemSel + ':last').attr('data-bsp-infinite-load-item-url');
            var currentIndex = $.inArray(currentUrl, self.articleList);
            return self.articleList[currentIndex+1] || false;
        }

    },

    _createArticleListFromNav: function() {
        var self = this;
        var articleList = new Array();

        $(self.settings.navLinkSel).each(function() {
            articleList.push($(this).attr('href'));
        });

        return articleList;
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
                    self.title = $(this.element).data('meta-title') || '';
                }

                // if we hit it on the way up, that means we are scrolling up, so go ahead and toss the previous one there
                // as you're going that direction
                if(direction === 'up') {
                    self.currentArticleUrl = $(this.element).prev().data(self.settings.itemUrlAttr);
                    self.title = $(this.element).prev().data('meta-title') || '';
                }

                // if we do not find a title, grab the title out of the document and add it, so it's there for next time
                if (!self.title) {
                    $(this.element).data('meta-title', $(document).find('title').text());
                }

                // helper function to do the CSS classing
                self.markCurrentInNavModule();

                // helper to deal with History
                self.createHistoryEntry();
            },
            // we use 50 px as the default additional offset, which marks the current item just before it comes back to the original point
            offset: position + self.settings.additionalOffset
        });

    },

    // the actual infinite scroll functionality is farmed out to waypoints shortcut
    // KISS method applied here as this seems to work pretty well, so why mess with it
    createInfiniteScroll: function() {
        var self = this;

        self.infinite = new Waypoint({
            element : self.$el[0],
            handler: function(direction) {

                if(direction === 'down') {

                    var url = self._getNextArticle();

                    if (url) {

                        self.$loadingIcon = $('<div class="' + self.settings.loadingIconClass + '"></div>').appendTo(self.$el);

                        $.get(url, function(data) {

                            // sanitize our data so we can find things in it easily
                            var $wrapper = $('<div>').html(data);

                            var $infiniteLoadContent = $wrapper.find(self.settings.itemSel);

                            // grab the title of the article so we can add it into history
                            self.title = $wrapper.find('title').text() || '';
                            self.createHistoryEntry();

                            $infiniteLoadContent.data('meta-title',self.title);

                            self.$loadingIcon.remove();

                            self.$loadMoreLink.remove();

                            self.$el.append($infiniteLoadContent);

                            // after we load each item back into the DOM create the waypoints for it to mark itself in the nav
                            self.createItemWaypointsForNav();

                            // and also remove it's link in the nav with a scroll event
                            self.replaceNavLinkWithScrollEvent();

                        });

                    }

                }

            },
            offset: 'bottom-in-view'

        });

        // self.infinite = new Waypoint.Infinite({
        //     element   : self.$el[0],
        //     items     : self.settings.itemSel,
        //     more      : self.settings.triggerSel,
        //     onAfterPageLoad : function() {
        //         // after we load each item back into the DOM create the waypoints for it to mark itself in the nav
        //         self.createItemWaypointsForNav();

        //         // and also remove it's link in the nav with a scroll event
        //         self.replaceNavLinkWithScrollEvent();
        //     }
        // });

    },

    // this helper function replaces the nav item clicks with scroll events. Once we have content
    // we want the page to scroll back to it if the user clicks. If they click on an article that is
    // not there yet, we will go ahead and take them to that page instead
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

        var $nextNavLink = $navLink.parents('li').next().find('a');

        // now that we have already loaded that item, we change it's href do scroll there instead
        $navLink.off('click.bsp-infinite-content').on('click.bsp-infinite-content', function(e) {
            e.preventDefault();

            self.smoothScrollHelper($contentDiv);
        });

        $nextNavLink.on('click.bsp-infinite-content', function(e) {
            e.preventDefault();

            self.smoothScrollHelper($contentDiv, {'location':'bottom'});
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

    createHistoryEntry: function() {
        var self = this;

        // if we don't have a title that has been set, use the document
        if (!self.title) {
            self.title = $(document).find('title').text();
        }

        // Replace state in History API vs Push. We don't want to deal with the back
        // and forward buttons. That just gets too complicated and there is no need
        History.replaceState({}, self.title ,self.currentArticleUrl);
    },

    // we can go as crazy as we want with the scrolling code here. For now, simple jquery
    smoothScrollHelper: function($targetElement, options) {
        var self = this;

        // we might want to scroll to the top or bottom, top has nothing
        options = options || {};

        // if we are fixed positioning in the header, the body will have padding that we have to account for
        var bodyPadding = parseInt($('body').css('padding-top'));

        // item we want (and adding any body top padding if we have fixed positioning)
        var itemScroll = $targetElement.offset().top - bodyPadding;

        // if we are scrolling to the bottom of the element instead, add back the body padding and also the height of the element
        if (options.location === 'bottom') {
            itemScroll = itemScroll + $targetElement.height() + bodyPadding;
        }

        // go there via jquery, makes it easy
        $("html,body").animate({
            scrollTop: itemScroll
        }, self.settings.scrollSpeed);

    }


};

export default bsp_infinite_scroll;
