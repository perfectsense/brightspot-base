/**
 * The current infinite scroll is just a wrapper for the jquery waypoints ifinite functionality. 
 * Surround the infinite load content with a wrapper, give your content the appropriate class, and 
 * create a "load more" link outside the wrapper which links to the next piece of content. Once
 * the next piece of content doesn't contain the "load more" link, the infinite loading stops. 
 *
 * <div class="bsp-infinite-load-wrapper" data-bsp-infinite-scroll>
 *      <div class="bsp-infinite-load-item">
 *          My Item Content Here
 *      </div>
 *      <!-- The plugin will place the bsp-infinite-load-item div out of next.html here -->
 * </div>
 * <a class="bsp-infinite-load-trigger" href="next.html">Next Content</a>
 */

import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import waypoints from 'bower/waypoints/jquery.waypoints';
import infinite from 'bower/waypoints/infinite';

var bsp_infinite_scroll = {

	defaults: {
        'itemSel'       : '.bsp-infinite-load-item',
		'triggerSel'    : '.bsp-infinite-load-trigger',
	},

    init: function($el, options) {

    	var self = this;
    	self.$el = $el;
    	self.settings = $.extend({}, self.defaults, options);

        self.initWaypoints();

    },

    initWaypoints: function() {

    	var self = this;

        var infinite = new Waypoint.Infinite({
          element   : self.$el[0],
          items     : self.settings.itemSel,
          more      : self.settings.triggerSel
        });
    }

};

export default bsp_infinite_scroll;