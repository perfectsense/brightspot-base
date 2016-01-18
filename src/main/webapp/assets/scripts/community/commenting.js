import $ from 'jquery';

class commenting {

    constructor($el, options) {

        var self = this;

        self.defaults = {
            'baseParentClass' : 'comments',
            'baseClass' : 'comment',
            'commentId' : 'cid'
        };

        self.$el = $el;
        self.settings = $.extend(true, self.defaults, options);

        self.cacheElements();
        self.captureFormSubmit(self.$form);
        self.handleCommentReplyAction();
    }

    cacheElements() {
        var self = this;

        self.$form = self.$el.find('.' + self.settings.baseParentClass + '-form');
        self.$submit = self.$form.find('.' + self.settings.baseParentClass+'-form-submit-input');
        self.$commentsList = self.$el.find('.' + self.settings.baseParentClass + '-list');
    }

    captureFormSubmit($theForm) {
        var self = this;

        // TODO: integration with bsp-form for validation
        $theForm.on('submit', function(e) {
            e.preventDefault();

            var ajaxUrl = $theForm.attr('action') + '?' + $theForm.serialize();

            $theForm.addClass('loading');

            $.post(ajaxUrl, function(data) {
                // once we get back the response, if the form is inside the list, just replace it
                // otherwise, we want to add it to the top of the list
                if($theForm.parents('.' + self.settings.baseParentClass + '-list').length) {
                    $theForm.replaceWith(data);
                } else {
                    self.$commentsList.prepend(data);
                    $theForm.remove();
                }

            }).error(function() {
                //TODO: figure out how we want to do error messaging
                console.log('There has been an error submitting your response');
            });
        });
    }

    handleCommentReplyAction() {
        var self = this;

        // we go through every reply in the comments list
        self.$commentsList.find('.' + self.settings.baseClass + '-reply').on('click.commenting-reply', function(e) {
            e.preventDefault();

            var $currentReply = $(this).closest('.' + self.settings.baseClass);
            var $currentReplyBody = $currentReply.find('.' + self.settings.baseClass + '-body:first');
            var $currentReplyForm;

            // if we find a form in there, remove it, as this is someone clicking again on reply
            if($currentReply.find('.' + self.settings.baseParentClass + '-form').length) {
                $currentReply.find('.' + self.settings.baseParentClass + '-form').remove();
            } else {
                // if we do not, we want to clone the main form and append it after the reply body
                $currentReplyForm = self.$form.clone().insertAfter($currentReplyBody);

                // we add the current reply id
                $currentReplyForm.find('input[id="' + self.settings.commentId + '"]').val($currentReply.data(self.settings.commentId));

                // once we have it on the page, we also want to capture this new form's submit
                self.captureFormSubmit($currentReplyForm);
            }
        });
    }

}

export default commenting;












// define(function(require){

//     var $                           = require('jquery');
//     var bsp_utils                   = require('bsp-utils');
//     var userComment                 = require('utilities/user-comment');
//     var inview                      = require('vendor/jquery.inview');
//     var dotdotdot                   = require('dotdotdot');
//     var string_utils                = require('utilities/string');
//     var handlebars                  = require('handlebars');
//     var handlebarsTemplateManager   = require('utilities/handlebarsTemplateManager');

//     var commenting = {

//         init: function($el, options) {
//             var self = this;

//             self.$el = $el;
//             self.settings = options;

//             if (self.settings.autoLoadMore) {
//                 self._bindScroll();
//             } else {
//                 self._bindClick();
//             }

//             handlebars.registerHelper('if_eq', function(a, b, opts) {
//                 if(a == b)
//                     return opts.fn(this);
//                 else
//                     return opts.inverse(this);
//             });

//             // console.log('generating template collection');
//             handlebarsTemplateManager.generateTemplateList();
//             self.prefillName();
//             self.bindCommentNowButton();
//             self.setupSmoothScrolling();
//             self.bindReplyToCommentButton();

//         },

