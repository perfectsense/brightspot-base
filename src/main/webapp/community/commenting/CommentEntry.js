import $ from 'jquery';
import bspUtils from 'bsp-utils';

class CommentEntry {
    constructor($context, options) {
        this.$context = $context;
        this.settings = $.extend({}, {
            selectors: {
                prefix: '.CommentEntry',
                commentBlock: '.Comment'
            }
        }, options);

        this.$form.submit((event)=> {
            event.preventDefault();
            this.onSubmit();
        })
    }

    get $submitButton() {
        return this.$context.find(`${this.settings.selectors.prefix}-submit-button`);
    }

    get $form() {
        return this.$context.find(`${this.settings.selectors.prefix}-form`);
    }

    onSubmit() {
        $.ajax({
            url: this.$form.attr('action'),
            method: this.settings.ajaxMethod,
            data: this.$form.serialize()
        })
        .done((response)=> {
            this.reset();
            this.renderComment(response);
        })
        .fail((data)=> {
            this.onError(data);
        });
    }

    onError(data) {
        // todo
    }

    renderComment(data) {
        let $html = $(data);
        let $comment = $html.find(this.settings.selectors.commentBlock);

        // replace the entry component with the comment?
        if (this.$context.get(0).hasAttribute('data-replace-with-response')){
            this.$context.replaceWith($comment);
        }
        // bubble the event
        else {
            $.event.trigger({
                type: 'CommentEntry:onNewComment',
                $comment: $comment
            });
        }

        // broadcast title update
        // todo
    }

    reset() {
        this.$form.get(0).reset();
        this.$context.find(`${this.settings.selectors.prefix}-input textarea`).val('').trigger('keyup');
    }
}

export default bspUtils.plugin(false, 'bsp', 'community-commentEntry', {
    '_each': function(item) {
        new CommentEntry($(item), this.option(item));
    }
});
