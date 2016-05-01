import $ from 'jquery';
import bspUtils from 'bsp-utils';

let Commenting = {
    defaults: {
        showComments: false,

        selectors: {
            prefix: ".Commenting",
            commentingBody: ".Commenting-body",
            commentEntryBlock: ".CommentEntry",
            commentBlock: ".Comment",
            validationBlock: '.ValidationMessages'
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

                // comment wasn't previously rendered?
                if (!data.alreadyRendered && data.$comment){
                    self.renderComment(data.$comment);
                }

                if (data.$title){
                    self.renderTitle(data.$title.find(`${self.settings.selectors.prefix}-title`));
                }

                // re-enable any disabled reply
                self.$el.find('.Comment-reply-button[disabled]').parents(`${self.settings.selectors.commentBlock}`).each(function(){
                    $(this).data('bsp-community-comment').enableReply();
                })
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

        if (self.settings.showComments) {
            this.showComments();
        } else {
            this.hideComments();
        }

        self.$hideShowCommentsToggles.on('click', (event)=> {
            event.preventDefault();

            if (self.$el.find(self.settings.selectors.commentingBody).attr('data-comments-shown') === "true") {
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
            let $errorMessage = this.$el.find(`${this.settings.selectors.prefix}-validation ${this.settings.selectors.validationBlock}-serverError`);
            $errorMessage.attr('data-visible', '');
            this.$el.trigger('Commenting:onRequestLoadMoreError', { data: data });
        });
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
        this.$commentingBody.attr('data-comments-shown', true);

        this.$el.trigger('Commenting:onAfterShowComments');
    },

    hideComments() {
        this.$el.trigger('Commenting:onBeforeHideComments');

        this.$hideCommentsToggle.prop('disabled', true);
        this.$showCommentsToggle.prop('disabled', false);
        this.$commentingBody.attr('data-comments-shown', false);

        this.$el.trigger('Commenting:onAfterHideComments');
    }
}

export default bspUtils.plugin(false, 'bsp-community', 'commenting', {
    '_each': function(item) {
        Object.create(Commenting).init($(item), this.option(item));
    }
});
