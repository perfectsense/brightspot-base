import bsp_toggle from '../../../src/main/webapp/assets/scripts/plugins/bsp-toggle-item';
import $ from 'jquery';

describe('bsp-toggle', () => {

	xit('should have expected default options set', () => {
		expect(bsp_toggle._defaultOptions.toggleItem).toBe('.toggle-item');
		expect(bsp_toggle._defaultOptions.toggleTrigger).toBe('.toggle-trigger');
	});
	
});