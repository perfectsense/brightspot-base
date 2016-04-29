import $ from 'jquery';
import bspUtils from 'bsp-utils';

class Comment {
    constructor($context, options) {
        this.$context = $context;
        this.settings = $.extend({}, {
            selectors: {
                prefix: '.Comment',
                commentActions: '.Comment-actions',
                commentEntryBlock: '.CommentEntry'
            }
        }, options);

        this.$replyButton = this.$context.children(`${this.settings.selectors.commentActions}`).find(`${this.settings.selectors.prefix}-reply-button`);
        this.$replyForm = this.$context.children(`${this.settings.selectors.commentActions}`).find(`${this.settings.selectors.prefix}-reply`);

        this.$replyForm.submit((event)=> {
            this.$replyButton.prop('disabled', true);
            event.preventDefault();
            this.onSubmit();
            $.event.trigger({
                type: 'Comment:onReplyUI-Requested',
                $comment: this.$context
            });
        });
    }

    onSubmit() {
        $.ajax({
            url: this.$replyForm.attr('action'),
            method: this.settings.ajaxMethod,
            data: this.$replyForm.serialize()
        })
        .done((response)=> {
            this.renderResponse(response);
        })
        .fail((data)=> {
            this.onError(data);
        });
    }

    renderResponse(data) {
        let $html = $(data);
        let $commentEntry = $html.find(this.settings.selectors.commentEntryBlock);

        this.$context.children(`${this.settings.selectors.prefix}-replies`).prepend($commentEntry);
        this.$replyButton.prop('disabled', false);
        $commentEntry.find('textarea').focus();

        $.event.trigger({
            type: 'Comment:onReplyUI-Rendered',
            $comment: this.$context
        });
    }

    onError(data) {
        $.event.trigger({
            type: 'Comment:onReplyUI-RequestError',
            $comment: this.$context,
            error: data
        });
    }
}

export default bspUtils.plugin(false, 'bsp-community', 'comment', {
    '_each': function(item) {
        $(item).data('bsp-community-comment', new Comment($(item), this.option(item)));
    }
});
