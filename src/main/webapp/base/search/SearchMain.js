import $ from 'jquery'
import bspUtils from 'bsp-utils'

export class SearchMain {
    constructor(_$ctx, options = { }) {
        this.settings = $.extend(true, { }, {
            disableTransition: false,   // prevents the delayed data-attribute addition/removal for transitioning the result items
            selectors: {
                prefix: '.SearchMain',
                resultBlock: '.SearchResult',
                itemsFilter: ''         // if you need to get more specific about which elements within the SearchResult-items you want to append
            }
        }, options)

        this.initContext(_$ctx)
    }

    get $items() {
        return this.$context.find(`${this.selectors.resultBlock}-items`)
    }

    get $form() {
        return this.$context
    }

    get $context() {
        return this.$_context
    }

    set $context($el) {
        this.$_context = $el
    }

    get $loadMoreButton() {
        return this.$context.find(`${this.selectors.resultBlock}-loadMore-button`)
    }

    get selectors() {
        return this.settings.selectors
    }

    get busy() {
        return this._busy
    }

    set busy(toggleOn) {
        if (toggleOn) {
            this._busy = true
            this.$context.attr('data-in-progress', '')
            this.$loadMoreButton.attr('disabled', '')
        }
        else {
            this._busy = false
            this.$context.removeAttr('data-in-progress')
            this.$loadMoreButton.removeAttr('disabled')
        }
    }

    initContext($ctx) {
        this.$context = $ctx
        this.initForm()
        this.initLoadMoreButton()
    }

    initForm() {
        this.$form
            .off('submit')
            .on('submit', (event)=> {
                event.preventDefault()
                this.$context.trigger('SearchMain:beforeSubmit')
                this.onSubmit()
                    .done((response)=> {
                        this.onSubmitSuccess(response)
                    })
                }
            )
    }

    initLoadMoreButton() {
        this.$loadMoreButton
            .off('click')
            .on('click', (event)=> {
                // is a formaction provided on the <button>?
                // otherwise, defaults to use the <form> action
                let formAction = this.$loadMoreButton.attr('formaction')
                if (formAction) {
                    event.preventDefault()
                    this.$context.trigger('SearchMain:beforeLoadMore')
                    this.onSubmit(formAction)
                        .done((response)=> {
                            this.onLoadMoreSuccess(response)
                        })
                }
            })
    }

    onSubmit(action) {
        this.busy = true

        return $.ajax({
            url: action || this.$form.attr('action'),
            method: this.$form.attr('method'),
            data: this.$form.serialize()
        })
        .done(()=> {
            this.busy = false
        })
        .fail((data)=> {
            this.busy = false
            this.$context.trigger('SearchMain:onSubmitFailed')
        })
    }

    onSubmitSuccess(response) {
        let $html = $(response)
        this.updateContext($html)
    }

    onLoadMoreSuccess(response) {
        let $html = $(response)
        this.appendResults($html.find(`${this.selectors.resultBlock}-items ${this.settings.selectors.itemsFilter}`))
        this.updateLoadMoreButton($html.find(`${this.selectors.resultBlock}-loadMore-button`))
        this.$context.trigger('SearchMain:afterLoadMore')
    }

    appendResults($results) {
        // Results to render?
        if ($results.length > 0) {
            $.each($results.children(), (index, val)=> {
                let $item = $(val)

                if (!this.settings.disableTransition){
                    $item.attr('data-transitioning', '')
                    setTimeout(function(){
                        $item.removeAttr('data-transitioning')
                    }, 50 * index)
                }

                this.$items.append($item)
            })
        }
    }

    updateContext($newContext) {
        this.$context.replaceWith($newContext)
        this.initContext($newContext)
    }

    updateLoadMoreButton($newButton) {
        // new load-more button?
        if ($newButton.length > 0){
            this.$loadMoreButton.replaceWith($newButton)
            this.initLoadMoreButton()
        }
        else {
            this.$loadMoreButton.remove()
        }
    }
}
