import $ from 'node_modules/jquery/dist/jquery.js'

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
      '-1': this.updateSettings
    }

    this.$ctx = $ctx

    this.settings = $.extend({ }, {
      muted: this.$ctx[0].hasAttribute(`data-muted`),
      selectors: {
        blockName: `YouTubeVideoPlayer`
      }
    }, options)

    this.$ctx.data('player-instance', this)

    if (!window.YouTubeAPIReady) {
      this.injectYouTubeAPI()
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

  injectYouTubeAPI () {
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

  updateView ($newVideo) {
    this.player.loadVideoById($newVideo.attr('data-video-id'))
  }

  updateSettings () {

  }
}
