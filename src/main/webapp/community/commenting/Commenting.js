import $ from 'jquery';
import bspUtils from 'bsp-utils';

let Commenting = {
    defaults: {
        showComments: false,

        selectors: {
            prefix: ".Commenting",
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
        self.$commentingBody = self.$el.find(`${self.settings.selectors.prefix}-body`);
        self.$hideShowCommentsToggles = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-showButton, ${self.settings.selectors.prefix}-hideToggle-hideButton`);
        self.$showCommentsToggle = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-showButton`);
        self.$hideCommentsToggle = self.$el.find(`${self.settings.selectors.prefix}-hideToggle-hideButton`);
        self.$loadMoreForm = self.$el.find(`${self.settings.selectors.prefix}-loadMore`);

        this.$showCommentsToggle.prop('disabled', self.settings.showComments);
        this.$hideCommentsToggle.prop('disabled', !self.settings.showComments);
        this.$loadMoreForm.attr('data-visible', self.settings.showComments);
        this.$commentingBody.attr('data-comments-shown', self.settings.showComments);

        self.$showCommentsToggle.on('click', (event)=> {
            event.preventDefault();
            this.showComments();
        });

        self.$hideCommentsToggle.on('click', (event)=> {
            event.preventDefault();
            this.hideComments();
        });

        self.$loadMoreForm.submit((event)=> {
            event.preventDefault();
            self.$el.trigger('Commenting:onRequestLoadMore');
            this.loadMore();
        });

        self.$el.on({
            'CommentEntry:onSubmitCommentSuccess': (event, data)=> {
                // exit early if this commenting instance shouldn't handle this event.
                if (!data || self.id !== data.commentingId) return;

                // comment wasn't previously rendered?
                if (!data.alreadyRendered && data.$comment){
                    self.renderComment(data.$comment);
                }

                // update the title?
                if (data.$title){
                    self.renderTitle(data.$title);
                }

                // re-enable any disabled reply buttons
                self.$el.find('.Comment-reply-button[disabled]').parents(`${self.settings.selectors.commentBlock}`).each(function(){
                    $(this).data('bsp-community-comment').enableReply();
                });
            },
            'Comment:onRequestReplyUI': (event, data)=> {
                // exit early if this commenting instance shouldn't handle this event.
                if (!data || self.id !== data.commentingId) return;

                // re-enable any other disabled reply buttons
                self.$el.find('.Comment-reply-button[disabled]').parents(`${self.settings.selectors.commentBlock}`).each(function(){
                    // enable reply buttons other than the one belonging to the current comment
                    if (!$(event.target).is($(this))) {
                        $(this).data('bsp-community-comment').enableReply();
                    }
                });

                // before a new comment entry block is rendered, remove any existing ones
                self.$commentingBody.find(`${self.settings.selectors.commentEntryBlock}`).each(function(){
                    $(this).data('bsp-community-commentEntry').remove();
                });
            }
        });
    },

    renderTitle($title) {
        this.$el.find(`${this.settings.selectors.prefix}-title`).html($title.html());
    },

    renderComment($comment) {
        this.showComments();
        this.$commentingBody.prepend($comment);
    },

    loadMore() {
        $.ajax({
            url: this.$loadMoreForm.attr('action'),
            method: this.$loadMoreForm.attr('method')
        })
        .done((response)=> {
            this.reset();
            this.renderComments(response);
            this.$el.trigger('Commenting:onRequestLoadMoreSuccess');
        })
        .fail((data)=> {
            let $errorMessage = this.$el.find(`${this.settings.selectors.prefix}-validation ${this.settings.selectors.validationBlock}-serverError`);
            $errorMessage.attr('data-visible', '');
            this.$el.trigger('Commenting:onRequestLoadMoreError', { data: data });
        });
    },

    renderComments(data) {
        let $html = $(data);
        let $comments = $html.find('.CommentLoadMoreResponse-comments').children(this.settings.selectors.commentBlock);
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
        this.$el.find(`${this.settings.selectors.prefix}-loadMore`).attr('data-visible', true);

        this.$el.trigger('Commenting:onAfterShowComments');
    },

    hideComments() {
        this.$el.trigger('Commenting:onBeforeHideComments');

        this.$hideCommentsToggle.prop('disabled', true);
        this.$showCommentsToggle.prop('disabled', false);
        this.$commentingBody.attr('data-comments-shown', false);
        this.$el.find(`${this.settings.selectors.prefix}-loadMore`).attr('data-visible', false);

        this.$el.trigger('Commenting:onAfterHideComments');
    },

    reset() {
        this.$loadMoreForm.empty();
        this.$el.find(`${this.settings.selectors.validationBlock} [data-visible]`).removeAttr('data-visible');
    }
}

export default bspUtils.plugin(false, 'bsp-community', 'commenting', {
    '_each': function(item) {
        Object.create(Commenting).init($(item), this.option(item));
    }
});
