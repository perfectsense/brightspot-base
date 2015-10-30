/**
 *  TODO: Create a bsp-scroll-checker repo and move this
 */

import $ from 'jquery';
import bsp_utils from 'bsp-utils';

var bsp_scroll_checker = {

	defaults: {

	},

    init: function($el, options) {

    	var self = this;
    	self.$el = $el;
    	self.settings = $.extend({}, self.defaults, options);

    	self.$body = $('body');
    	self.$window = $(window);

    	self._adjustClass();

	    self.$window.on('scroll', bsp_utils.throttle(100,function() {

	    	self._adjustClass();

	    }));
    },

    _adjustClass: function () {
    	var self = this;

    	if(self.$body.height() > self.$window.height()) {

	    	if(window.scrollY > 0) {
	    		self.$body.addClass('bsp-scrolling');
	    	} else {
	    		self.$body.removeClass('bsp-scrolling');
	    	}

	    }
    }


};

export default bsp_scroll_checker;
