/** @todo move to bsp-carousel repo */
import $ from 'jquery';
import bsp_carousel from 'bsp-carousel';

export default {
	init($el, options) {
		this.$el = $el;
		this.options = options;
		this.saveElements();
		this.buildCarousel();
		this.addThumbnailNav();
		this.addEvents();
	},
	saveElements() {
		this.$counter = this.$el.find('.bsp-carousel-gallery-count');
		this.$carousel = this.$el.find('.bsp-carousel-gallery');
		this.$thumbnails = this.$el.find('.bsp-carousel-gallery-thumbnails');
		this.$openThumbnails = this.$el.find('.bsp-carousel-gallery-footer-thumbnails-link a');
		this.$closeThumbnails = this.$el.find('.bsp-carousel-gallery-thumbnails-close-link');
	},
	buildCarousel() {
		this.carousel = Object.create(bsp_carousel);
		this.carousel.init(this.$carousel, this.options);
	},
	addThumbnailNav() {
		var self = this;
		this.$openThumbnails.on('click', (e) => {
			self.showThumbnails();
			e.preventDefault();
		});
		this.$closeThumbnails.on('click', (e) => {
			self.hideThumbnails();
			e.preventDefault();
		});
		this.$thumbnails.find('.bsp-carousel-gallery-thumbnail').on('click', (e) => {
			var index = $(this).data('index');
			self.gotoSlide(index);
			e.preventDefault();
		});
	},
	addEvents() {
		var self = this;
		this.$carousel.on('carousel:init carousel:afterChange', () => {
			self.$counter.html((self.carousel.currentSlide()+1) + ' of ' + self.carousel.slideCount());
		});
	},
	showThumbnails() {
		this.$thumbnails.addClass('visible');
	},
	hideThumbnails() {
		this.$thumbnails.removeClass('visible');
	},
	gotoSlide(i) {
		this.hideThumbnails();
		this.carousel.goTo(i+1);
	}
};