import $ from 'jquery';
import bsp_carousel_gallery from '../../../src/main/webapp/assets/scripts/plugins/bsp-carousel-gallery';

describe('bsp-carousel-gallery utility', () => {

	describe('init specs', () => {
		var gallery;

		beforeEach(() => {
			gallery = Object.create(bsp_carousel_gallery);
		});

		it('should save element and options to the object on init', () => {
			var $el = $('<div></div>');
			var options = { test: 'test' };
			gallery.init($el, options);
			expect(gallery.$el).toEqual($el);
			expect(gallery.options).toEqual(options);
		});

		it('should call expected methods', () => {
			spyOn(gallery, 'saveElements');
			spyOn(gallery, 'buildCarousel');
			spyOn(gallery, 'addThumbnailNav');
			gallery.init( $('<div></div>'), {} );
			expect(gallery.saveElements).toHaveBeenCalled();
			expect(gallery.buildCarousel).toHaveBeenCalled();
			expect(gallery.addThumbnailNav).toHaveBeenCalled();
		});

	});



});