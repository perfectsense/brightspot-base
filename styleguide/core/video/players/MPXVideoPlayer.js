import $ from 'node_modules/jquery/dist/jquery.js'
import { isPDKloaded, isMobileUA } from '../../Utils.js'

// PDK Event reference: https://docs.theplatform.com/help/article/link/player-pdkevent-reference

export class MPXVideoPlayer {

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

  get playerXml () {
    return this._playerXml
  }

  set playerXml (xml) {
    this._playerXml = xml
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
      autoplay: this.$ctx[0].hasAttribute(`data-autoplay`),
      playerIdPrefix: 'mpxPlayer',
      selectors: {
        blockName: 'MPXVideoPlayer'
      }
    }, options)

    this.$ctx.data('player-instance', this)

    this.playerId = this.$ctx.attr('id')

    this.playerXml = `<?xml version='1.0'?>
      <layout>
          <controls>
              <region id='tpBottomFloatRegion'>
                  <row paddingTop="20">
                      <spacer width="10%" />
                      <control id='tpPlay' />
                      <control id='tpMute' />
                      //<spacer width="5%" />
                      <group>
                          <control id='tpCurrentTime'/>
                          <control id='tpScrubber'/>
                          <control id='tpTotalTime'/>
                      </group>
                      //<spacer width="5%" />
                      <control id='tpFullScreen' scaleIcon='true' />
                      <spacer width="10%" />
                  </row>
              </region>
          </controls>
      </layout>`

    this.$ctx.find('iframe' + '#mpxPlayer' + this.playerId).off('load').on('load', () => {
      this.playerController = window.videoPlayerControllers[this.playerId]

      let checkForPDKReady = setInterval(() => {
        if (isPDKloaded()) {
          clearInterval(checkForPDKReady)
          this.playerController.addEventListener('OnReleaseStart', (e) => { this.onMediaReady(e) })
          this.playerController.addEventListener('OnMediaStart', (e) => { this.onMediaStart(e) })
          this.playerController.addEventListener('OnMediaPlaying', (e) => { this.onMediaPlaying(e) })
          this.playerController.addEventListener('OnReleaseEnd', (e) => { this.onMediaEnded(e) })
          this.playerController.addEventListener('OnMute', (e) => { this.onPlayerMute(e) })
          this.playerController.addEventListener('OnMediaPause', (e) => { this.onPlayerPause(e) })
          this.playerController.addEventListener('OnMediaUnpause', (e) => { this.onPlayerUnpause(e) })

          this.init()
        }
      }, 100)
    })
  }

  init () {
    if (this.autoplay === false || isMobileUA()) {
      this.playerController.loadReleaseURL(this.$ctx.attr('data-hls-url'), true)
    } else {
      this.playerController.setReleaseURL(this.$ctx.attr('data-hls-url'), true)
    }
  }

  // Listening on Muted state
  onPlayerMute (event) {
    let muted = event.data
    this.$ctx.attr('data-video-muted', muted)
    this.$ctx.parent().parent('.VideoMain').attr('data-video-muted', muted)
  }

  onPlayerPause (event) {
    this.$ctx.trigger('VideoMain:onVideoPlaybackStopped', {
      playerId: this.playerId
    })
  }

  onPlayerUnpause (event) {
    this.$ctx.trigger('VideoMain:onVideoPlaybackStarted', {
      playerId: this.playerId,
      companionPlayer: this.settings.companionPlayer
    })
  }

  onMediaReady (event) {
    this.$ctx.trigger('VideoMain:onVideoLoaded', {})
  }

  onMediaStart (event) {
    if (this.autoplay === false || isMobileUA()) {
      this.playerController.setPlayerLayoutXml(this.playerXml)
    }

    let seekTo = this.$ctx.attr('data-seek-seconds')
    if (seekTo) {
      seekTo *= 1000
      setTimeout(() => this.playerController.seekToPosition(seekTo), 200)
    }

    this.$ctx.attr('data-playback-started', '')

    this.$ctx.trigger('VideoMain:onVideoPlaybackStarted', {
      playerId: this.playerId
    })
  }

  onMediaPlaying (event) {
    let data = event.data

    this.$ctx.trigger('VideoMain:onPlaybackTimeUpdate', {
      secondsElapsed: data.currentTime / 1000
    })
  }

  onMediaEnded (event) {
    this.$ctx.trigger('VideoMain:onVideoEnded', {
      playerId: this.playerId
    })
  }

  play () {
    this.playerController.setReleaseURL(this.$ctx.attr('data-hls-url'), true)
  }

  updateView ($newVideo) {
    // update the HLS url
    this.$ctx.attr('data-hls-url', $newVideo.attr('data-hls-url'))
    // update the seek time
    this.$ctx.attr('data-seek-seconds', $newVideo.attr('data-seek-seconds') || '')
    // re-init
    this.init()
  }

}
