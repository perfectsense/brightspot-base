import $ from 'jquery';
import bspUtils from 'bsp-utils';

export default bspUtils.plugin(false, 'bsp', 'community-commenting', {
    '_each': function(item) {
        Object.create(Commenting).init($(item), this.option(item));
    }
});

let Commenting = {
    defaults: {
        ajaxMethod: "POST",
        expandComments: false
    },

    selectors: {
        expandCommentsToggle: ".CommentingExpandCollapse-textWhenCollapsed",
        collapseCommentsToggle: ".CommentingExpandCollapse-textWhenExpanded",
        loginLinks: ".CommentingSignIn-services > a",
        commentingHeaderTitle: ".CommentingHeader-title",
        commentingBody: ".Commenting-body",
        commentSubmitButton: ".CommentSubmit-button",
        commentBlock: ".Comment",
        commentEntryBlock: ".CommentEntry",
        commentEntryCharacterCountdown: ".TextArea-characterCountdown",
        commentReplyButton: ".CommentReply",
        commentValidationCommentTooLongMessage: ".ValidationMessages-serverError-tooLong",
        commentValidationCommentBlankMessage: ".ValidationMessages-serverError-blank",
        commentValidationServerErrorMessage: ".ValidationMessages-serverError",
        commentingShowMoreButton: ".CommentingShowMore"
    },

    init($el, options) {
        let self = this;
        self.$el = $el;
        self.settings = $.extend({}, self.defaults, options);

        // for debugging
        if (self.$el.attr('data-bsp-community-commenting-ajaxMethod')) {
            self.settings.ajaxMethod = self.$el.attr('data-bsp-community-commenting-ajaxMethod');
        }

        // cached element queries
        self.$commentingBody = self.$el.find(self.selectors.commentingBody);
        self.$expandCollapseCommentsToggles = self.$el.find(`${self.selectors.expandCommentsToggle}, ${self.selectors.collapseCommentsToggle}`);
        self.$expandCommentsToggles = self.$el.find(self.selectors.expandCommentsToggle);
        self.$collapseCommentsToggles = self.$el.find(self.selectors.collapseCommentsToggle);

        if (self.settings.expandComments) {
            self.$expandCommentsToggles.css({ 'display': 'none' });
            self.$collapseCommentsToggles.css({ 'display': 'block' });
        } else {
            self.$expandCommentsToggles.css({ 'display': 'block' });
            self.$collapseCommentsToggles.css({ 'display': 'none' });
        }

        // event handlers
        self.$expandCollapseCommentsToggles.on('click', (e) => {
            e.preventDefault();
            if (self.$el.find(self.selectors.commentingBody).attr('data-comments-expanded') === "true") {
                this.collapseComments();
            } else {
                this.expandComments();
            }
        });

        this.initCommentEntry(self.$el.find(self.selectors.commentEntryBlock));
        this.initLoginLinks(self.$el.find(self.selectors.loginLinks));
        this.initCommentReply(self.$el.find(self.selectors.commentReplyButton));
        this.initShowMoreButton(self.$el.find(self.selectors.commentingShowMoreButton));
    },

    submitComment($commentBlock) {
        let self = this;
        let $textarea = $commentBlock.find('.TextArea-input');
        let url = $commentBlock.find(self.selectors.commentSubmitButton).attr('data-ajax-href');

        $textarea.attr('disabled', '');

        $.ajax({
                method: self.settings.ajaxMethod,
                dataType: "json",
                url: url,
                data: { "comment": $textarea.val() }
            })
            .done(function(data) {
                // is this an in-line reply?
                if ($commentBlock.get(0).hasAttribute('data-replace-with-response')) {
                    data.$elToReplace = $commentBlock;
                }
                $textarea.removeAttr('disabled');
                self.updateWith(data);
                self.resetEntryInput($commentBlock);
            })
            .fail(function() {
                $textarea.removeAttr('disabled');
                self.showServerError($commentBlock);
            });
    },

    getCommentEntry($el) {
        let self = this;

        // the `ajax-href` attribute should already have the parentId as a query param
        let url = $el.find('[data-ajax-href]').attr('data-ajax-href');

        $.ajax({
                method: 'GET',
                dataType: "json",
                url: url
            })
            .done(function(data) {
                // is this a reply?
                let $parentComment = $el.parents('.Comment');
                data.$parentComment = ($parentComment.length > 0) ? $parentComment : null;
                self.updateWith(data);
            })
            .fail(function() {
                self.showServerError($el);
            });
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

        $textarea.on('keypress', function(e) {
                // disable line-break/feed
                // so it wont count against the users remaining characters
                if (e.which == 13) {
                    e.preventDefault();
                }
            })
            .on('keyup', function(e) {
                let text = $(this).siblings(self.selectors.commentEntryCharacterCountdown).text();
                let length = $(this).val().length;
                let int = text.match(/[0-9 , \.]+/g);

                length = $(this).attr('maxlength') - length;
                if (length < 0) length = 0; // just in case :)

                if (int[0] && int[0].length) {
                    text = text.replace(int[0].trim(), length);
                } else {
                    text = length;
                }

                $(this).siblings(self.selectors.commentEntryCharacterCountdown).text(text);
            });
    },

    initLoginLinks($el) {
        // clicking on social login
        $el.on('click', function(e) {
            e.preventDefault();
            let url = $(this).attr('href');
            window.open(url, '_blank');
        });
    },

    initCommentReply($el) {
        let self = this;
        $el.on('click', function(e) {
            e.preventDefault();
            // cancel any previous/visible inline comment entry UIs
            $(`${self.selectors.commentingBody} ${self.selectors.commentEntryBlock}`).each(function() {
                self.cancelCommentReply($(this));
            });
            // disable the reply button UI
            $(this).css({ 'opacity': '0.4', 'pointer-events': 'none' });
            self.getCommentEntry($(this));
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

        // comment block?
        if (data.comment) {
            $html = $(data.comment);
            this.initCommentReply($html.find(this.selectors.commentReplyButton));

            // replacing an inline comment entry?
            if (data.$elToReplace) {
                data.$elToReplace.siblings(self.selectors.commentBlock)
                    .find(self.selectors.commentReplyButton)
                    .css({ 'opacity': 1, 'pointer-events': 'auto' });
                data.$elToReplace.replaceWith($html);
            }
            // appending comment to body
            else {
                this.$commentingBody.append($html);
            }
        }

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

        // inline (reply-to) comment entry?
        if (data.commentEntry && data.$parentComment) {
            $html = $(data.commentEntry);
            this.initCommentEntry($html);
            $html.insertAfter(data.$parentComment);
            $html.find('textarea').focus();
        }

        // show more button?
        if (data.showMoreButton) {
            $html = $(data.showMoreButton);
            this.initShowMoreButton($html);
            this.$el.find(this.selectors.commentingShowMoreButton).replaceWith($html);
        }
    },

    resetEntryInput($commentBlock) {
        // triggering the keyup event,
        // signals the counter to reset the countdown
        $commentBlock.find('textarea').val('').trigger('keyup');
    },

    cancelCommentReply($commentEntry) {
        $commentEntry.siblings(this.selectors.commentBlock)
            .find(this.selectors.commentReplyButton)
            .css({ 'opacity': 1, 'pointer-events': 'auto' });
        $commentEntry.remove();
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
