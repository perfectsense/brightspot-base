import $ from 'jquery';
import bspUtils from 'bsp-utils';
import Masonry from 'masonry';

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
            introBackgroundMontageCount: 7
            
        }, options);

        this.selectors = {
            intro: '.Gallery-intro',
            slidesContainer: '.Gallery-slides',
            slide: '.GallerySlide',
            slideImage: '.GallerySlide-image',
            slideInfo: '.GallerySlide-info',
            controls: '.Gallery-controls',
            controlsCount: '.Gallery-controls-count',
            controlsButtonsList: '.Gallery-controls-buttons-list',
            controlsButtonsTiles: '.Gallery-controls-buttons-tiles'
        };
        
        this.classNames = {
            introBackground: 'Gallery-intro-background',
            introBackgroundSingle: 'Gallery-intro-background-single',
            introBackgroundMontage: 'Gallery-intro-background-montage',
            controlsButtonsActive: 'active',
            viewList: 'Gallery-view-list',
            viewTiles: 'Gallery-view-tiles'
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
        this.initControls();
    }


    /**
     * Initizlize the gallery slides.
     */
    initSlides() {
        this.$slidesContainer = this.$el.find(this.selectors.slidesContainer).hide();
    }


    /**
     * Though we do not currently support adding or removing slides,
     * making this a dynamic function that finds the slides each time
     * just in case we add functionality in the future.
     * 
     * @return {jQuery Object} A jQuery object containing all the slides.
     */
    get $slides() {
        return this.$el.find(this.selectors.slide);
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
    initControls() {
        
        // Find the control hooks within the DOM
        this.$controls = this.$el.find(this.selectors.controls);
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
        $viewList = this.$slidesContainer.clone().hide()
            .addClass(this.classNames.viewList)
            .insertAfter(this.$slidesContainer);

        // Cache for later use
        this.$viewList = $viewList;
    }

    
    initViewTiles() {
        let $viewTiles;
        
        // Duplicate the slide container
        $viewTiles = this.$slidesContainer.clone().hide()
            .addClass(this.classNames.viewTiles)
            .insertAfter(this.$slidesContainer);

        // Cache for later use
        this.$viewTiles = $viewTiles;
    }

    
    reset() {
    }


    remove() {
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
    
    
    get count() {
        return this.$slides.length;
    }


    controlsUpdateCount() {
        this.$controlsCount.html(`${this.count} Photos`);
    }


    /**
     * Set the mode to List mode.
     * Hides the tile display, shows the list display, and makes the List button active.
     */
    modeSetList() {
        this._modeClear();
        this.$controlsButtonsList.addClass(this.classNames.controlsButtonsActive);
        this.$viewList.show();
    }

    
    /**
     * Set the mode to Tiles mode.
     * Hides the list display, shows the tiles display, and makes the Tiles button active.
     */
    modeSetTiles() {
        this._modeClear();
        this.$controlsButtonsTiles.addClass(this.classNames.controlsButtonsActive);
        this.$viewTiles.show();
    }


    /**
     * Clear the mode - unset the active button and hide all modes.
     */
    _modeClear() {
        
        this.$controlsButtonsTiles.removeClass(this.classNames.controlsButtonsActive);
        this.$viewTiles.hide();
        
        this.$controlsButtonsList.removeClass(this.classNames.controlsButtonsActive);
        this.$viewList.hide();
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
        $(item).data('bsp-gallery-list', gallery);
        
        // Run it!
        gallery.init();
    }
});
