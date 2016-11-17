import $ from 'jquery.js'
import { isPDKloaded, isMobileUA } from 'Utils.js'

// PDK Event reference: https://docs.theplatform.com/help/article/link/player-pdkevent-reference

export class MPXVideoPlayer {

    get playerId () {
        return this._id
    }

    set playerId (id) {
        this._id = id
    }

    get fullScreen () {
        return this._fullScreen
    }

    set fullScreen (fullScreen) {
        this._fullScreen = fullScreen
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
            autoplay: true,
            companionPlayer: false,
            playerIdPrefix: "mpxPlayer",
            selectors: {
                blockName: 'MPXVideoPlayer',
                introCard: '-introCard',
                videoMinimizeButton:       '.MPXVideoPlayer-overlay-minimizeButton',
                videoVolumeButton:         '.MPXVideoPlayer-overlay-volumeButton'
            }
        }, options)

        this.playerId = this.$ctx.attr('id')
        this.fullScreen = false

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

        this.$ctx.find('iframe' + '#mpxPlayer' + this.playerId).off('load').on('load', ()=> {

            this.playerController = window.videoPlayerControllers[this.playerId]

            let checkForPDKReady = setInterval(()=> {
                if (isPDKloaded()) {
                    clearInterval(checkForPDKReady)
                    // OnPlayerLoaded event
                    // https://docs.theplatform.com/help/article/link/player-pdkevent-reference#PdkEventreference-OnPlayerLoaded
                    this.playerController.addEventListener("OnPlayerLoaded", (e)=> { this.onPlayerLoaded(e) })
                    this.playerController.addEventListener("OnReleaseStart", (e)=>{ this.onMediaReady(e) })
                    this.playerController.addEventListener("OnMediaStart", (e)=>{ this.onMediaStart(e) })
                    this.playerController.addEventListener("OnMediaPlaying", (e)=>{ this.onMediaPlaying(e) })
                    this.playerController.addEventListener("OnReleaseEnd", (e)=>{ this.onMediaEnded(e) })
                    this.playerController.addEventListener('OnMute', (e)=> { this.onPlayerMute(e) })
                    this.playerController.addEventListener('OnMediaPause', (e)=> { this.onPlayerPause(e) })
                    this.playerController.addEventListener('OnShowFullScreen', (e)=> { this.onFullScreen(e) })
                    this.playerController.addEventListener('OnMediaUnpause', (e)=> { this.onPlayerUnpause(e) })

                    this.init()
                }
            }, 100)
        })

    }

    init () {

        let count = 0

        if (this.autoplay == false || isMobileUA()) {
            this.playerController.loadReleaseURL(this.$ctx.attr('data-hls-url'), true)
        }
        else {
            this.playerController.setReleaseURL(this.$ctx.attr('data-hls-url'), true)
        }

        $(this.selectors.videoMinimizeButton).on({
            'click': (event)=> {
                this.$ctx.trigger('VideoMain:onMinimize', {})
            }
        })

        $(this.selectors.videoVolumeButton).on({
            'click': (event)=> {
                let id = this.$ctx.attr('id')
                this.$ctx.trigger('VideoMain:onVolumeChange', {
                    scopeId: id
                })

            }
        })
    }

    //Listening on Muted state
    onPlayerMute (event) {
        let muted = event.data
        this.$ctx.attr('data-video-muted', muted)
        this.$ctx.parent().parent('.VideoMain').attr('data-video-muted', muted)
    }

    onPlayerPause(event) {
        this.$ctx.trigger('VideoMain:onVideoPlaybackStopped', {
            playerId: this.playerId,
            fullScreen: this.fullScreen
        })
    }

    onPlayerUnpause(event) {
        this.$ctx.trigger('VideoMain:onVideoPlaybackStarted', {
            playerId: this.playerId,
            companionPlayer: this.settings.companionPlayer
        })
    }

    onPlayerLoaded (event) {
        // why doesn't this ever fire?
    }

    onMediaReady (event) {
        this.$ctx.trigger('VideoMain:onVideoLoaded', {})
    }

    onMediaStart (event) {

        if (this.autoplay == false || isMobileUA()) {
            this.playerController.setPlayerLayoutXml(this.playerXml)
        }

        let seekTo = this.$ctx.attr('data-seek-seconds')
        if (seekTo) {
            seekTo *= 1000
            this.playerController.seekToPosition(seekTo)
        }

        this.$ctx.trigger('VideoMain:onVideoPlaybackStarted', {
            playerId: this.playerId,
            companionPlayer: this.settings.companionPlayer
        })
    }

    onMediaPlaying (event) {
        let data = event.data

        this.$ctx.trigger('VideoMain:onPlaybackTimeUpdate', {
            secondsElapsed: data.currentTime / 1000
        })

        /*
        // video naturally ended.
        // This isn't exact because PDK never reaches 100 percentComplete for some reason
        if (Math.round(data.percentComplete) === 100) {
            this.playerController.removeEventListener("OnMediaPlaying", this.onMediaPlaying)
            this.$ctx.trigger('VideoMain:onVideoEnded', {
                percentComplete: data.percentComplete
            })
        }
        */
    }

    onMediaEnded (event) {

        this.$ctx.trigger('VideoMain:onVideoEnded', {
            suppressAutoAdvance: this.settings.companionPlayer,
            playerId: this.playerId
        })

    }

    onFullScreen (event) {
        this.fullScreen = event.data
    }

    play () {
        this.playerController.pause(false)
    }

    updateView ($newVideo) {
        // update the HLS url
        this.$ctx.attr('data-hls-url', $newVideo.attr('data-hls-url'))
        // update the seek time
        this.$ctx.attr('data-seek-seconds', $newVideo.attr('data-seek-seconds') || '')
        // replace the introCard DOM
        this.$ctx
            .find(`.${this.selectors.blockName}${this.selectors.introCard}`)
            .replaceWith($newVideo.find(`.${this.selectors.blockName}${this.selectors.introCard}`))

        this.init()
    }

}
