import $ from 'node_modules/jquery/dist/jquery.js'

// YouTube API Reference https://developers.google.com/youtube/iframe_api_reference

export class YouTubeVideoPlayer {

  get player () {
    return this._player
  }

  set player (_player) {
    this._player = _player
  }

  get videoId () {
    return this.$ctx.attr(`data-video-id`)
  }

  set videoId (_videoId) {
    this.$ctx.attr(`data-video-id`, _videoId)
  }

  get playerId () {
    return this.$ctx.find(`iframe`).attr(`id`)
  }

  set playerId (_id) {
    this.$ctx.find(`iframe`).attr(`id`, _id)
  }

  constructor ($ctx, options = {}) {
    /*
    -1 (unstarted)
    0 (ended)
    1 (playing)
    2 (paused)
    3 (buffering)
    5 (video cued).
    */
    this.stateChangeHandlers = {
      '1': this.onPlaying.bind(this)
    }

    this.$ctx = $ctx
    this.$ctx.data('player-instance', this)

    this.settings = $.extend({ }, {
      muted: this.$ctx[0].hasAttribute(`data-muted`),
      selectors: {
        blockName: `YouTubeVideoPlayer`
      }
    }, options)

    if (!window.YouTubeAPIReady) {
      this.loadYouTubeApi()
    }

    window.onYouTubeIframeAPIReady = () => {
      window.YouTubeAPIReady = true
      this.player = new window.YT.Player(`${this.playerId}`, {
        videoId: `${this.videoId}`,
        events: {
          onReady: this.onPlayerReady.bind(this),
          onStateChange: this.onStateChange.bind(this)
        }
      })
    }
  }

  loadYouTubeApi () {
    let tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    let firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  }

  onPlayerReady (event) {
    if (this.settings.muted) {
      event.target.mute()
    }
  }

  onStateChange (event) {
    let state = event.data
    console.info(`YouTube Player onStateChange: ${state}`)
    this.stateChangeHandlers[state]
    ? this.stateChangeHandlers[state]()
    : console.info(`stateChangeHandler for state named '${state}' has not been implemented`)
  }

  updateView ($newVideoPlayer) {
    this.player.loadVideoById($newVideoPlayer.attr('data-video-id'))
  }

  onPlaying () {
    this.$ctx.attr('data-playback-started', '')
  }

  play () {
    this.player.playVideo()
  }
}
