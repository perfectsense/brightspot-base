import $ from 'node_modules/jquery/dist/jquery.js'
import { MPXVideoPlayer } from './MPXVideoPlayer.js'

export class VideoMain {

  $ctx ($el) {
    this.$ctx = $el
  }

  get selectors () {
    return this.settings.selectors
  }

  set permalink (str) {
    this.$ctx.attr('data-permalink', str)
  }

  get permalink () {
    return this.$ctx.attr('data-permalink')
  }

  get videoUrl () {
    return this.$video.attr('data-hls-url')
  }

  get $video () {
    return this.$ctx.find('video')
  }

  get videoPlayer () {
    return this._videoPlayer
  }

  set videoPlayer (player) {
    this._videoPlayer = player
  }

  constructor ($ctx, options = {}) {
    this.$ctx = $ctx

    this.settings = $.extend({}, {
      selectors: {
        playlistItemsWrapper: `.VideoMain-playlist .Cluster-items`,
        playlistItem: `.Cluster-items-item .VideoPlayerPromo`
      }
    }, options)

    if (this.$ctx) {
      this.init()
    }
  }

  init () {
    if (!this.videoPlayer) {
      // MPXVideoPlayer bindings (TODO: move this out to a method)
      this.$ctx.find('.MPXVideoPlayer').each((index, value) => {
        this.videoPlayer = new MPXVideoPlayer($(value))
        window.registerPlayer(this.videoPlayer, this.videoPlayer.playerId)
      })
    }

    // Binds click on playlist items
    $(this.selectors.playlistItemsWrapper).find(this.selectors.playlistItem).on('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      debugger
      let $playlistItem = $(event.currentTarget)
      this.$ctx.trigger('VideoMain:onPlaylistItemClick', {
        url: $playlistItem.attr('data-ajax-url')
      })
    })

    this.$ctx.trigger('VideoMain:onVideoLoaded', {})
  }

  fetchView (url) {
    $.ajax({
      url: url,
      async: false
    })
    .done((response) => {
      this.updateView($(response))
      this.$ctx.trigger('VideoMain:onViewReplaced', {})
    })
    .fail((data) => {
      console.error('"VideoMain.fetchView()" failed')
    })
  }

  updateVideoUrl (url) {
    this.$ctx.trigger('VideoMain:onUpdateVideoUrl', {
      videoUrl: url
    })
  }

  updateView ($html) {
    if (this.$ctx) {
      let $newVideoMain = $html
      this.$ctx.attr('id', $newVideoMain.attr('id'))
      this.videoPlayer.updateView($newVideoMain.find('[itemprop="video"]'))
      this.$ctx.find('.VideoMain-details').replaceWith($html.find('.VideoMain-details'))
    } else {
      $(this.settings.updateTarget).after($html)
      this.$ctx = $html
    }

    this.init()
  }

  resetVideo () {
    this.$ctx.removeAttr('data-video-min')
  }

  minimizeVideo () {
    this.$ctx.attr('data-video-min', '')
  }
}