//         /**
//          * If someone submitted a name, it will be in local storage, so we'll drop it into the form for them
//          * This will go away once we get real authentication
//          */
//         prefillName: function() {

//             var self = this;
//             var name = commenting.grabNameFromLS();
//             if(name) {
//                 self.$el.find(self.settings.commentAreaSelector + ' .name').val(name);
//                 self.settings.prefilledName = true;
//             }

//         },

//         /**
//          * This is the "Reply" button for each comment, not the actual post. This doesn't actually do anything to do with the actual reply
//          * but rather it grabs the comment form, uses it as a template, and drops it in context of the comment
//          */
//         bindReplyToCommentButton: function() {
//             var self = this;

//             $('.comment-reply').on('click', function() {

//                 commenting.addCommentForm($(this));

//                 return false;

//             });
//         },

//         /**
//          * Helper function that does the templating and placing of the comment form
//          */
//         addCommentForm: function($replyLink) {
//             var self = this;

//             // grab the comment template out of the DOM. This already has a target id for the content post
//             var $commentFormFromTemplate = $('.comment-area-template').clone();

//             // we are not a template anymore
//             $commentFormFromTemplate.removeClass('comment-area-template');

//             // now we grab the parent comment id, that is attached to us
//             var parentCommentId = $replyLink.data('parentCommentId');

//             // go into our comment form and add the parent comment id to the comment button
//             $commentFormFromTemplate.find('.comment-now').attr('data-parent-comment-id',parentCommentId);

//             // find your parent an add the reply form after
//             if($replyLink.closest('.comment-list-item').find('.comment-area').length > 0){
//                 $replyLink.closest('.comment-list-item').find('.comment-area').remove();
//                 event.preventDefault();
//             } else {
//                 $replyLink.closest('.comment-body').after($commentFormFromTemplate);
//             }

//             if($replyLink.closest('.comment-list-item').find('.name').val().length > 0){
//                 $replyLink.closest('.comment-list-item').find('textarea').focus();
//             } else {
//                 $replyLink.closest('.comment-list-item').find('.name').focus();
//             };

//             $commentFormFromTemplate.find('.comment-now').click(function() {

//                 // the form we want to submit is your parent form, find it via closest
//                 var $form = $(this).closest('form');

//                 // comment text and name
//                 var commentText = $form.find('textarea').val();
//                 var name = $form.find('.name').val();

//                 // target id is grabbed from the comment button's target id
//                 var targetId = $(this).data('targetId');

//                 // the parent comment id is also added in there, so grab it if we can
//                 var parentCommentId = $(this).data('parentCommentId') || '';

//                 // could just check for empty here, but I like the pattern of having a validate function
//                 if (self.validate($form)) {
//                     // drop in the name to local storage to reuse later
//                     self.addNameToLS(name);

//                     // call the API
//                     var comment = userComment.comment({
//                         'name'              : name,
//                         'comment'           : commentText,
//                         'targetId'          : targetId,
//                         'parentCommentId'   : parentCommentId
//                     });

//                     $form.hide();

//                     var $loadingHTML = '<div class="ajax-loader-icon"><img src="http://d26ua9paks4zq.cloudfront.net/ac/a2/024b4d85489f9425f8c0bc25b8a2/image-ajax-loader-gif.gif" /></div>';
//                     $form.after($loadingHTML);

//                     comment.done(function() {
//                         var $commentArea = $form.closest('.comment-area');
//                         var $thanksMessage = $('<p>').addClass('comment-thanks').html('Thanks for commenting! Your comment will show up as soon as it is approved by our moderators');

//                         $commentArea.html($thanksMessage);
//                     });

//                     comment.fail(function() {
//                         alert(self.settings.errorComment);
//                         $form.show();
//                         $loadingHTML.remove();
//                     });
//                 }

//                 return false;
//             });

//             // commenting.bindCommentNowButton($replyLink);

//         },

//         /**
//          *
//          */
//         grabNameFromLS: function() {

//             var name = localStorage.getItem('commentName');

//             if (name) {
//                 return name;
//             }
//             else {
//                 return false;
//             }

