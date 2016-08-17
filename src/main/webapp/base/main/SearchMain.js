import $ from 'jquery';
import bspUtils from 'bsp-utils';

export class SearchMain {
    constructor(_$ctx, options = { }) {
        this.$context = _$ctx

        this.settings = $.extend({ }, {
            disableTransition: false,   // prevents the delayed data-attribute addition/removal for transitioning the result items
            selectors: {
                prefix: '.SearchMain',
                resultBlock: '.SearchMainResult',
            }
        }, options)

        this.initForm()
        this.initLoadMoreButton()
    }

    get $items() {
        return this.$context.find(`${this.selectors.resultBlock}-items`)
    }

    get $form() {
        return this.$context
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
            this.$context.attr('data-searching', '')
            this.$loadMoreButton.attr('disabled', '')
        }
        else {
            this._busy = false
            this.$context.removeAttr('data-searching')
            this.$loadMoreButton.removeAttr('disabled')
        }
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
                // was a specific formaction provided on the <button>?
                // otherwise, this bubbles up to use the <form> action
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

    onSubmit(action, callback) {
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
    }

    onLoadMoreSuccess(response) {
        let $html = $(response)
        this.appendResults($html.find(`${this.selectors.resultBlock}-items`))
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

    updateLoadMoreButton($button) {
        // new load-more button?
        if ($button.length > 0){
            this.$loadMoreButton.replaceWith($button)
            this.initLoadMoreButton()
        }
        else {
            this.$loadMoreButton.remove()
        }
    }
}
