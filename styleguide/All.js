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

/* eslint-disable no-unused-vars */
import TextInput from './form/TextInput.js'
import TextAreaInput from './form/TextAreaInput.js'

import Gallery from './gallery-main/GalleryMain.js'

import MPXVideo from './video-main/MPXVideoPlayer.js'
import Video from './video-main/VideoMain.js'

export default {}
/* eslint-enable no-unused-vars */
