/* eslint-disable no-unused-vars */
import $ from 'node_modules/jquery/dist/jquery.js'
import TextInput from './TextInput.js'
import TextAreaInput from './TextAreaInput.js'
import Gallery from './gallery/Gallery.js'
import { VideoMain } from './VideoMain.js'
import bspCarouselPlugin from 'bsp-carousel-plugin'
/* eslint-enable no-unused-vars */

$(document).ready(function () {
  /* eslint-disable no-new */

  // TextInput
  $('.TextInput').each((index, value) => {
    new TextInput($(value))
  })

  // TextAreaInput
  $('.TextAreaInput').each((index, value) => {
    new TextAreaInput($(value))
  })

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
