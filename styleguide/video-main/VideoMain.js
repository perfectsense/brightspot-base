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
        infoCard: '.InfoCard ',
        infoCardHeadline: '.InfoCard-headline',
        infoCardTitle: '.InfoCard-title',
        companionPromo: '.CompanionPromo',
        companionsWrapper: '.VideoMain-details-companionsWrapper',
        infoWrapper: '.VideoMain-details-infoWrapper'
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

        // TODO: refactor this
    let $videoMainTabs = this.$ctx.find('.VideoMain-tabs')
    if ($videoMainTabs.length) {
            // Toggles the active tab
      $videoMainTabs.children().on('click', (evt) => {
        let $el = $(evt.target)
        evt.preventDefault()

        // Only returns a [data-active] sibling, not the original element
        let currentActiveTab = $el.siblings('[data-active]')

        // These flags will only return true if the queried name is a sibling
        // of the clicked tab and that sibling tag is active
        let isSiblingCompanionAndActive = (currentActiveTab.attr('name') === 'companions')
        let isSiblingInfoAndActive = (currentActiveTab.attr('name') === 'info')

        if (isSiblingCompanionAndActive) {
          $(this.selectors.companionsWrapper).removeAttr('data-is-visible')
          $(this.selectors.infoWrapper).attr('data-is-visible', '')
        } else if (isSiblingInfoAndActive) {
          $(this.selectors.companionsWrapper).attr('data-is-visible', '')
          $(this.selectors.infoWrapper).removeAttr('data-is-visible')
        }

        currentActiveTab.removeAttr('data-active')
        $el.attr('data-active', '')
      })

            // Binds click on companion promos
      $(this.selectors.companionsWrapper).find(this.selectors.companionPromo).on('click', (e) => {
        e.preventDefault()
        e.stopPropagation()

        let $companion = $(e.currentTarget)
        this.$ctx.trigger('VideoMain:onCompanionClick', {
          url: $companion.attr('data-ajax-url'),
          mediaType: $companion.attr('data-media-type')
        })
      })
    }

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
