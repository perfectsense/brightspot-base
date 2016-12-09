import $ from 'jquery'
import bspUtils from 'bsp-utils'
import Masonry from 'masonry'
import bspModal from 'bsp-modal'
import bspCarousel from 'bsp-carousel'

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
   *
   * *** EVENTS ***
   * Events are triggered on the main element for the gallery. The following events are available.
   * Gallery-modal-open, Gallery-modal-close, Gallery-carousel-after-change, Gallery-carousel-onInitialized
   *
   * Each event handler receives the following arguments: (event, galleryObject, ...other)
   *
   * For example, to listen for the modal-open event:
   * $('#mygallery').on('Gallery-modal-open', function(event, galleryObj) { ...});
   *
   * Or to listen for carousel changes:
   * $('#mygallery').on('Gallery-carousel-after-change', function(event, galleryObj, carouselObj, index) { ...});
   */
  constructor (el, options) {
    this.$el = $(el)

    this.settings = Object.assign({}, {

      // Allow classnames to be overridden easily
      classNameMain: 'Gallery',
      classNameSlide: 'GallerySlide',
      attrNameMain: 'data-gallery',

      // Allow event name to be overridden.
      // Events are like eventName + "-" + name
      // For example: "Gallery-modal-open"
      eventName: 'Gallery',

      // Make a background from the intro block?
      // Set to false if you don't want to add a background.
      introBackground: true,

      // Set to image url if you want a single image instead of montage
      introBackgroundImage: '',

      // Max images to include in intro montage
      introBackgroundMontageCount: 7,

      // When in modal view, attempt to go fullscreen immediately
      fullscreen: false

    }, options)

    // Selectors used to find various elements within the gallery HTML
    let cn = this.settings.classNameMain
    let cnSlide = this.settings.classNameSlide
    this.selectors = {
      main: `.${cn}`,
      intro: `.${cn}-intro`,
      slidesContainer: `.${cn}-slides`,
      slide: `.${cnSlide}`,
      slideMedia: `.${cnSlide}-media`,
      slideMediaImg: `.${cnSlide}-mediaContent > img`,
      slideMediaZoom: `.${cnSlide}-mediaControlsZoom`,
      controlsCount: `.${cn}-controls-count`,
      controlsButtonsList: `.${cn}-controls-buttons-list`,
      controlsButtonsTiles: `.${cn}-controls-buttons-tiles`,
      masonryItem: `.${cnSlide}`,
      modal: `.${cn}-modal`,
      modalClose: `.${cn}-modalControlsClose`,
      modalFullscreen: `.${cn}-modalControlsFullscreen`,
      modalPrev: `.${cn}-modalControlsPrev`,
      modalNext: `.${cn}-modalControlsNext`,
      modalInfo: `.${cn}-modalControlsInfo`,
      modalCount: `.${cn}-modalControlsCount`,
      modalCarousel: `.${cn}-modalCarousel`
    }

    // Class names for elements added by the javascript
    this.classNames = {
      // A background div is added behind the gallery info so we can display
      // a single image or a montage of images
      introBackground: `${cn}-intro-background`
    }

    // Attributes added to certain elements to affect the layout
    let attr = this.settings.attrNameMain // "data-gallery" by default
    this.attr = {

      // If this is a "singleton" gallery set an attribute
      singleton: `${attr}-singleton`,

      // The gallery background can be 'single' or 'montage'
      introBackground: `${attr}-intro-background`,

      // The gallery view can be "list" or "tiles" or "modal"
      view: `${attr}-view`,

      // When a view is active, this attribute is added so the view can be shown
      viewActive: `${attr}-view-active`,

      // When a button is active this attribute is added so the button can be styled differently
      buttonActive: `${attr}-button-active`,

      // In modal view, the info can be toggled.
      // This attribute is added when the info is toggled on.
      showInfo: `${attr}-showinfo`,

      // In modal view, the navigation should be displayed only if there are multiple slides
      hideNav: `${attr}-hidenav`,

      // In modal view, the fullscreen icon should be displayed only if fullscreen is supported by the browser
      fullscreenIsSupported: `${attr}-fullscreen-is-supported`
    }

    // After constructing the object, run init() to set up the gallery
  }

  /**
   * Initialize the gallery.
   */
  init () {
    this.initSlides()
    if (this.$slides.length < 2) {
      this.initSingleton()
    } else {
      this.initIntro()
      this.initViewList()
      this.initViewTiles()
      this.initViewControls()
    }
    this.modalInit()
    this.trigger('carousel-onInitialized')
  }

  /**
   * Initialize the gallery slides.
   */
  initSlides () {
    this.$slidesContainer = this.$el.find(this.selectors.slidesContainer)
  }

  /**
   * Initialize the gallery in "singleton" mode where this is only one slide,
   * but there could be multiple singleton galleries on the page tied together
   * by a common id.
   */
  initSingleton () {
    // Set an attribute 'data-gallery-singleton' to the gallery can be styled differently.
    // Also set it to the optional id for the singleton, so if the user opens the modal
    // we can gather up all the slides that have the same id and let the user navigate
    // between them all.
    this.settings.singleton = true
    this.$el.attr(this.attr.singleton, this.settings.id || '')
  }

  /**
   * Get a jQuery Object containing all the slides.
   *
   * Though we do not currently support adding or removing slides,
   * making this a dynamic function that finds the slides each time
   * just in case we add functionality in the future.
   *
   * @return {jQuery Object} A jQuery object containing all the slides.
   */
  get $slides () {
    return this.$slidesContainer.find(this.selectors.slide)
  }

  /**
   * Initialize the intro block for the gallery.
   * This adds more DOM elements to display a background image (see initIntroBackground).
   */
  initIntro () {
    let $intro = this.$el.find(this.selectors.intro)

    // Cache the intro element so we don't have to find it again
    this.$intro = $intro

    if ($intro.length) {
      this.initIntroBackground()
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
  initIntroBackground () {
    // Only add a background if settings.introBackground is true
    if (!this.settings.introBackground) {
      return
    }

    // Create a background image div within the intro
    this.$introBackground = $('<div>', {'class': this.classNames.introBackground}).prependTo(this.$intro)

    // Set a single background image, or a montage of random images from the slides
    if (this.settings.introBackgroundImage) {
      this.initIntroBackgroundSingle()
    } else {
      this.initIntroBackgroundMontage()
    }
  }

  /**
   * Initialize the intro background with a single image.
   */
  initIntroBackgroundSingle () {
    // Add an attribute so the image can be styled
    this.$introBackground.attr(this.attr.introBackground, 'single')

    // Add a single image to the background
    $('<img>', {src: this.settings.introBackgroundImage, alt: ''}).appendTo(this.$introBackground)
  }

  /**
   * Initialize the intro background with a montage of images randomly chosen from the slides.
   */
  initIntroBackgroundMontage () {
    // Get the image urls from the slides and randomize the order
    let urls = this.slideImages
    urls = this.shuffle(urls)

    // If there are not enough images for the montage, switch to single image with a random image
    if (urls.length && urls.length < this.settings.introBackgroundMontageCount) {
      this.settings.introBackgroundImage = urls[0]
      this.initIntroBackgroundSingle()
      return
    }

    // Add an attribute so the images can be styled
    this.$introBackground.attr(this.attr.introBackground, 'montage')

    // Add all the slide images to the background so they can be styled in a montage
    for (let i = 0; i < urls.length && i < this.settings.introBackgroundMontageCount; i++) {
      $('<img>', {src: urls[i], alt: ''}).appendTo(this.$introBackground)
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
  initViewControls () {
    // Find the control hooks within the DOM
    this.$controlsCount = this.$el.find(this.selectors.controlsCount)
    this.$controlsButtonsList = this.$el.find(this.selectors.controlsButtonsList)
    this.$controlsButtonsTiles = this.$el.find(this.selectors.controlsButtonsTiles)

    // Set up click events for the buttons
    this.$controlsButtonsList.on('click', event => {
      this.modeSetList()
      return false
    })
    this.$controlsButtonsTiles.on('click', event => {
      this.modeSetTiles()
      return false
    })

    // Set the initial mode to "List"
    this.modeSetList()

    // Update the slide count
    this.controlsUpdateCount()
  }

  initViewList () {
    let $viewList

    // Duplicate the slide container
    // Note: must use CSS to show and hide the list!
    $viewList = this.$slidesContainer.clone()
            .attr(this.attr.view, 'list')
            .insertAfter(this.$slidesContainer)

    // Cache for later use
    this.$viewList = $viewList
  }

  initViewTiles () {
    let $viewTiles

    // Duplicate the slide container
    // Note: must use CSS to show and hide the tiles!
    $viewTiles = this.$slidesContainer.clone()
            .attr(this.attr.view, 'tiles')
            .insertAfter(this.$slidesContainer)

    // Cache for later use
    this.$viewTiles = $viewTiles

    // Set up masonry layout
    this.masonry = new Masonry($viewTiles[0], {

      itemSelector: this.selectors.masonryItem,

      // Turn off animations
      transitionDuration: 0,

      // The left-right gutter between masonry tiles can only be set in the javascript.
      // Hardcoded for now but should be some kind of option.
      gutter: 20
    })
  }

  /**
   * Initialize the event handlers to show modal view when user clicks image,
   * plus set up the modal popup.
   */
  modalInit () {
    // Find the modal container
    this.$modal = this.$el.find(this.selectors.modal)
    if (!this.$modal.length) {
      // If we can't find the modal container don't bother continuing
      // because we cannot support zooming
      return
    }
    this.$modal.detach()

    // Add an attribute to the modal to indicate if fullscreen mode is supported
    // so we can use CSS to display or hide the fullscreen icons
    if (this.fullscreenIsSupported()) {
      this.$modal.attr(this.attr.fullscreenIsSupported, '')
    }

    // Turn the modal container into a modal but don't open it.
    // Note this will remove the modal container from the DOM.
    this.modal = Object.create(bspModal)
    this.modal.init(this.$modal, {theme: 'Gallery', id: 'Gallery'})

    // Create a single event handler for all clicks on slideMedia containers.
    // This container contains the modal controls, the slide image, and possibly other
    // things like social media share buttons.
    this.$el.on('click', this.selectors.slideMedia, (event) => {
      let $target = $(event.target)

      // Only do something if clicking on the slide image or the modal control
      // Do not do anything if clicking on other things in the image container
      // (like social media share buttons)
      if ($target.is(this.selectors.slideMediaImg) || $target.is(this.selectors.slideMediaZoom)) {
        // Get the start of the slide that was clicked
        let $slide = $target.closest(this.selectors.slide)
        let $siblings = $slide.parent().find(this.selectors.slide)
        let slideIndex = $siblings.index($slide)

        // Display the modal and start on the slide that was clicked
        this.modalOpen(slideIndex)
      }
      return false
    })
  }

  /**
   * Open the modal to display a slide carousel.
   *
   * @param  {Number} index
   * The index of the slide to zoom (0=first slide, n-1=last slide)
   */
  modalOpen (index) {
    let $modalCarousel
    let $modalSlides

    // Because the vex modal calls jQuery.remove() when the modal is closed,
    // all the jQuery events are destroyed, so we need to create the events
    // each time we open the modal.
    this.$modal.find(this.selectors.modalClose).on('click', event => {
      this.modalClose()
      return false
    })
    this.$modal.find(this.selectors.modalPrev).on('click', event => {
      this.modalPrev()
      return false
    })
    this.$modal.find(this.selectors.modalNext).on('click', event => {
      this.modalNext()
      return false
    })
    this.$modal.find(this.selectors.modalInfo).on('click', event => {
      this.modalInfoToggle()
      return false
    })
    this.$modal.find(this.selectors.modalFullscreen).on('click', event => {
      this.modalFullscreen()
      return false
    })

    // When the modal closes trigger an event on the gallery
    this.$modal.off('bsp-modal:close').on('bsp-modal:close', (event, ...eventArgs) => {
      this.trigger('modal-close')
    })

    // Open the modal, using class 'modal-theme-gallery'
    this.modal.open(this.$modal, {theme: 'gallery', id: 'gallery'})

    // Because the vex modal calls jQuery.remove() when the modal is closed,
    // all the jQuery events are destroyed, so we need to recreate the carousel.
    $modalCarousel = this.$modal.find(this.selectors.modalCarousel)
    $modalCarousel.empty()

    // If this is a singleton gallery, and it has an id that will be used to tie multiple galleries together,
    // grab all the slides on the page that share the same id.
    if (this.settings.singleton && this.settings.id) {
      $modalSlides = this.$slidesContainer.clone().empty().attr(this.attr.view, 'modal').appendTo($modalCarousel)

      // Find all the galleries that match our gallery id
      let $galleries = $(this.selectors.main).filter((index, el) => {
        let id = $(el).attr(this.attr.singleton) || ''
        return id === this.settings.id
      })

      // Get all the slides within the matching galleries
      let $slides = $galleries.find(this.selectors.slide)

      // Update the index number for the slide we want to show first
      index = $slides.index(this.$slides[0]) || 0

      // Clone the slides and add them to the modal
      $slides.clone().appendTo($modalSlides)
    } else {
      // This is not a singleton gallery with an id, so just get the slides from this gallery
      $modalSlides = this.$slidesContainer.clone().attr(this.attr.view, 'modal').appendTo($modalCarousel)
    }

    // Whenever the carousel slide changes update the count, and trigger an event
    $modalCarousel.on('afterChange', (event, ...eventArgs) => {
      this.modalUpdateCount()

      // Trigger a gallery event, and pass along all the data from the carousel event.
      // In this case, eventArgs would include the carousel object, plus the slide index (0..n)
      this.trigger('carousel-after-change', ...eventArgs)
    })

    // Create the carousel within the modal
    this.carousel = Object.create(bspCarousel)
    this.carousel.init($modalSlides, {
      // theme: '',
      themeConfig: {
        initialSlide: index,
        arrows: false
      }
    })

    // Focus on the carousel the keyboard navigation will work
    this.$modal.find('.slick-list').focus()

    // Intialize the count so it shows the initial slide number
    this.modalUpdateCount()

    // Hide the info by default
    this.modalInfoHide()

    // Optionally go to full screen mode
    if (this.settings.fullscreen) {
      this.modalFullscreen()
    }

    // When the modal opens trigger an event on the gallery
    this.trigger('modal-open')
  }

  /**
   * When in modal view, close the modal and return to the gallery.
   */
  modalClose () {
    if (this.modal) {
      this.modal.close()
    }
  }

  /**
   * When in modal view, go to the next slide in the carousel.
   */
  modalNext () {
    if (this.carousel) {
      this.carousel.next()
    }
  }

  /**
   * When in modal view, go to the previous slide in the carousel.
   */
  modalPrev () {
    if (this.carousel) {
      this.carousel.prev()
    }
  }

  /**
   * Toggle show or hide the slide info in the modal view.
   * @param  {Boolean} [show=toggle]
   * Use true to show the info, or false to hide the info.
   * If not specied, the default is to toggle the current state.
   */
  modalInfoToggle (flag) {
    let show
    show = (flag === undefined) ? !this.modalInfoIsShowing() : flag
    if (show) {
      this.modalInfoShow()
    } else {
      this.modalInfoHide()
    }
  }

  /**
   * Show the slide info when in modal mode.
   */
  modalInfoShow () {
    this.$modal.attr(this.attr.showInfo, '')
  }

  /**
   * Hide the slide info when in modal view.
   */
  modalInfoHide () {
    this.$modal.removeAttr(this.attr.showInfo)
  }

  /**
   * Determine if the slide info is currently showing in modal view.
   * @return {Boolean} Returns true if the info is currently showing.
   */
  modalInfoIsShowing () {
    return this.$modal[0].hasAttribute(this.attr.showInfo)
  }

  /**
   * Show the slide navigation when in modal mode.
   */
  modalNavShow () {
    this.$modal.removeAttr(this.attr.hideNav)
  }

  /**
   * Hide the slide navigation when in modal view.
   */
  modalNavHide () {
    this.$modal.attr(this.attr.hideNav, '')
  }

  /**
   * When in modal view, update the slide count (current slide and total number of slides).
   */
  modalUpdateCount () {
    let $count
    let currentSlide
    let total
    if (this.carousel) {
      $count = this.$modal.find(this.selectors.modalCount)
      currentSlide = this.carousel.currentSlide() + 1
      total = this.carousel.slideCount()
      $count.text(currentSlide + '/' + total)

      // Add an attribute so the navigation can be hidden if there is only one slide
      if (total > 1) {
        this.modalNavShow()
      } else {
        this.modalNavHide()
      }
    }
  }

  /**
   * Take the modal view to full screen width.
   *
   * Note this can be called only from a user-intiated event (like a click event handler)
   * and may not work in all browsers or in other situations (like when running in an iframe).
   */
  modalFullscreen () {
    let el = this.$modal[0]

    if (el) {
      this.fullscreenElement(el)
    }
  }

  /**
   * Get a list of slide images.
   * @return {Array of Strings} Array of slide image urls.
   */
  get slideImages () {
    let urls = []
    this.$el.find(this.selectors.slideMedia).each((i, el) => {
      // Find the first img element within the slideMedia block
      let src = $(el).find('img').attr('src')
      if (src) {
        urls.push(src)
      }
    })
    return urls
  }

  /**
   * Return the number of slides in the gallery.
   * @return {Number} Number of slides in the gallery.
   */
  get count () {
    return this.$slides.length
  }

  /**
   * Set the gallery count display ("13 Photos").
   */
  controlsUpdateCount () {
    // Template "13 Photos" is hardcoded.
    // Should probably make an option to configure the template.
    this.$controlsCount.html(`${this.count} Photos`)
  }

  /**
   * Set the mode to List mode.
   * Hides the tile display, shows the list display, and makes the List button active.
   */
  modeSetList () {
    this._modeClear()
    this.$controlsButtonsList.attr(this.attr.buttonActive, '')
    this.$viewList.attr(this.attr.viewActive, '')
  }

  /**
   * Set the mode to Tiles mode.
   * Hides the list display, shows the tiles display, and makes the Tiles button active.
   */
  modeSetTiles () {
    this._modeClear()
    this.$controlsButtonsTiles.attr(this.attr.buttonActive, '')
    this.$viewTiles.attr(this.attr.viewActive, '')
    this.masonry.layout()
  }

  /**
   * Clear the mode display (list or tile mode). This unsets the active button and hides all modes.
   */
  _modeClear () {
    this.$controlsButtonsTiles.removeAttr(this.attr.buttonActive)
    this.$viewTiles.removeAttr(this.attr.viewActive)

    this.$controlsButtonsList.removeAttr(this.attr.buttonActive)
    this.$viewList.removeAttr(this.attr.viewActive)
  }

  /**
   * Determine if fullscreen is supported in this browser, and if so add an attribute to the
   * modal so we can use CSS to style and display a fullscreen icon.
   */
  fullscreenInit () {
    if (this.fullscreenIsSupported()) {
      this.$modal.attr(this.attr.fullscreenIsSupported, '')
    }
  }

  /**
   * Determine if this browser supports full screen mode.
   * @return {Boolean}
   */
  fullscreenIsSupported () {
    let el = this.$el[0]
    return Boolean(
            el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen
        )
  }

  /**
   * Set an element to fullscreen mode.
   *
   * Note this can be called only from a user-intiated event (like a click event handler)
   * and may not work in all browsers or in other situations (like when running in an iframe).
   *
   * @param  {Element} el
   */
  fullscreenElement (el) {
    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen()
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen()
    }
  }

  /**
   * Randomly shuffle an array in place.
   * @param  {Array} array
   * @return {Array}
   */
  shuffle (array) {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  /**
   * Trigger an event for the gallery.
   *
   * @param  {String} eventName
   * The name of the event. This will be prepended by "Gallery-" (or the value of this.settings.eventName).
   * For example: "modal-open" to trigger event "Gallery-modal-open"
   *
   * @param  {Anything} ...eventArgs
   * Arguments to be passed to the triggered event. Note the "this" object will be sent as the first argument,
   * then the eventArgs after that. For example, if you call:
   * gallery.trigger('my-event', foo, bar)
   * Then the event handler would be something like this:
   * $('#mygallery').on('Gallery-my-event', function(event, galleryObj, foo, bar) { ... } );
   */
  trigger (eventName, ...eventArgs) {
    this.$el.trigger(this.settings.eventName + '-' + eventName, [this].concat(eventArgs))
  }
}

// Set up a bspUtils.plugin so an element with data-bsp-gallery-list
// will automatically create a Gallery list
export default bspUtils.plugin(false, 'bsp-gallery', 'list', {

  '_each': function (item) {
    // Get options from the data-bsp-gallery-options attribute
    let options = this.option(item)

    // Create the gallery object
    let gallery = new Gallery(item, options)

    // Save the Gallery object on the element so it can be accessed later if necessary
    $(item).data('bsp-gallery', gallery)

    // Run it!
    gallery.init()
  }
})
