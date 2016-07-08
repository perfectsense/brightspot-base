## Gallery

### Requirements
* [Jira Ticket and Requirements](https://perfectsense.atlassian.net/browse/BSP-1571)
* Designs: [Zeplin](https://zpl.io/Z11ulFh), [PNG](https://www.dropbox.com/sh/n1ljua526dyo6l3/AAB43ovSiTFXz4LxKuIARrGfa?dl=0), [Sketch](https://www.dropbox.com/s/bz9w6u8mn742rjt/Base%20Photo%20Gallery.sketch?dl=0)

### Blocks and properties
* `Gallery`:
    * intro: (Block) A single `GalleryIntro` block.
    * introBackgroundImage: (URL/Optional) By default, the gallery displays a randomized "matrix" of images
      as a background. However, you can specify a single image here to use as the background. This URL will
      be placed in the `data-gallery-intro-background-image` HTML parameter and used by the JavaScript.
    * slides: (Array) List of `GallerySlide` blocks.
* `GalleryIntro`: Introductory content for the gallery.
    * title (String|HTML)
    * description (HTML)
* `GallerySlide`: A single slide for the gallery.
    * image: (Image Element)
    * info: (HTML) Descriptive content for the image. By default contains infoTitle, infoDescription, infoAttribution.
    * infoTitle (HTML) Title for the image.
    * infoDescription (HTML) Description for the image.
    * infoAttribution (HTML) Attribution for the image.
