import $ from 'node_modules/jquery/dist/jquery.js'

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

  get activePlaylistItem () {
    return $(this.selectors.playlistItemsWrapper).find(`${this.selectors.playlistItem}[${this.selectors.activeAttribute}]`)
  }

  constructor ($ctx, options = {}) {
    this.$ctx = $ctx

    this.settings = $.extend({}, {
      selectors: {
        activeAttribute: `data-active`,
        content: `.VideoMain-content`,
        playlistItemsWrapper: `.VideoMain-playlist .Cluster-items`,
        playlistItem: `.Cluster-items-item .VideoPlayerPromo`
      }
    }, options)

    if (this.$ctx) {
      this.init()
    }
  }

  init () {
    // Binds click on playlist items
    $(this.selectors.playlistItemsWrapper).find(this.selectors.playlistItem).on('click', (event) => {
      event.preventDefault()
      event.stopPropagation()

      let $playlistItem = $(event.currentTarget)
      let url = $playlistItem.attr('data-ajax-url')

      this.$ctx.trigger('VideoMain:onPlaylistItemClick', {
        url: url
      })

      let $activePlaylistItem = this.activePlaylistItem
      if ($activePlaylistItem.length) {
        $activePlaylistItem.removeAttr(this.selectors.activeAttribute)
      }

      $playlistItem.attr(this.selectors.activeAttribute, '')

      this.fetchView(url)
    })

    this.$ctx.trigger('VideoMain:onVideoLoaded', {})
  }

  fetchView (url) {
    $.ajax({
      url: url
    })
    .done((response) => {
      this.updateView($(response))
      this.$ctx.trigger('VideoMain:onViewReplaced', {})
    })
    .fail((data) => {
      console.error('"VideoMain.fetchView()" failed')
    })
  }

  updateView ($html) {
    if (this.$ctx) {
      let $newVideoMain = $html
      this.$ctx.attr('id', $newVideoMain.attr('id'))
      this.videoPlayer.updateView($newVideoMain.find('[itemprop="video"]'))
      this.$ctx.find(this.selectors.content).replaceWith($html.find(this.selectors.content))
    } else {
      $(this.settings.updateTarget).after($html)
      this.$ctx = $html
    }

    this.reset()
    this.init()
  }

  reset () {
    $(this.selectors.playlistItemsWrapper).find(this.selectors.playlistItem).off('click')
  }
}
