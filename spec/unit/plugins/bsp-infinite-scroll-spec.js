import bsp_infinite from '../../../src/main/webapp/assets/scripts/plugins/bsp-infinite-scroll';
import $ from 'jquery';

describe('bsp-infinite', () => {

	it('should have expected default options set', () => {
		expect(bsp_infinite._defaultOptions.itemSel).toBe('.bsp-infinite-load-item');
		expect(bsp_infinite._defaultOptions.triggerSel).toBe('.bsp-infinite-load-trigger');
	});
	
});