//         },

//         /**
//          *
//          */
//         addNameToLS: function(name) {
//             localStorage.setItem('commentName',name);
//         },

//         /**
//          * Here we bind to the whole element for any click of the "Comment Now" button. Any click will submit the form that it belongs to
//          * This way, we handle any all comments, whether they are for the post or replies to existing comments
//          */
//         bindCommentNowButton: function() {
//             var self = this;

//             // self.$el.on('click.submitComment', self.settings.commentButtonSelector, function(){
//             $('a.comment-now').click(function() {

//                 // the form we want to submit is your parent form, find it via closest
//                 var $form = $(this).closest('form');

//                 // comment text and name
//                 var commentText = $form.find('textarea').val();
//                 var name = $form.find('.name').val();

//                 // target id is grabbed from the comment button's target id
//                 var targetId = $(this).data('targetId');

//                 // the parent comment id is also added in there, so grab it if we can
//                 var parentCommentId = $(this).data('parentCommentId') || '';

//                 // could just check for empty here, but I like the pattern of having a validate function
//                 if (self.validate($form)) {
//                     // drop in the name to local storage to reuse later
//                     self.addNameToLS(name);

//                     // call the API
//                     var comment = userComment.comment({
//                         'name'              : name,
//                         'comment'           : commentText,
//                         'targetId'          : targetId,
//                         'parentCommentId'   : parentCommentId
//                     });

//                     $form.hide();

//                     var $loadingHTML = '<div class="ajax-loader-icon"><img src="http://d26ua9paks4zq.cloudfront.net/ac/a2/024b4d85489f9425f8c0bc25b8a2/image-ajax-loader-gif.gif" /></div>';
//                     $form.after($loadingHTML);

//                     comment.done(function() {
//                         var $commentArea = $form.closest('.comment-area');
//                         var $thanksMessage = $('<p>').addClass('comment-thanks').html('Thanks for commenting! Your comment will show up as soon as it is approved by our moderators');

//                         $commentArea.html($thanksMessage);
//                     });

//                     comment.fail(function() {
//                         alert(self.settings.errorComment);
//                         $form.show();
//                         $loadingHTML.remove();
//                     });
//                 }

//                 return false;
//             });

//         },

//         /**
//          * When someone clicks on the comment anchor tags, this allows a smooth scroll down tot he commenting area
//          */
//         setupSmoothScrolling: function() {
//             var self = this;

//             $('a.comment').click(function() {

//                 // if the page you are on is the same as what you clicked on
//                 if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {
//                     var target = $(this.hash);
//                     var hash = this.hash.slice(1);

//                     // find the a name with the hash in the page and scroll there smoothly
//                     target = target.length ? target : $('[name=' + hash +']');

//                     if (target.length) {
//                         $('html,body').animate({
//                              scrollTop: target.offset().top
//                         },
//                         1000,
//                         function() {
//                             // once animation is complete, add the hash
//                             window.location.hash = hash;
//                         });

//                         return false;
//                     }
//                 }
//             });
//         },

//         /**
//          * Just a small validate function to make sure you have a comment to post. I like the pattern of a separate validate function
//          */

//         validate: function($form) {

//             var self = this;
//             var $textInput = $form.find('textarea');
//             var $name = $form.find('.name');

//             if($name.val() === '') {
//                 alert('Please enter your name.');
//                 $name.focus();
//                 return false;
//             }


//             if($textInput.val() === '') {
//                 alert('Please enter your comment.');
//                 $textInput.focus();
//                 return false;
//             }

//             return true;

//         },

//         _bindClick: function() {
//             var self = this;
//             self.$el.on('click', self.settings.loadMoreSelector, function(event){
//                 self._fetchContent(this);
//             });
//         },

//         _bindScroll: function() {
//             var self = this;

//             self.$el.find(self.settings.loadMoreSelector).one('inview', function(event, isInView, topOrBottomOrBoth) {
//                 self._fetchContent(this);
//             });
//         },

//         _bindClickEvents: function() {
//             commenting.bindReplyToCommentButton();
//         },

