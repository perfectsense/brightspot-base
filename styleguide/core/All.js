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
import $ from 'node_modules/jquery/dist/jquery.js'
import TextInput from './TextInput.js'
import TextAreaInput from './TextAreaInput.js'
import Gallery from './GalleryMain.js'
import { VideoMain } from './VideoMain.js'
import bspCarouselPlugin from 'bsp-carousel-plugin'
/* eslint-enable no-unused-vars */

$(document).ready(function () {
  window.videoPlayers = []
  window.videoPlayerControllers = []

  window.registerPlayer = function (player, id) {
    window.videoPlayers.push(player)
  }

  window.registerPlayerController = function (controller, id) {
    window.videoPlayerControllers[id] = controller
  }

  // VideoMain binding
  let $videoMain = $('.VideoMain')
  if ($videoMain.length) {
    window.videoMain = new VideoMain($videoMain, { })
  }
})

export default {}
