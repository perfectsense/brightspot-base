import $ from 'jquery';
import bspUtils from 'bsp-utils';

let Commenting = {
    defaults: {
        expandComments: false,

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

        self.$commentingBody = self.$el.find(self.settings.selectors.commentingBody);
        self.$expandCollapseCommentsToggles = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-showButton, ${self.settings.selectors.prefix}-hideToggle-hideButton`);
        self.$expandCommentsToggles = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-showButton`);
        self.$collapseCommentsToggles = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-hideButton`);
        self.$loadMoreForm = self.$el.find(`${self.settings.selectors.prefix}-loadMore`);

        $(document).on({
            'CommentEntry:onNewComment': (event)=> {
                if (event.prependComment && event.$comment){
                    self.renderComment(event.$comment);
                }

                if (event.$html){
                    self.renderTitle(event.$html.find(`${self.settings.selectors.prefix}-title`));
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
            this.expandComments();
        } else {
            this.collapseComments();
        }

        self.$expandCollapseCommentsToggles.on('click', (event)=> {
            event.preventDefault();
            
            if (self.$el.find(self.settings.selectors.commentingBody).attr('data-comments-hidden') === "false") {
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

        // replace the existing form action with current load more formaction?
        if (formAction){
            this.$el.find('.Commenting-loadMore').append($loadMoreButton);
            $loadMoreButton.parents('form').attr('action', formAction);
        }

        this.$commentingBody.append($comments);
    },

    expandComments() {
        this.$expandCommentsToggles.prop('disabled', true);
        this.$collapseCommentsToggles.prop('disabled', false);
        this.$commentingBody.attr('data-comments-hidden', false);
    },

    collapseComments() {
        this.$collapseCommentsToggles.prop('disabled', true);
        this.$expandCommentsToggles.prop('disabled', false);
        this.$commentingBody.attr('data-comments-hidden', true);
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
