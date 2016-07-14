import $ from 'jquery';
import bspUtils from 'bsp-utils';
import Masonry from 'masonry';
import bspModal from 'bsp-modal';
import bspCarousel from 'bsp-carousel';

class Gallery {

    /**
     * Constructor for the gallery. Does not actually initialize the gallery,
     * you should call .init() when ready to initialize.
     * 
     * @param  {Element|jQuery} el
     * Main element for the gallery.
     * 
     * @param  {Object} [options]
     * Optional list of key:value pairs to set options.
     * @param  {Boolean} [options.introBackground=true]
     * Set to true (the default) to add a background to the intro.
     * Set to false to turn off the background for the intro.
     * @param  {String} [options.introBackgroundImage]
     * If an image URL is specified, the gallery will use this as the image background for the intro block.
     * If not specified, the gallery uses a randomly-selected montage of images as a background.
     * @param {Number} [options.introBackgroundMontageCount=7]
     * Maximum number of images to use for the montage background.
     */
    constructor(el, options) {
        
        this.$el = $(el);
        
        this.settings = Object.assign({}, {
            
            // Make a background from the intro block?
            // Set to false if you don't want to add a background.
            introBackground: true,
            
            // Set to image url if you want a single image instead of montage
            introBackgroundImage: '',
            
             // Max images to include in intro montage
            introBackgroundMontageCount: 7,
            
            // When in modal view, attempt to go fullscreen immediately
            fullscreen: false
            
        }, options);

        this.selectors = {
            intro: '.Gallery-intro',
            slidesContainer: '.Gallery-slides',
            slide: '.GallerySlide',
            slideImage: '.GallerySlide-image',
            slideImageImg: '.GallerySlide-image > img',
            slideImageZoom: '.GallerySlide-image-zoom',
            slideInfo: '.GallerySlide-info',
            controls: '.Gallery-controls',
            controlsCount: '.Gallery-controls-count',
            controlsButtonsList: '.Gallery-controls-buttons-list',
            controlsButtonsTiles: '.Gallery-controls-buttons-tiles',
            masonryItem: '.GallerySlide',
            modal: '.Gallery-modal',
            modalClose: '.Gallery-modalControls-close',
            modalPrev: '.Gallery-modalControls-prev',
            modalNext: '.Gallery-modalControls-next',
            modalInfo: '.Gallery-modalControls-info',
            modalCount: '.Gallery-modalControls-count',
            modalFullscreen: '.Gallery-modalControls-fullscreen',
            modalCarousel: '.Gallery-modalCarousel'
        };
        
        this.classNames = {
            introBackground: 'Gallery-intro-background',
            introBackgroundSingle: 'Gallery-intro-background-single',
            introBackgroundMontage: 'Gallery-intro-background-montage',
            controlsButtonsActive: 'Gallery-controls-buttons-active',
            viewList: 'Gallery-view-list',
            viewTiles: 'Gallery-view-tiles',
            viewActive: 'Gallery-view-active',
            viewModal: 'Gallery-view-modal',
            viewModalShowInfo: 'Gallery-view-modal-showinfo'
        };
        
        // After contructing the object, run init() to set up the gallery
    }


    /**
     * Initialize the gallery.
     */
    init() {
        this.initSlides();
        this.initIntro();
        this.initViewList();
        this.initViewTiles();
        this.initViewControls();
        this.initModal();
    }


    /**
     * Initizlize the gallery slides.
     */
    initSlides() {
        this.$slidesContainer = this.$el.find(this.selectors.slidesContainer);
    }


    /**
     * Though we do not currently support adding or removing slides,
     * making this a dynamic function that finds the slides each time
     * just in case we add functionality in the future.
     * 
     * @return {jQuery Object} A jQuery object containing all the slides.
     */
    get $slides() {
        return this.$slidesContainer.find(this.selectors.slide);
    }


    /**
     * Initialize the intro block for the gallery.
     * This adds more DOM elements to display a background image (see initIntroBackground).
     */
    initIntro() {
        let $intro = this.$el.find(this.selectors.intro);

        // Cache the intro element so we don't have to find it again
        this.$intro = $intro;

        if ($intro.length) {
            this.initIntroBackground();
        }
    }


