import bsp_carousel from 'bsp-carousel';

export default {
    defaults: {
        nav: {
            themeConfig: {
                centerMode: true,
                centerPadding: '0px',
                focusOnSelect: true,
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        stage: {
            themeConfig: {
                arrows: false
            }
        }
    },
    init: function($el, options) {
        this.$nav = $el.find('.bsp-carousel-nav');
        this.$stage = $el.find('.bsp-carousel-stage');
        this.options = $.extend(true, {}, this.defaults, options);

        // we we have dynamic slide load, we need to pass that onto each instance of the carousel
        if (this.options.dynamicSlideLoad) {
            this.options.nav.dynamicSlideLoad = true;
            this.options.stage.dynamicSlideLoad = true;
        }

        this.setInstanceId();
        this.buildCarousels();
        this.addEvents();
        return this;
    },
    setInstanceId: function() {
        this.instanceId = (new Date()).getTime() + '-' + Math.ceil(Math.random()*100000);
    },
    buildCarousels: function() {
        var navClass;
        var stageClass;
        if (this.options.nav != 'disable' && this.options.stage != 'disable' && !this.options.disableAsNavFor) {
            navClass = 'bsp-carousel-nav-' + this.instanceId;
            stageClass = 'bsp-carousel-stage-' + this.instanceId;
            this.$nav.addClass(navClass);
            this.$stage.addClass(stageClass);
            this.options.nav.themeConfig.asNavFor = '.' + stageClass;
            this.options.stage.themeConfig.asNavFor = '.' + navClass;
        }
        if (this.options.stage != 'disable') {
            this.stage = Object.create(bsp_carousel).init(this.$stage, this.options.stage);
        }
        if (this.options.nav != 'disable') {
            this.nav = Object.create(bsp_carousel).init(this.$nav, this.options.nav);
        }
        if (this.options.nav != 'disable' && this.options.stage != 'disable') {
            this.setCurrentThumbnail();
        }
    },
    addEvents: function() {
        var self = this;
        self.stage.bind('carousel:afterChange', function() {
            self.setCurrentThumbnail();
        });
    },
    setCurrentThumbnail: function() {
        var $navSlides = this.$nav.find('.slick-slide');
        var index = this.$stage.find('.slick-active').data('slick-index');
        $navSlides.removeClass('current');
        $navSlides.each(function(key, slide) {
            if ($(slide).data('slick-index') == index) {
                $(slide).addClass('current');
            }
        });
    }
};
