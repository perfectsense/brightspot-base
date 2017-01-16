import $ from 'node_modules/jquery/dist/jquery.js'
import { isPDKloaded, isMobileUA } from '../../Utils.js'

// PDK Event reference: https://docs.theplatform.com/help/article/link/player-pdkevent-reference

export class HTML5VideoPlayer {
  get playerId () {
    return this._id
  }

  set playerId (id) {
    this._id = id
  }

  get playerController () {
    return this._playerController
  }

  set playerController (controller) {
    this._playerController = controller
  }

  get selectors () {
    return this.settings.selectors
  }

  get autoplay () {
    return this.settings.autoplay
  }

  constructor ($ctx, options = {}) {
    this.$ctx = $ctx

    this.settings = $.extend({ }, {
      autoplay: true,
      playerIdPrefix: 'HTML5Player',
      selectors: {
        blockName: 'HTML5VideoPlayer'
      }
    }, options)

    this.$ctx.data('player-instance', this)

    this.playerId = this.$ctx.attr('id')
  }

  updateView ($newVideo) {
    // update the HLS url
    this.$ctx.html($newVideo.html())
  }

}
