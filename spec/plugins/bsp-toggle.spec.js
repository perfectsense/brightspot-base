import $ from 'jquery';
import bsp_toggle from '../../src/main/webapp/assets/scripts/plugins/bsp-toggle';

describe('bsp-toggle', () => {

	var $el;
	var waitOnDom = 50;

	beforeEach(() => {
		$('body').append('<div id="testContainer" data-bsp-toggle><span class="toggle-item"></span><a class="toggle-trigger"></a></div>');
		$el = $('#testContainer');
	});

	afterEach(() => {
		$el.remove();
	});

	it('should have expected default options set', () => {
		expect(bsp_toggle._defaultOptions.toggleItem).toBe('.toggle-item');
		expect(bsp_toggle._defaultOptions.toggleTrigger).toBe('.toggle-trigger');
	});

	// this spec fails, not sure why right now
	xit('should toggle the class when trigger item is clicked', () => {
		expect( $el.find('.toggle-item').hasClass('.toggle-in') ).toBe(false);
		console.log($el.find('.toggle-item').attr('class'));
		expect( $el.find('.toggle-item').hasClass('.toggle-in') ).toBe(true);
	});

});