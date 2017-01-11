/* eslint-disable no-unused-vars */
import $ from 'node_modules/jquery/dist/jquery.js'
import Gallery from './gallery/Gallery.js'
import { VideoMain } from './video/VideoMain.js'
import { MPXVideoPlayer } from './video/players/MPXVideoPlayer.js'
import { HTML5VideoPlayer } from './video/players/HTML5VideoPlayer.js'
import { YouTubeVideoPlayer } from './video/players/YouTubeVideoPlayer.js'
import bspCarouselPlugin from 'bsp-carousel-plugin'
/* eslint-enable no-unused-vars */

$(document).ready(function () {
  /* eslint-disable no-new */

  // Gallery binding
  $('.Gallery').each((index, value) => {
    let gallery = new Gallery($(value), {})
    // Get options from the data-bsp-gallery-options attribute
    // let options = this.option(item)

    // Save the Gallery object on the element so it can be accessed later if necessary
    $(value).data('bsp-gallery', gallery)

    // Run it!
    gallery.init()
  })

  window.videoPlayers = []
  window.videoPlayerControllers = []

  window.registerPlayer = function (player) {
    window.videoPlayers.push(player)
  }

  window.registerPlayerController = function (controller, id) {
    window.videoPlayerControllers[id] = controller
  }

  // MPXVideoPlayer bindings
  $('.MPXVideoPlayer').each((index, value) => {
    let player = new MPXVideoPlayer($(value), { })
    window.registerPlayer(player)
  })

  // YouTubeVideoPlayer bindings
  $('.YouTubeVideoPlayer').each((index, value) => {
    let player = new YouTubeVideoPlayer($(value), { })
    window.registerPlayer(player)
  })

  // HTML5Player bindings
  $('.HTML5VideoPlayer').each((index, value) => {
    let player = new HTML5VideoPlayer($(value), { })
    window.registerPlayer(player)
  })

  // VideoMain binding
  let $videoMain = $('.VideoMain')
  if ($videoMain.length) {
    window.videoMain = new VideoMain($videoMain, { })
  }
})

export default {}
