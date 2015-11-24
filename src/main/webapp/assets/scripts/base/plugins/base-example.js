import $ from 'jquery';
import bsp_utils from 'bsp-utils';

var bsp_example = {

	defaults: {

	},

    init: function($el, options) {

    	var self = this;
    	self.$el = $el;
    	self.settings = $.extend({}, self.defaults, options);

    	self._privateFunction();

    },

    _privateFunction: function () {
    	var self = this;

    	// Do private things here
    }


};

export default bsp_example;
