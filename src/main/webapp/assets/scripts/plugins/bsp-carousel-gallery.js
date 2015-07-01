/** @todo move to bsp-carousel repo */
import $ from 'jquery';
import bsp_carousel from 'bsp-carousel';

export default {
	init: ($el, options) => {
		$el.addClass('bsp-carousel-gallery');
		Object.create(bsp_carousel).init($el, options);
	}
};