    /**
     * Initialize the background for the intro block.
     * This adds background image(s) to the intro block (that must be styled to become a background)
     *
     * The intro starts like this:
     * <div class="Gallery-intro">This is my intro.</div>
     *
     * Then after the background is added:
     * <div class="Gallery-intro">
     *   <div class="Gallery-intro-background Gallery-intro-background-montage">
     *     <img src="...">
     *     <img src="...">
     *     ...
     *   </div>
     *   This is my intro.
     * </div>
     *
     * The Gallery-intro-background will have one of the following additional class names
     * which you can use for styling: Gallery-intro-background-single, Gallery-intro-background-montage
     */
    initIntroBackground() {
        
        // Only add a background if introBackground is true
        if (!this.settings.introBackground) {
            return;
        }
        
        // Create a background image div within the intro
        this.$introBackground = $('<div>', {'class': this.classNames.introBackground}).prependTo(this.$intro);
        
        // Set a single background image, or a montage of random images from the slides
        if (this.settings.introBackgroundImage) {
            this.initIntroBackgroundSingle();
        } else {
            this.initIntroBackgroundMontage();
        }
    }


    /**
     * Initialize the intro background with a single image.
     */
    initIntroBackgroundSingle() {
        
        // Add a class so the image can be styled
        this.$introBackground.addClass(this.classNames.introBackgroundSingle);
        
        // Add a single image to the background
        $('<img>', {src:this.settings.introBackgroundImage, alt:''}).appendTo(this.$introBackground);
    }

    
    /**
     * Initialize the intro background with a montage of images randomly chosen from the slides.
     */
    initIntroBackgroundMontage() {
        
        // Maybe use CSS like this?
        // https://css-tricks.com/seamless-responsive-photo-grid/
        
        // Add a class so the images can be styled
        this.$introBackground.addClass(this.classNames.introBackgroundMontage);
        
        // Add all the slide images to the background so they can be styled in a montage
        let urls = this.slideImages;
        urls = this.shuffle(urls);
        for (let i=0; i < urls.length && i < this.settings.introBackgroundMontageCount; i++) {
            $('<img>', {src:urls[i], alt:''}).appendTo(this.$introBackground);
        }
    }


    /**
     * Initialize the gallery controls to switch from list to tile mode.
     * The gallery controls consist of the following parts:
     * Slide count ("64 Photos")
     * Button to switch to List view
     * Button to switch to Tile view
     * 
     * The HTML is expected to look like this:
     * <div class="Gallery-controls">
     *   <div class="Gallery-controls-count">64 Photos</div>
     *   <div class="Gallery-controls-buttons">
     *     <a href="" class="Gallery-controls-buttons-list">List</a>
     *     <a href="" class="Gallery-controls-buttons-tiles">Tiles</a>
     *   </div>
     * </div>
     */
    initViewControls() {
        
        // Find the control hooks within the DOM
        this.$controlsCount = this.$el.find(this.selectors.controlsCount);
        this.$controlsButtonsList = this.$el.find(this.selectors.controlsButtonsList);
        this.$controlsButtonsTiles = this.$el.find(this.selectors.controlsButtonsTiles);
        
        // Set up click events for the buttons
        this.$controlsButtonsList.on('click', event => {
            this.modeSetList();
            return false;
        });
        this.$controlsButtonsTiles.on('click', event => {
            this.modeSetTiles();
            return false;
        });
        
        // Set the initial mode to "List"
        this.modeSetList();

        // Update the slide count
        this.controlsUpdateCount();
    }

    
    initViewList() {
        let $viewList;
        
        // Duplicate the slide container
        // Note: must use CSS to show and hide the list!
        $viewList = this.$slidesContainer.clone()
            .addClass(this.classNames.viewList)
            .insertAfter(this.$slidesContainer);

        // Cache for later use
        this.$viewList = $viewList;
    }

    
    initViewTiles() {
        let $viewTiles;
        
        // Duplicate the slide container
        // Note: must use CSS to show and hide the tiles!
        $viewTiles = this.$slidesContainer.clone()
            .addClass(this.classNames.viewTiles)
            .insertAfter(this.$slidesContainer);

        // Cache for later use
        this.$viewTiles = $viewTiles;
        
        // Set up masonry layout
        this.masonry = new Masonry($viewTiles[0], {
            
            itemSelector: this.selectors.masonryItem,
            
            // Turn off animations
            transitionDuration: 0,
            
            // The left-right gutter between masonry tiles can only be set in the javascript.
            // Hardcoded for now but should be some kind of option.
            gutter: 20
        });
    }


