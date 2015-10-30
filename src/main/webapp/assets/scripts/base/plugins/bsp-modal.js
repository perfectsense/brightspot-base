import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import vex from 'bower/vex/vex';

var bsp_modal = {

    defaults: {
        'id'    : 'modal',
        'theme' : 'default'
    },

    init: function($el, options) {

        var self = this;

        self.settings = $.extend({}, self.defaults, options);

        self.$el = $el;

        self._handleOpenLinks();
        self._handleCloseLinks();

        self.$el.attr('data-bsp-modal-' + self.settings.id,'');

        self.$el.data('bsp-modal', self);

    },

    // run through the body and grap and links to open THIS modal and hit the public API when clicked
    _handleOpenLinks: function() {
        var self = this;

        $('[data-bsp-modal-open=' + self.settings.id + ']').on('click', function() {

            self._openFromDOM();

            return false;

        });
    },

    // run through the body and grap and links to close THIS modal and hit the public API when clicked
    _handleCloseLinks: function() {

        var self = this;

        $('[data-bsp-modal-close=' + self.settings.id + ']').on('click', function() {

            self.close();

            return false;

        });
    },

    // private helper function to trigger events
    _trigger: function() {
        var self = this;
        var args = $.makeArray(arguments);
        var event = args.shift();
        args.unshift(this);

        if(self.$el) {
            self.$el.trigger.apply(self.$el, [event, args]);
        } else {
            $('body').trigger.apply($('body'), [event, args]);
        }
    },

    // passes through the vex events to create pretty native events for ourselves
    _addEvents: function() {
        var self = this;

        self.vexInstance.on('vexOpen', function(options) {
            self._trigger('bsp-modal:open', options);
        });

        self.vexInstance.on('vexClose', function(options) {
            self._trigger('bsp-modal:close', options);
        });
    },

    // private function that centers the modal in the window screen
    // alternatively if the modal is bigger than the window, we have to CSS hack
    // the height of the overlay to cover the whole modal
    _centerModal: function() {
        var self = this;

        function centering() {
            var $vexInstance = $(self.vexInstance);

            var contentHeight = $vexInstance.outerHeight();
            var windowHeight = $(window).height();

            if(contentHeight > windowHeight) {
                $(self.vexInstance).siblings('.vex-overlay').css('height', contentHeight);
            } else {
                $vexInstance.css('margin-top', (windowHeight - contentHeight)/2);
                $(self.vexInstance).siblings('.vex-overlay').css('height', 'auto');
            }
        }

        // run helper function
        centering();

        // set on a throttled resize to keep up to date if we flip a device or resize the screen
        $(window).on('resize', bsp_utils.throttle(250,function() {
            centering();
        }));

    },

    // private function to open modal from the DOM. Calls the vex open method, but also sets up
    // the centering and passes though the events. Lastly, upon close, it puts everything back the
    // way it founded, leaving the DOM intact
    _openFromDOM: function() {
        var self = this;

        vex.defaultOptions.className = 'modal-theme-' + self.settings.theme + ' modal-' + self.settings.id;

        // when we do open the modal, grab the contents of the element and drop that into the modal
        // we do not want to do a clone here, as there can be clicks and other modules tied to this DOM
        self.vexInstance = vex.open({

            content: self.$el.contents(),

            // before we close those, put the stuff back (except for the close button of course)
            beforeClose: function() {
                self.vexInstance.find('.vex-close').remove();
                self.$el.append(self.vexInstance.contents());
            }

        });

        self._centerModal();

        self._addEvents();
    },

    // public API to interact with vex. You need to pass it a jquery content object and options unless you want the default theme and id
    open: function($content, options) {
        var self = this;

        var settings = $.extend({}, self.defaults, options);

        vex.defaultOptions.className = 'modal-theme-' + settings.theme + ' modal-' + settings.id;

        self.vexInstance = vex.open({
            content: $content
        });

        self._centerModal();

        self._addEvents();
    },

    // public API to close this instance of the modal
    close: function() {
        var self = this;

        vex.close(self.vexInstance.data().vex.id);
    }

};

window.bspModal = bsp_modal;

export default bsp_modal;
