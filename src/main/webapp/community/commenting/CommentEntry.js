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
            this.$context.trigger('CommentEntry:onSubmitComment');
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
            this.renderComment(response);
        })
        .fail((data)=> {
            this.onError(data);
        });
    }

    onError(data) {
        this.$context.trigger('CommentEntry:onSubmitCommentError', { error: data });
    }

    renderComment(data) {
        let $html = $(data);
        let $comment = $html.find(this.settings.selectors.commentBlock);

        // if this block is not a child of a commenting block
        // or is rendered within the replies section, we should replace it with the response
        let replaceWithResponse = this.$context.parents('.Commenting').length == 0 ||
                                this.$context.parents('.Comment-replies').length > 0;

        // reset the UI
        this.reset();

        // replace the entry block with the comment block?
        if (replaceWithResponse){
            this.$context.replaceWith($comment);
        }

        this.$context.trigger('CommentEntry:onSubmitCommentSuccess', {
            commentingId: this.commentingId,
            $comment: $comment,
            $html: $html,
            alreadyRendered: replaceWithResponse
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
