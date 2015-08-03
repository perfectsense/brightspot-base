/**
 * Spec needs an import statement because systemjs/babel won't
 * parse this as es6 without one for some reason. It may be there
 * is a comment flag we could put at the top instead.
 */
import $ from 'jquery';

describe('a test spec to make sure the test runner is functioning', () => {
	it('should run a test spec', () => {
		expect(true).toBe(true);
	});
});