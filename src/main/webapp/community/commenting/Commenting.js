import $ from 'jquery';
import bspUtils from 'bsp-utils';

export default bspUtils.plugin(false, 'bsp-community', 'commenting', {
    '_each': function(item) {
        Object.create(Commenting).init($(item), this.option(item));
    }
});

let Commenting = {
    defaults: {
        expandComments: false
    },

    selectors: {
        expandCommentsToggle: ".Commenting-hideToggle-showButton",
        collapseCommentsToggle: ".Commenting-hideToggle-hideButton",

        signIn: ".CommentingSignIn",
        signInLinks: ".CommentingSignIn-services > a",
        commentingHeaderTitle: ".CommentingHeader-title",
        commentingBody: ".Commenting-body",
        commentSubmitButton: ".CommentSubmit-button",
        commentBlock: ".Comment",
        commentEntryBlock: ".CommentEntry",
        commentEntryResponseBlock: ".CommentEntryResponse",
        commentEntryCharacterCountdown: ".TextArea-characterCountdown",
        commentReplyButton: ".CommentReply",
        commentValidationCommentTooLongMessage: ".ValidationMessages-tooLong",
        commentValidationCommentBlankMessage: ".ValidationMessages-blank",
        commentValidationServerErrorMessage: ".ValidationMessages-serverError",
        commentingShowMoreButton: ".CommentingShowMore"
    },

    init($el, options) {
        let self = this;
        self.$el = $el;
        self.settings = $.extend({}, self.defaults, options);

        self.$commentingBody = self.$el.find(self.selectors.commentingBody);
        self.$expandCollapseCommentsToggles = self.$el.find(`${self.selectors.expandCommentsToggle}, ${self.selectors.collapseCommentsToggle}`);
        self.$expandCommentsToggles = self.$el.find(self.selectors.expandCommentsToggle);
        self.$collapseCommentsToggles = self.$el.find(self.selectors.collapseCommentsToggle);

        $(document).on({
            'CommentEntry:onNewComment': (event)=> {
                if (event.$comment){
                    self.renderComment(event.$comment);
                }
            },
            'Comment:onBeforeReply': (event)=> {
                if (event.$comment){
                    // before a new comment entry block is rendered, remove any existing ones
                    self.$commentingBody.find(`${self.selectors.commentEntryBlock}`).each(function(){
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

        self.$expandCollapseCommentsToggles.on('click', (e) => {
            e.preventDefault();
            if (self.$el.find(self.selectors.commentingBody).attr('data-comments-expanded') === "true") {
                this.collapseComments();
            } else {
                this.expandComments();
            }
        });

        this.initShowMoreButton(self.$el.find(self.selectors.commentingShowMoreButton));
    },

    renderComment($comment) {
        this.$commentingBody.prepend($comment);
    },

    getPaginatedComments($el) {
        let self = this;

        // the `ajax-href` attribute should already have the offset & limit as query params
        let url = $el.find('[data-ajax-href]').attr('data-ajax-href');

        $.ajax({
            method: 'GET',
            dataType: "json",
            url: url
        })
        .done(function(data) {
            self.updateWith(data);
        })
        .fail(function() {
            self.showServerError($el);
        });
    },

    initCommentEntry($block) {
        let self = this;
        let $textarea = $block.find('textarea');

        $block.find(self.selectors.commentSubmitButton).on('click', function(e) {
            e.preventDefault();
            if (self.validateInput($textarea)) {
                $textarea.attr('aria-invalid', 'false');
                self.submitComment($block);
            } else {
                $textarea.attr('aria-invalid', 'true');
            }
        });
    },

    initShowMoreButton($el) {
        let self = this;
        $el.on('click', function(e) {
            e.preventDefault();
            self.getPaginatedComments($(this));
            $(this).empty();
        });
    },

    updateWith(data) {
        let self = this;
        let $html;

        // multiple comment blocks?
        if (data.comments) {
            $html = $(data.comments);
            $html.each(function() {
                self.initCommentReply($(this).find(self.selectors.commentReplyButton));
                self.$commentingBody.append($(this));
            });
        }

        // header-title block?
        if (data.commentingHeaderTitle) {
            this.$el.find(this.selectors.commentingHeaderTitle).replaceWith(data.commentingHeaderTitle);
        }

        // show sign-in?
        if (data.result === "unauthenticated" && data.signIn && data.$parentComment){
            $html = $(data.signIn);
            this.initSignIn($html);
            $html.insertAfter(data.$parentComment);
        }

        // show more button?
        if (data.showMoreButton) {
            $html = $(data.showMoreButton);
            this.initShowMoreButton($html);
            this.$el.find(this.selectors.commentingShowMoreButton).replaceWith($html);
        }
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
        $block.find(this.selectors.commentValidationCommentBlankMessage).attr('data-visible', '');
    },

    showServerError($block) {
        $block.find(this.selectors.commentValidationServerErrorMessage).attr('data-visible', '');
    },

    hideValidationMessages($context) {
        $context.find(this.selectors.commentValidationServerErrorMessage).removeAttr('data-visible');
        $context.find(this.selectors.commentValidationCommentBlankMessage).removeAttr('data-visible');
        $context.find(this.selectors.commentValidationCommentTooLongMessage).removeAttr('data-visible');
    },

    validateInput($input) {
        if (!$input || $input.length <= 0) return false;
        let $block = $input.parents(this.selectors.commentEntryBlock);
        let value = $input.val();
        if (value === "") {
            this.showBlankCommentError($block);
            return false;
        }
        this.hideValidationMessages($block);
        return true;
    }
}
