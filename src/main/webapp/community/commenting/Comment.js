import $ from 'jquery';
import bspUtils from 'bsp-utils';

class Comment {
    constructor($context, options) {
        this.$context = $context;
        this.settings = $.extend({}, {
            selectors: {
                prefix: '.Comment',
                commentActions: '.Comment-actions',
                commentEntryBlock: '.CommentEntry',
                signInBlock: '.UserSignIn',
                validationBlock: '.ValidationMessages'
            }
        }, options);

        this.$replyButton = this.$context.children(`${this.settings.selectors.commentActions}`).find(`${this.settings.selectors.prefix}-reply-button`);
        this.$replyForm = this.$context.children(`${this.settings.selectors.commentActions}`).find(`${this.settings.selectors.prefix}-reply`);

        this.$replyForm.submit((event)=> {
            event.preventDefault();
            this.disableReply();
            this.onSubmit();
            this.$context.trigger('Comment:onRequestReplyUI');
        });
    }

    onSubmit() {
        let req = $.ajax({
            url: this.$replyForm.attr('action'),
            method: this.settings.ajaxMethod,
            data: this.$replyForm.serialize()
        })
        .done((response)=> {
            let $html = $(response);
            let $commentEntry = $html.find(this.settings.selectors.commentEntryBlock);
            let $signIn = $html.find(this.settings.selectors.signInBlock);

            if ($commentEntry.length > 0){
                this.renderCommentEntry($commentEntry);
            }
            else if ($signIn.length > 0) {
                this.renderSignIn($signIn);
            }
            else {
                this.onError();
            }
        })
        .fail((data)=> {
            this.onRequestError(data);
        });
    }

    renderCommentEntry($html) {
        this.$context.children(`${this.settings.selectors.prefix}-replies`).prepend($html);
        $html.find('textarea').focus();
        this.$context.trigger('Comment:onRequestReplyUISuccess');
    }

    renderSignIn($html) {
        this.$context.children(`${this.settings.selectors.prefix}-replies`).prepend($html);
        this.$context.trigger('Comment:onRequestReplyUISuccess');
    }

    onRequestError(data) {
        let $errorMessage = this.$context.find(`${this.settings.selectors.validationBlock}-serverError`);
        $errorMessage.attr('data-visible', '');
        this.$context.trigger('Comment:onRequestReplyUIError', { error: data });
    }

    disableReply() {
        this.$replyButton.prop('disabled', true);
    }

    enableReply() {
        this.$replyButton.prop('disabled', false);
    }
}

export default bspUtils.plugin(false, 'bsp-community', 'comment', {
    '_each': function(item) {
        $(item).data('bsp-community-comment', new Comment($(item), this.option(item)));
    }
});
