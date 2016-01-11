/**
 * Our main JS file which is used to compile the JS by including any plugins that are used throughout the project
 * Base has as little JS in it as possible. We try to use reusable JS plugins that have their own repos and can be
 * used across multiple projects. We then compile them in, by bringing them in via bower and they get copied
 * via the bsp-grunt task from their respective repos and compiled in with this file.
 *
 * If you have any project specific JS that you need to write, put it into your own scripts/plugins folder
 * and import from there.
 *
 * If you are going to use any plugins that don't come with base and base components, designate them in your
 * own bower.json and copy them into the scripts/bower folder via a Gruntfile entry
 */
import bsp_ajax_links_plugin from           'bsp-ajax-links-plugin';
import bsp_carousel_plugin from             'bsp-carousel-plugin';
import bsp_carousel_thumbnav_plugin from    'bsp-carousel-thumbnav-plugin';
import bsp_carousel_gallery_plugin from     'bsp-carousel-gallery-plugin';
import bsp_infinite_content_plugin from     'bsp-infinite-content-plugin';
import bsp_lazyimage_plugin from            'bsp-lazyimage-plugin';
import bsp_modal_plugin from                'bsp-modal-plugin';
import bsp_share from                       'bsp-share';
import bsp_tabber_plugin from               'bsp-tabber-plugin';
import bsp_toggle_plugin from               'bsp-toggle-item-plugin';

/**
 * These are Base specific JS plugins. These are not generic enough to have their own repo, so we put them in the base plugins
 * folder, and they can be compiled in, if you need to use them
 */
import base_example from              'base/plugins/base-example-plugin';


import bsp_commenting from             'community/commenting-plugin';

export default {};
