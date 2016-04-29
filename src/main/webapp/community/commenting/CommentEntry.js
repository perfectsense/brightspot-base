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

        this.commentingId = this.$context.attr('data-commenting-id') ||
                            this.$context.parents('.Commenting').attr('id');

        this.$form.submit((event)=> {
            event.preventDefault();
            this.onSubmit();
            $.event.trigger({
                type: 'CommentEntry:onComment-Submitted',
                $comment: this.$context
            });
        });
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
            this.renderResponse(response);
        })
        .fail((data)=> {
            this.onError(data);
        });
    }

    onError(data) {
        $.event.trigger({
            type: 'CommentEntry:onComment-RequestError',
            $comment: this.$context,
            error: data
        });
    }

    renderResponse(data) {
        let $html = $(data);
        let $comment = $html.find(this.settings.selectors.commentBlock);

        // is the comment entry block a child of the replies section of a comment?
        let isReply = this.$context.parents('.Comment-replies').length > 0;

        // reset the UI
        this.reset();

        // replace the entry block with the comment block?
        if (isReply){
            this.$context.replaceWith($comment);
        }

        $.event.trigger({
            type: 'CommentEntry:onComment-Saved',
            commentingId: this.commentingId,
            $comment: $comment,
            $html: $html,
            alreadyRendered: isReply
        });
    }

    reset() {
        this.$form.get(0).reset();
        this.$context.find(`${this.settings.selectors.prefix}-input textarea`).val('').trigger('keyup');
    }

    remove() {
        this.$context.remove();
    }
}

export default bspUtils.plugin(false, 'bsp-community', 'commentEntry', {
    '_each': function(item) {
        $(item).data('bsp-community-commentEntry', new CommentEntry($(item), this.option(item)));
    }
});