//         _fetchContent: function(button){
//             // console.log('calling fetch');
//             var self = this;
//             var $button = $(button);
//             var $target = self.$el.find(self.settings.targetSelector);
//             var url = $button.data('ajaxUrl');
//             var $loadingHTML;
//             var template;
//             var moreComments = '';

//             // hide the button and replace with loading icon
//             $button.hide();
//             self.$el.append(self.settings.loadingHTML);

//             $.get(url, function(data){
//                 // console.log('getting json data');
//                 // call service api to get the json data for the handlebars template
//                 }).done(function(data, moreComments){
//                     // console.log('compiling hb templates');
//                     // set the template to a var
//                     // var hbCommentingTemplate = templateCollection[0].commentingAltTemplate;
//                     var hbCommentingTemplate = templateCollection[0].commentingTemplate;
//                     // set the json data for the template to a var
//                     var commentsJson = data;
//                     commentsJson["loadType"] = self.settings.loadType;
//                     // set the compiled template to a var
//                     var postTemplate = handlebars.compile(hbCommentingTemplate);
//                     // feed the json data to the template
//                     var moreComments = postTemplate(commentsJson);
//                     // console.log('done compiling hb templates');
//                     // if we are append, we need to remove the old loading button, remove an error state in case we are retrying and remove the loading icon
//                     // if we are replacing, dont need to do any of that, just fire the new content in there
//                     if(self.settings.loadType === 'append'){
//                         // once we are successful remove the old loading button, the new stuff comes with a new one
//                         $button.remove();
//                         // remove error state just in case we are retrying
//                         $target.find('.ajax-error').remove();
//                         // remove the loading icon
//                         self.$el.find('.ajax-loader-icon').remove();
//                         // append the new content, this should include the items as well as a new load more button if necessary
//                         if( moreComments ) {
//                             // self.$el.append(moreComments);
//                             $('.comment-parent').append(moreComments);
//                         }
//                         // rebind the new load more button, if it exists
//                         if (self.settings.autoLoadMore) {
//                             self._bindScroll();
//                         }
//                     }
//                     else {
//                         if(moreComments){
//                             $('.ajax-loader-icon').remove();
//                             $('.comment-parent').html(moreComments);
//                             // Re-Bind click events for dynamically generated dom elements
//                             commenting._bindClickEvents();
//                             // console.log('appending templates to dom');
//                         }
//                     }
//                 })
//                 .fail(function(data){
//                     $target.append('<div class="ajax-error">' + self.settings.getMoreCommentsErrorMessage + '</div>');
//                     $button.show();
//                 });
//             }
//         } // end commenting

//     var thePlugin = {

//         '_defaultOptions': {
//             'commentButtonSelector'             : '.comment-now',
//             'commentFormSelector'               : '.comment-form',
//             'replyToCommentSelector'            : '.comment-reply',
//             'commentBoxTemplate'                : '.comment-area-template',
//             'commentBodySelector'               : '.comment-body',
//             'commentAreaSelector'               : '.comment-area',
//             'loadingHTML'                       : '<div class="ajax-loader-icon"><img src="http://d26ua9paks4zq.cloudfront.net/ac/a2/024b4d85489f9425f8c0bc25b8a2/image-ajax-loader-gif.gif" /></div>',
//             'thanksForComment'                  : 'Thanks for commenting! Your comment will show up as soon as it is approved by our moderators',
//             'errorComment'                      : 'There has been an error submitting your comment, please try again',
//             'prefilledName'                     : false,
//             'loadMoreSelector'                  : '.more-comments-button',
//             'loadType'                          : 'replace',
//             'getMoreCommentsErrorMessage'       : 'There has been an error, please try again',
//             'autoLoadMore'                      : false
//         },

//         '_each': function(item) {
//             var options = this.option(item);
//             var commentingInstance = Object.create(commenting);
//             commentingInstance.init($(item), options);
//         }
//     };

//     return bsp_utils.plugin(false, 'rc-module', 'commenting', thePlugin);

// });


