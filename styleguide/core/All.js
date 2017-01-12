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
  $('.Gallery, .GalleryMain').each((index, value) => {
    let gallery = new Gallery($(value), {})
    // Get options from the data-bsp-gallery-options attribute
    // let options = this.option(item)

    // Save the Gallery object on the element so it can be accessed later if necessary
    $(value).data('bsp-gallery', gallery)

    // Run it!
    gallery.init()
  })

  window.videoPlayerControllers = []

  window.registerPlayerController = function (controller, id) {
    window.videoPlayerControllers[id] = controller
  }

  // MPXVideoPlayer bindings
  $('.MPXVideoPlayer').each((index, value) => {
    let player = new MPXVideoPlayer($(value), { })

    // MPXVideo Card behaviors
    $(`.MPXVideoPlayer-card .Promo-cta`).on(`click`, (event) => {
      player.play()
    })
  })

  // YouTubeVideoPlayer bindings
  $('.YouTubeVideoPlayer').each((index, value) => {
    let player = new YouTubeVideoPlayer($(value), { })

    // YouTubeVideo Card behaviors
    $(`.YouTubeVideoPlayer-card .Promo-cta`).on(`click`, (event) => {
      player.play()
    })
  })

  // HTML5Player bindings
  $('.HTML5VideoPlayer').each((index, value) => {
    let player = new HTML5VideoPlayer($(value), { })
  })

  // VideoMain binding
  let $videoMain = $('.VideoMain')
  if ($videoMain.length) {
    window.videoMain = new VideoMain($videoMain, { })
  }
})

export default {}