    /**
     * Initialize the event handlers to show modal view when user clicks image,
     * plus set up the modal popup.
     */
    initModal() {
                
        // Find the modal container
        this.$modal = this.$el.find(this.selectors.modal);
        if (!this.$modal.length) {
            // If we can't find the modal container don't bother continuing
            // because we cannot support zooming
            return;
        }
        this.$modal.detach();

        // Turn the modal container into a modal but don't open it.
        // Note this will remove the modal container from the DOM.
        this.modal = Object.create(bspModal);
        this.modal.init(this.$modal, {theme: 'Gallery', id: 'Gallery'});
        
        // Create a single event handler for all clicks on slideImage containers.
        // This container contains the modal controls, the slide image, and possibly other
        // things like social media share buttons.
        this.$el.on('click', this.selectors.slideImage, (event) => {
            
            let $target = $(event.target);
                        
            // Only do something if clicking on the slide image or the modal control
            // Do not do anything if clicking on other things in the image container
            // (like social media share buttons)
            if ($target.is(this.selectors.slideImageImg) || $target.is(this.selectors.slideImageZoom)) {
                // Get the start of the slide that was clicked
                let $slide = $target.closest(this.selectors.slide);
                let $siblings = $slide.parent().find(this.selectors.slide);
                let slideIndex = $siblings.index($slide);
                
                // Display the modal and start on the slide that was clicked
                this.modalOpen(slideIndex);
            }
            return false;
        });
    }
    
    
    /**
     * Open the modal to display a slide carousel.
     * 
     * @param  {Number} index
     * The index of the slide to zoom (0=first slide, n-1=last slide)
     */
    modalOpen(index) {

        let $modalCarousel;
        let $modalSlides;
        
        // Because the vex modal calls jQuery.remove() when the modal is closed,
        // all the jQuery events are destroyed, so we need to create the events
        // each time we open the modal.
        this.$modal.find(this.selectors.modalClose).on('click', event => {
            this.modalClose();
            return false;
        });
        this.$modal.find(this.selectors.modalPrev).on('click', event => {
            this.modalPrev();
            return false;
        });
        this.$modal.find(this.selectors.modalNext).on('click', event => {
            this.modalNext();
            return false;
        });
        this.$modal.find(this.selectors.modalInfo).on('click', event => {
            this.modalInfoToggle();
            return false;
        });
        this.$modal.find(this.selectors.modalFullscreen).on('click', event => {
            this.modalFullscreen();
            return false;
        });

        // Open the modal, using class 'modal-theme-gallery'
        this.modal.open(this.$modal, {theme: 'gallery', id: 'gallery'});
        
        // Because the vex modal calls jQuery.remove() when the modal is closed,
        // all the jQuery events are destroyed, so we need to recreate the carousel.
        $modalCarousel = this.$modal.find(this.selectors.modalCarousel);
        $modalCarousel.empty();
        $modalSlides = this.$slidesContainer.clone().addClass(this.classNames.viewModal).appendTo($modalCarousel);

        // Whenever the carousel slide changes update the count
        $modalCarousel.on('afterChange', event => {
            this.modalUpdateCount();
        });
        
        // Create the carousel within the modal
        this.carousel = Object.create(bspCarousel);
        this.carousel.init($modalSlides, {
            // theme: '',
            themeConfig: {
                initialSlide: index,
                arrows: false
            }
        });
        
        // Intialize the count so it shows the initial slide number
        this.modalUpdateCount();
        
        // Hide the info by default
        this.modalInfoHide();
        
        // Optionally go to full screen mode
        if (this.settings.fullscreen) {
            this.modalFullscreen();
        }
    }
    
    
    /**
     * When in modal view, close the modal and return to the gallery.
     */
    modalClose() {
        if (this.modal) {
            this.modal.close();
        }
    }

    
    /**
     * When in modal view, go to the next slide in the carousel.
     */
    modalNext() {
        if (this.carousel) {
            this.carousel.next();
        }
    }
    
    
    /**
     * When in modal view, go to the previous slide in the carousel.
     */
    modalPrev() {
        if (this.carousel) {
            this.carousel.prev();
        }
    }
    
    
    /**
     * Toggle show or hide the slide info in the modal view.
     * @param  {Boolean} [show=toggle]
     * Use true to show the info, or false to hide the info.
     * If not specied, the default is to toggle the current state.
     */
    modalInfoToggle(flag) {
        let show;
        show = (flag === undefined) ? !this.modalInfoIsShowing() : flag;
        if (show) {
            this.modalInfoShow();
        } else {
            this.modalInfoHide();
        }
    }
    
    
    /**
     * Show the slide info when in modal mode.
     */
    modalInfoShow() {
        this.$modal.addClass(this.classNames.viewModalShowInfo);
    }
    
    
    /**
     * Hide the slide info when in modal view.
     */
    modalInfoHide() {
        this.$modal.removeClass(this.classNames.viewModalShowInfo);        
    }
    
    
    /**
     * Determine if the slide info is currently showing in modal view.
     * @return {Boolean} Returns true if the info is currently showing.
     */
    modalInfoIsShowing() {
        return this.$modal.hasClass(this.classNames.viewModalShowInfo);
    }
    
    
    /**
     * When in modal view, update the slide count (current slide and total number of slides).
     */
    modalUpdateCount() {
        let $count;
        let currentSlide;
        if (this.carousel) {
            $count = this.$modal.find(this.selectors.modalCount);
            currentSlide = this.carousel.currentSlide() + 1;
            $count.text(currentSlide + '/' + this.carousel.slideCount());
        }
    }
    
    
    /**
     * Take the modal view to full screen width.
     * 
     * Note this can be called only from a user-intiated event (like a click event handler)
     * and may not work in all browsers or in other situations (like when running in an iframe).
     */
    modalFullscreen() {
        
        let el = this.$modal[0];
        
        if (!el) {
            return;
        }
                
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    }

    
    /**
     * Get a list of slide images.
     * @return {Array of Strings} Array of slide image urls.
     */
    get slideImages() {
        let urls = [];
        this.$el.find(this.selectors.slideImage).each((i, el) => {
            // Find the first img element within the slideImage block
            let src = $(el).find('img').attr('src');
            if (src) {
                urls.push(src)
            }
        });
        return urls;
    }
    
    
    /**
     * Return the number of slides in the gallery.
     * @return {Number} Number of slides in the gallery.
     */
    get count() {
        return this.$slides.length;
    }


