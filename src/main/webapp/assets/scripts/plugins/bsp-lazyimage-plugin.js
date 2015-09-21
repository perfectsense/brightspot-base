/*
 * TODO: Update lazyimage to 1.0.0 and put this in the brightspot-js-lazyimage repo
 *
 * Plugin for lazy loading images
 *
 * On initial page load, this plugin performs it's tasks on any images that in the viewport or above the viewport. We do this on
 * purpose, so that if were to scroll back up, the page won't jump with images above lazy loading themselves. The viewport offset
 * can be set as an option.
 *
 * Options:
 *
 * offset: The offset can be set per image or for the whole site by specifying the option at the html element level. This offset
 *         will trigger the image to load X pixels before it comes into the viewport
 *
 * throttleInterval: The throttle interval can be set for the whole site by specifying the option at the html element level. This is
 *                   the interval at which we poll the scroll event and mutation event (detecting hidden items)
 *
 * Examples of syntax:
 *
 * 1) <span data-bsp-lazyimage data-lazy="asdf.jpg" alt="asdf" class="asdf"></span>
 *
 * 2) <img data-bsp-lazyimage data-lazy="asdf.jpg" alt="asdf" class="asdf"></img>
 *
 * 3) <div data-bsp-lazyimage>
 *        <span data-lazy="asdf.jpg" alt="asdf" class="asdf"></span>
 *        <span data-lazy="asdf.jpg" alt="asdf" class="asdf"></span>
 *    </div>
 *
 * 4) <picture class="asdf" data-bsp-lazyimage>
 *        <source data-lazy="/asdf.jpg" media="(max-width: 767px)">
 *        <img data-lazy="asdf.jpg" alt="Responsive Image">
 *    </picture>
 */

import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import bsp_lazyimage from './bsp-lazyimage';

export default bsp_utils.plugin(false, 'bsp', 'lazyimage', {
    // when we install the plugin, we create our instance, which setup up the event bindings
    _install: function() {
        var self = this;

        self.lazyLoaderInstance = Object.create(bsp_lazyimage);

        self.lazyLoaderInstance.init(document);

        self.lazyLoaderInstance.createCheckListeners();
    },

    // each time stuff gets added to the DOM, pass everything that was added to the the lazy loader instance
    '_all': function(items) {
        var self = this;

        // self.option(item) allows us to set overrides to the lazy loader utility in the DOM
        // ex: <html lang="en" data-bsp-lazyimage-options='{"loadedClass":"uvn-lazy-loaded"}'>
        self.lazyLoaderInstance.addItems(items, self.option(items));
    }
});
