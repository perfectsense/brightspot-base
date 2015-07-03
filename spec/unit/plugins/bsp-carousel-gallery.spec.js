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

	describe('saveElements specs', () => {
		
		var gallery;

		beforeEach(() => {
			gallery = Object.create(bsp_carousel_gallery);
			gallery.$el = $('<div></div>');
		});

		it('should call the expected find functions and save expected vars', () => {
			spyOn(gallery.$el, 'find').and.callFake((selector) => {
				return selector;
			});
			gallery.saveElements();
			expect(gallery.$carousel).toBe('.bsp-carousel-gallery');
			expect(gallery.$thumbnails).toBe('.bsp-carousel-gallery-thumbnails');
			expect(gallery.$openThumbnails).toBe('.bsp-carousel-gallery-footer-thumbnails-link a');
			expect(gallery.$closeThumbnails).toBe('.bsp-carousel-gallery-thumbnails-close-link');
		});

	});

	describe('buildCarousel specs', () => {
		var gallery;

		beforeEach(() => {
			gallery = Object.create(bsp_carousel_gallery);
			gallery.$carousel = $('<div></div>');
			gallery.options = { 'test': 'test' };
		});

		it('should create a carousel and save it to the gallery object', () => {
			var carousel = {
				init: jasmine.createSpy()
			};
			spyOn(Object, 'create').and.callFake(() => {
				return carousel;
			});
			gallery.buildCarousel();
			expect(carousel.init).toHaveBeenCalledWith(gallery.$carousel, gallery.options);
		});
	});

	describe('showThumbnails specs', () => {
		var gallery;

		beforeEach(() => {
			gallery = Object.create(bsp_carousel_gallery);
			gallery.$thumbnails = $('<div></div>');
		});

		it('should add the visible class to the thumbnails element', () => {
			spyOn(gallery.$thumbnails, 'addClass');
			gallery.showThumbnails();
			expect(gallery.$thumbnails.addClass).toHaveBeenCalledWith('visible');
		});
	});

	describe('addThumbnailNav specs', () => {
		var gallery;

		beforeEach(() => {
			gallery = Object.create(bsp_carousel_gallery);
			gallery.$openThumbnails = $('<div></div>');
			gallery.$closeThumbnails = $('<div></div>');
			gallery.$thumbnails = $('<div></div>');
		});

		it('should add expected events to openThumbnails', () => {
			var event;
			var callback;
			spyOn(gallery, 'showThumbnails');
			spyOn(gallery.$openThumbnails, 'on').and.callFake((e, cb) => {
				event = e;
				callback = cb;
			});
			gallery.addThumbnailNav();
			expect(event).toBe('click');
			callback({ preventDefault : () => {} });
			expect(gallery.showThumbnails).toHaveBeenCalled();
		});

		it('should add expected events to closeThumbnails', () => {
			var event;
			var callback;
			var fakeEvent = {
				preventDefault: jasmine.createSpy()
			};
			spyOn(gallery, 'hideThumbnails');
			spyOn(gallery.$closeThumbnails, 'on').and.callFake((e, cb) => {
				event = e;
				callback = cb;
			});
			gallery.addThumbnailNav();
			expect(event).toBe('click');
			callback(fakeEvent);
			expect(gallery.hideThumbnails).toHaveBeenCalled();
			expect(fakeEvent.preventDefault).toHaveBeenCalled();
		});

		it('should add expected events to thumbnails', () => {
			var attr;
			var event;
			var fakeEvent = {
				preventDefault: jasmine.createSpy()
			};
			var callback;
			var $testEle = $('<div></div>');
			spyOn(gallery.$thumbnails, 'find').and.callFake(() => {
				return $testEle;
			});
			spyOn($testEle, 'on').and.callFake((e, cb) => {
				event = e;
				callback = cb;
			});
			spyOn($.fn, 'data').and.callFake((a) => {
				attr = a;
				return 2;
			});
			spyOn(gallery, 'gotoSlide');
			gallery.addThumbnailNav();
			callback(fakeEvent);
			expect(attr).toBe('index');
			expect(event).toBe('click');
			expect(gallery.$thumbnails.find).toHaveBeenCalledWith('.bsp-carousel-gallery-thumbnail');
			expect(fakeEvent.preventDefault).toHaveBeenCalled();
			expect(gallery.gotoSlide).toHaveBeenCalledWith(2);
		});
	});

	describe('hideThumbnails specs', () => {
		var gallery;

		beforeEach(() => {
			gallery = Object.create(bsp_carousel_gallery);
			gallery.$thumbnails = $('<div></div>');
		});

		it('should remove the visible class from the thumbnails element', () => {
			spyOn(gallery.$thumbnails, 'removeClass');
			gallery.hideThumbnails();
			expect(gallery.$thumbnails.removeClass).toHaveBeenCalledWith('visible');
		});
	});

	describe('gotoSlide specs', () => {
		var gallery;

		beforeEach(() => {
			gallery = Object.create(bsp_carousel_gallery);
			gallery.carousel = {
				goTo: jasmine.createSpy()
			};
		});

		it('should call expected functions', () => {
			spyOn(gallery, 'hideThumbnails');
			gallery.gotoSlide(2);
			expect(gallery.hideThumbnails).toHaveBeenCalled();
			expect(gallery.carousel.goTo).toHaveBeenCalledWith(3);
		});
	});

});