    /**
     * Set the gallery count display ("13 Photos").
     */
    controlsUpdateCount() {
        // Template "13 Photos" is hardcoded.
        // Should probably make an option to configure the template.
        this.$controlsCount.html(`${this.count} Photos`);
    }


    /**
     * Set the mode to List mode.
     * Hides the tile display, shows the list display, and makes the List button active.
     */
    modeSetList() {
        this._modeClear();
        this.$controlsButtonsList.addClass(this.classNames.controlsButtonsActive);
        this.$viewList.addClass(this.classNames.viewActive);
    }

    
    /**
     * Set the mode to Tiles mode.
     * Hides the list display, shows the tiles display, and makes the Tiles button active.
     */
    modeSetTiles() {
        this._modeClear();
        this.$controlsButtonsTiles.addClass(this.classNames.controlsButtonsActive);
        this.$viewTiles.addClass(this.classNames.viewActive);
        this.masonry.layout();
    }


    /**
     * Clear the mode display (list or tile mode). This unsets the active button and hides all modes.
     */
    _modeClear() {
        
        this.$controlsButtonsTiles.removeClass(this.classNames.controlsButtonsActive);
        this.$viewTiles.removeClass(this.classNames.viewActive);
        
        this.$controlsButtonsList.removeClass(this.classNames.controlsButtonsActive);
        this.$viewList.removeClass(this.classNames.viewActive);
    }


    /**
     * Randomly shuffle an array in place.
     * @param  {Array} array
     * @return {Array}
     */
    shuffle(array) {
        let currentIndex = array.length;
        let temporaryValue;
        let randomIndex;
        
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        
        return array;
    }
}


// Set up a bspUtils.plugin so an element with data-bsp-gallery-list
// will automatically create a Gallery list
export default bspUtils.plugin(false, 'bsp-gallery', 'list', {
    
    '_each': function(item) {
        
        // Get options from the data-bsp-gallery-options attribute
        let options = this.option(item);
        
        // Create the gallery object
        let gallery = new Gallery(item, options);
                
        // Save the Gallery object on the element so it can be accessed later if necessary
        $(item).data('bsp-gallery', gallery);
        
        // Run it!
        gallery.init();
    }
});
