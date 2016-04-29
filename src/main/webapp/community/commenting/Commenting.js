import $ from 'jquery';
import bspUtils from 'bsp-utils';

let Commenting = {
    defaults: {
        hideComments: true,

        selectors: {
            prefix: ".Commenting",
            commentingBody: ".Commenting-body",
            commentEntryBlock: ".CommentEntry",
            commentBlock: ".Comment",

            // deprecating...
            commentValidationCommentTooLongMessage: ".ValidationMessages-tooLong",
            commentValidationCommentBlankMessage: ".ValidationMessages-blank",
            commentValidationServerErrorMessage: ".ValidationMessages-serverError"
        }
    },

    init($el, options) {
        let self = this;
        self.$el = $el;
        self.settings = $.extend({}, self.defaults, options);
        self.id = self.$el.attr('id');
        self.$commentingBody = self.$el.find(self.settings.selectors.commentingBody);
        self.$hideShowCommentsToggles = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-showButton, ${self.settings.selectors.prefix}-hideToggle-hideButton`);
        self.$showCommentsToggle = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-showButton`);
        self.$hideCommentsToggle = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-hideButton`);
        self.$loadMoreForm = self.$el.find(`${self.settings.selectors.prefix}-loadMore`);

        self.$el.on({
            'CommentEntry:onSubmitCommentSuccess': (event, data)=> {
                // exit early if this commenting instance shouldn't handle this event.
                if (!data || self.id !== data.commentingId) return;

                if (!data.alreadyRendered && data.$comment){
                    self.renderComment(data.$comment);
                }

                if (data.$html){
                    self.renderTitle(data.$html.find(`${self.settings.selectors.prefix}-title`));
                }
            },
            'Comment:onRequestReplyUI': (event, data)=> {
                // exit early if this commenting instance shouldn't handle this event.
                if (!data || self.id !== data.commentingId) return;

                if (data.$comment){
                    // before a new comment entry block is rendered, remove any existing ones
                    self.$commentingBody.find(`${self.settings.selectors.commentEntryBlock}`).each(function(){
                        $(this).data('bsp-community-commentEntry').remove();
                    });
                }
            }
        });

        if (self.settings.hideComments) {
            this.hideComments();
        } else {
            this.showComments();
        }

        self.$hideShowCommentsToggles.on('click', (event)=> {
            event.preventDefault();

            if (self.$el.find(self.settings.selectors.commentingBody).attr('data-comments-hidden') === "false") {
                this.hideComments();
            } else {
                this.showComments();
            }
        });

        self.$loadMoreForm.submit((event)=> {
            event.preventDefault();
            self.$el.trigger('Commenting:onRequestLoadMore');
            this.loadMore();
        });

    },

    renderTitle($title) {
        this.$el.find(`${this.settings.selectors.prefix}-title`).replaceWith($title);
    },

    renderComment($comment) {
        this.$commentingBody.prepend($comment);
    },

    loadMore() {
        $.ajax({
            url: this.$loadMoreForm.attr('action'),
            method: this.settings.ajaxMethod
        })
        .done((response)=> {
            this.$loadMoreForm.empty();
            this.renderMoreComments(response);
            this.$el.trigger('Commenting:onRequestLoadMoreSuccess');
        })
        .fail((data)=> {
            this.onError(data);
        });
    },

    onError(data) {
        self.$el.trigger('Commenting:onRequestLoadMoreError');
    },

    renderMoreComments(data) {
        let $html = $(data);
        let $comments = $html.find(this.settings.selectors.commentBlock);
        let $loadMoreButton = $html.find('.Commenting-loadMore-button');
        let formAction = $loadMoreButton.attr('formaction');

        // replace the existing form action with current load more formaction?
        if (formAction){
            this.$el.find('.Commenting-loadMore').append($loadMoreButton);
            $loadMoreButton.parents('form').attr('action', formAction);
        }

        this.$commentingBody.append($comments);
    },

    showComments() {
        this.$el.trigger('Commenting:onBeforeShowComments');

        this.$showCommentsToggle.prop('disabled', true);
        this.$hideCommentsToggle.prop('disabled', false);
        this.$commentingBody.attr('data-comments-hidden', false);

        this.$el.trigger('Commenting:onAfterShowComments');
    },

    hideComments() {
        this.$el.trigger('Commenting:onBeforeHideComments');

        this.$hideCommentsToggle.prop('disabled', true);
        this.$showCommentsToggle.prop('disabled', false);
        this.$commentingBody.attr('data-comments-hidden', true);

        this.$el.trigger('Commenting:onAfterHideComments');
    },

    showBlankCommentError($block) {
        $block.find(this.settings.selectors.commentValidationCommentBlankMessage).attr('data-visible', '');
    },

    showServerError($block) {
        $block.find(this.settings.selectors.commentValidationServerErrorMessage).attr('data-visible', '');
    },

    hideValidationMessages($context) {
        $context.find(this.settings.selectors.commentValidationServerErrorMessage).removeAttr('data-visible');
        $context.find(this.settings.selectors.commentValidationCommentBlankMessage).removeAttr('data-visible');
        $context.find(this.settings.selectors.commentValidationCommentTooLongMessage).removeAttr('data-visible');
    },

    validateInput($input) {
        if (!$input || $input.length <= 0) return false;
        let $block = $input.parents(this.settings.selectors.commentEntryBlock);
        let value = $input.val();
        if (value === "") {
            this.showBlankCommentError($block);
            return false;
        }
        this.hideValidationMessages($block);
        return true;
    }
}

export default bspUtils.plugin(false, 'bsp-community', 'commenting', {
    '_each': function(item) {
        Object.create(Commenting).init($(item), this.option(item));
    }
});
