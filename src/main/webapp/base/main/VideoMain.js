import $ from 'jquery';

export class VideoMain {

    $ctx ($el) {
        this.$ctx = $el
    }

    set permalink (str) {
        this.$ctx.attr('data-permalink', str)
    }

    get permalink () {
        return this.$ctx.attr('data-permalink')
    }

    get videoUrl () {
        return this.$ctx.find('.VideoMain-content').attr('data-videourl')
    }

    constructor ($ctx, options = {}) {
        this.$ctx = $ctx
        this.suppressPushState = options.suppressPushState || false

        this.$ctx.on({
            'VideoPromo:onLoad': (event, data)=> {
                // auto-scroll page to the top position of video main
                let scrollThreshold = 45
                let scrollDestination = `0px`

                if ($(window).scrollTop() > scrollThreshold) {
                    $('body,html').animate( {scrollTop: scrollDestination}, 200 )
                }

                this.fetchView(data.url, data.videoUrl)
            }
        })
    }

    fetchView (url, videoUrl) {
        $.ajax({
            url: url
        })
        .done((response)=> {
            this.updateView($(response))
            this.updateVideoUrl(videoUrl)
        })
        .fail((data)=> {
            console.error('"fetchView()" failed')
        })
    }

    updateVideoUrl (url) {
        this.$ctx.trigger('VideoMain:onUpdateVideoUrl', {
            videoUrl: url
        })
    }

    updateView ($html) {
        let $screen = $html.find('.VideoMain-screen')
        let permalink = $html.attr('data-permalink')
        let $content = $html.find('.VideoMain-content')

        if ($screen.length > 0 && $content.length > 0) {
            this.permalink = permalink
            this.$ctx.find('.VideoMain-content').replaceWith($content)

            // update the document's title with the new video title
            $('head title').text($content.find('.VideoMain-headline').text().trim() || document.title)

            if (!this.suppressPushState) {
                history.pushState({}, '', this.permalink)
            }
        }
    }
}
