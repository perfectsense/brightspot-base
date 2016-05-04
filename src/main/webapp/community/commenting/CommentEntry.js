import $ from 'jquery';
import bspUtils from 'bsp-utils';

class CommentEntry {
    constructor($context, options) {
        this.$context = $context;
        this.settings = $.extend({}, {
            selectors: {
                prefix: '.CommentEntry',
                commentBlock: '.Comment',
                commentingBlock: '.Commenting',
                signInBlock: '.UserSignIn',
                validationBlock: '.ValidationMessages',
                responseBlock: '.CommentActionResponse'
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

    get selectors() {
        return this.settings.selectors;
    }

    get $submitButton() {
        return this.$context.find(`${this.selectors.prefix}-submit-button`);
    }

    get $form() {
        return this.$context.find(`${this.selectors.prefix}-form`);
    }

    onSubmit() {
        $.ajax({
            url: this.$form.attr('action'),
            method: this.$form.attr('method'),
            data: this.$form.serialize()
        })
        .done((response)=> {
            this.render(response);
        })
        .fail((data)=> {
            this.onRequestError(data);
        });
    }

    onRequestError(data) {
        let $errorMessage = this.$context.find(`${this.selectors.validationBlock}-serverError`);
        $errorMessage.attr('data-visible', '');
        this.$context.trigger('CommentEntry:onSubmitCommentError', { error: data });
    }

    render(data) {
        let $html = $(data);
        let $comment = $html.find(this.selectors.commentBlock);
        let $title = $html.find(`${this.selectors.responseBlock}-title`);
        let $commentEntry = $html.find(this.selectors.prefix);
        let $signIn = $html.find(this.selectors.signInBlock);
        let $validationError = $html.find(`${this.selectors.prefix}-validationError`);
        let replaceWithResponse = true;

        // render a comment?
        if ($comment.length > 0){
            $html = $comment;

            // if this block is not a child of a commenting block
            // or is rendered within the replies section, we should replace it with the response
            replaceWithResponse = this.$context.parents('.Commenting').length == 0 ||
                                this.$context.parents('.Comment-replies').length > 0;

            this.$context.trigger('CommentEntry:onSubmitCommentSuccess', {
                commentingId: this.commentingId,
                $comment: $comment,
                $title: $title,
                alreadyRendered: replaceWithResponse
            });

            this.reset();
        }

        // render comment entry form?
        if ($commentEntry.length > 0) {
            $html = $commentEntry;
            this.$context.trigger('CommentEntry:onSubmitCommentError', { data: $html });
        }

        // render sign-in?
        if ($signIn.length > 0){
            $html = $signIn;
            this.$context.trigger('CommentEntry:onSubmitCommentError', { data: $html });
        }

        // replace the entry block with the comment block?
        if (replaceWithResponse){
            this.$context.replaceWith($html);
        }
    }

    reset() {
        this.$form.get(0).reset();
        this.$context.find(`${this.selectors.prefix}-validationError`).remove();
        this.$context.find(`${this.selectors.prefix}-input textarea`).val('').trigger('keyup');
        this.$context.find(`${this.selectors.validationBlock} [data-visible]`).removeAttr('data-visible');
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
