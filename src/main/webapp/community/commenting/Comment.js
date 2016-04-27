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

        this.$replyButton = this.$context.children(`${this.settings.selectors.commentActions}`).find(`${this.settings.selectors.prefix}Action-reply-button`);
        this.$replyForm = this.$context.children(`${this.settings.selectors.commentActions}`).find(`${this.settings.selectors.prefix}Action-reply`);

        this.$replyForm.submit((event)=> {
            event.preventDefault();
            this.$replyButton.prop('disabled', true);

            $.event.trigger({
                type: 'Comment:onBeforeReply',
                $comment: this.$context
            });

            this.onSubmit();
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
        $commentEntry.find('textarea').focus();
    }

    onError(data) {
        // todo
    }
}

export default bspUtils.plugin(false, 'bsp-community', 'comment', {
    '_each': function(item) {
        $(item).data('bsp-community-comment', new Comment($(item), this.option(item)));
    }
});
