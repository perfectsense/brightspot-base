import $ from 'jquery'
import bspUtils from 'bsp-utils'

class Comment {
  constructor ($context, options) {
    this.$context = $context
    this.settings = $.extend({}, {
      selectors: {
        prefix: '.Comment',
        commentEntryBlock: '.CommentEntry',
        signInBlock: '.UserSignIn',
        validationBlock: '.ValidationMessages'
      }
    }, options)

    this.commentingId = this.$context.attr('data-commenting-id') ||
                        this.$context.parents('.Commenting').attr('id')

    this.$replyButton = this.$context.children(`${this.settings.selectors.prefix}-actions`).find(`${this.settings.selectors.prefix}-reply-button`)
    this.$replyForm = this.$context.children(`${this.settings.selectors.prefix}-actions`).find(`${this.settings.selectors.prefix}-reply`)

    this.$replyForm.submit((event) => {
      event.preventDefault()
      this.disableReply()
      this.onReply()
      this.$context.trigger('Comment:onRequestReplyUI', {
        commentingId: this.commentingId
      })
    })
  }

  get selectors () {
    return this.settings.selectors
  }

  onReply () {
    $.ajax({
      url: this.$replyForm.attr('action'),
      method: this.$replyForm.attr('method'),
      data: this.$replyForm.serialize()
    })
        .done((response) => {
          let $html = $(response)
          let $commentEntry = $html.find(this.settings.selectors.commentEntryBlock)
          let $signIn = $html.find(this.settings.selectors.signInBlock)

          this.reset()

          if ($commentEntry.length > 0) {
            this.renderCommentEntry($commentEntry)
          } else if ($signIn.length > 0) {
            this.renderSignIn($signIn)
          } else {
            this.onRequestError($html)
          }
        })
        .fail((data) => {
          this.onRequestError(data)
        })
  }

  renderCommentEntry ($html) {
    this.$context.children(`${this.settings.selectors.prefix}-replies`).prepend($html)
    $html.find('textarea').focus()
    this.$context.trigger('Comment:onRequestReplyUISuccess', {
      commentingId: this.commentingId,
      $comment: this.$context
    })
  }

  renderSignIn ($html) {
    this.$context.children(`${this.settings.selectors.prefix}-replies`).prepend($html)
    this.$context.trigger('Comment:onRequestReplyUISuccess')
  }

  onRequestError (data) {
    let $errorMessage = this.$context.find(`${this.settings.selectors.validationBlock}-serverError`)
    $errorMessage.attr('data-visible', '')
    this.$context.trigger('Comment:onRequestReplyUIError', { error: data })
  }

  disableReply () {
    this.$replyButton.prop('disabled', true)
  }

  enableReply () {
    this.$replyButton.prop('disabled', false)
  }

  reset () {
    this.$context.find(`${this.selectors.validationBlock} [data-visible]`).removeAttr('data-visible')
  }
}

export default bspUtils.plugin(false, 'bsp-community', 'comment', {
  '_each': function (item) {
    $(item).data('bsp-community-comment', new Comment($(item), this.option(item)))
  }
})
