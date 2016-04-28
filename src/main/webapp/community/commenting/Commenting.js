import $ from 'jquery';
import bspUtils from 'bsp-utils';

export default bspUtils.plugin(false, 'bsp-community', 'commenting', {
    '_each': function(item) {
        Object.create(Commenting).init($(item), this.option(item));
    }
});

let Commenting = {
    defaults: {
        expandComments: false,

        selectors: {
            prefix: ".Commenting",
            commentingBody: ".Commenting-body",
            commentEntryBlock: ".CommentEntry",
            commentBlock: ".Comment",

            // deprecating...
            signIn: ".CommentingSignIn",
            signInLinks: ".CommentingSignIn-services > a",
            commentingHeaderTitle: ".CommentingHeader-title",
            commentSubmitButton: ".CommentSubmit-button",

            commentEntryResponseBlock: ".CommentEntryResponse",
            commentEntryCharacterCountdown: ".TextArea-characterCountdown",
            commentReplyButton: ".CommentReply",
            commentValidationCommentTooLongMessage: ".ValidationMessages-tooLong",
            commentValidationCommentBlankMessage: ".ValidationMessages-blank",
            commentValidationServerErrorMessage: ".ValidationMessages-serverError",
            commentingShowMoreButton: ".CommentingShowMore"
        }
    },

    init($el, options) {
        let self = this;
        self.$el = $el;
        self.settings = $.extend({}, self.defaults, options);

        self.$commentingBody = self.$el.find(self.settings.selectors.commentingBody);
        self.$expandCollapseCommentsToggles = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-showButton, ${self.settings.selectors.prefix}-hideToggle-hideButton`);
        self.$expandCommentsToggles = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-showButton`);
        self.$collapseCommentsToggles = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-hideButton`);
        self.$loadMoreForm = self.$el.find(`${self.settings.selectors.prefix}-loadMore`);

        $(document).on({
            'CommentEntry:onNewComment': (event)=> {
                if (event.$comment){
                    self.renderComment(event.$comment);
                }
            },
            'Comment:onBeforeReply': (event)=> {
                if (event.$comment){
                    // before a new comment entry block is rendered, remove any existing ones
                    self.$commentingBody.find(`${self.settings.selectors.commentEntryBlock}`).each(function(){
                        $(this).data('bsp-community-commentEntry').remove();
                    });
                }
            }
        });

        if (self.settings.expandComments) {
            self.$expandCommentsToggles.css({ 'display': 'none' });
            self.$collapseCommentsToggles.css({ 'display': 'block' });
        } else {
            self.$expandCommentsToggles.css({ 'display': 'block' });
            self.$collapseCommentsToggles.css({ 'display': 'none' });
        }

        self.$expandCollapseCommentsToggles.on('click', (event)=> {
            event.preventDefault();
            if (self.$el.find(self.settings.selectors.commentingBody).attr('data-comments-expanded') === "true") {
                this.collapseComments();
            } else {
                this.expandComments();
            }
        });

        self.$loadMoreForm.submit((event)=> {
            event.preventDefault();

            $.event.trigger({
                type: 'Comment:onBeforeLoadMore'
            });

            this.loadMore();
        });

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
            this.renderResponse(response);
        })
        .fail((data)=> {
            this.onError(data);
        });
    },

    renderResponse(data) {
        let $html = $(data);
        let $comments = $html.find(this.settings.selectors.commentBlock);
        let $loadMoreButton = $html.find('.Commenting-loadMore-button');
        let formAction = $loadMoreButton.attr('formaction');

        // replace the existing form action with current load more action?
        if (formAction){
            this.$el.find('.Commenting-loadMore').append($loadMoreButton);
            $loadMoreButton.parents('form').attr('action', formAction);
        }

        this.$commentingBody.append($comments);
    },

    expandComments() {
        this.$el.data('commentsExpanded', true);
        this.$expandCommentsToggles.css({ 'display': 'none' });
        this.$collapseCommentsToggles.css({ 'display': 'block' });
        this.$commentingBody.attr('data-comments-expanded', true);
    },

    collapseComments() {
        this.$el.data('commentsExpanded', false);
        this.$collapseCommentsToggles.css({ 'display': 'none' });
        this.$expandCommentsToggles.css({ 'display': 'block' });
        this.$commentingBody.attr('data-comments-expanded', false);
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
