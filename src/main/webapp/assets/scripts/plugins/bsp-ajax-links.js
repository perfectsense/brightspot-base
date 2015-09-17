import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import historyAPI from 'native.history';

var bsp_search_results = {

    defaults: {
        dataName : 'data-ajax-link-target',
        historyReplace : true,
        loadType : 'replace'
    },

    init: function($el, options) {

        var self = this;
        self.$el = $el;
        self.settings = $.extend({}, self.defaults, options);

        self.$ajaxLinks = self.findAllLinksWithTargets();

        self.replaceNativeActionWithAjax();

    },

    _createHistoryEvent() {
        var self = this;

        History.Adapter.bind(window,'statechange',function(){
            var state = History.getState();

            if (state.data.target) {

                self.ajaxInContent({
                    target : state.data.target,
                    href : state.cleanUrl,
                    loadType : 'replace',
                    $link : state.data.$link || false
                });

            }

        });
    },

    findAllLinksWithTargets() {
        var self = this;

        return self.$el.find('[' + self.settings.dataName + ']');
    },

    replaceNativeActionWithAjax() {
        var self = this;

        self.$ajaxLinks.each(function() {

            var $this = $(this);
            var linkTarget = $(this).attr(self.settings.dataName);
            var linkHref = $(this).attr('href');
            var isForm = false;

            if(!linkHref) {
                if ($this.attr('action')) {
                    linkHref = $(this).attr('action');
                    isForm = true;
                } else {
                    return false;
                }
            }

            if(isForm) {

                $this.on('submit', function(e) {
                    e.preventDefault();

                    var formData = $this.serialize();

                    if(formData.indexOf('?') === -1) {
                        linkHref += '?' + formData;
                    } else {
                        linkHref += '&' + formData;
                    }

                    if(self.settings.historyReplace) {

                        var state = History.getState();

                        if (!state.data.target) {
                            History.replaceState({
                                target : linkTarget,
                                loadType : 'replace'
                            },'', window.location.href);
                        }

                        History.pushState({
                            target : linkTarget,
                            loadType : 'replace'
                        },'', linkHref);

                    } else {
                        self.ajaxInContent({
                            target : linkTarget,
                            loadType : self.settings.loadType,
                            href : linkHref
                        });
                    }

                });

            } else {

                $this.on('click', function(e) {
                    e.preventDefault();

                    if(self.settings.historyReplace) {

                        if (!state.data.target) {
                            History.replaceState({
                                target : linkTarget,
                                loadType : 'replace'
                            },'', window.location.href);
                        }

                        History.pushState({
                            target : linkTarget,
                            loadType : 'replace',
                            $link : $this
                        },'', linkHref);

                    } else {

                        self.ajaxInContent({
                            target : linkTarget,
                            loadType : self.settings.loadType,
                            href : linkHref,
                            $link : $this
                        });

                    }
                });

            }

        });

    },

    ajaxInContent(options) {

        var $target = $(options.target);

        $target.addClass('bsp-loading-ajax');

        if(options.loadType == 'replace') {
            $target.html('');
        } else {
            if(options.loadType == 'append') {
                if(options.$link) {
                    options.$link.remove();
                }
            }
        }

        $.get(options.href, function(data) {

            var $div = $('<div>');

            var $data = $div.html(data);

            var cleanData = $div.find(options.target);

            // something went wrong and we do not have data. Refresh the page
            if(!cleanData.length) {
                window.location.reload();
            }

            $target.removeClass('bsp-loading-ajax');

            if(options.loadType == 'replace') {
                $target.html(cleanData);
            } else {
                if(options.loadType == 'append') {
                    $target.append(cleanData);
                }
            }

        });

    }


};

export default bsp_search_results;
