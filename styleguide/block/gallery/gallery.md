## Gallery

### Requirements
* [Zeplin](https://zpl.io/Z11ulFh)
* [PNGs](https://www.dropbox.com/sh/n1ljua526dyo6l3/AAB43ovSiTFXz4LxKuIARrGfa?dl=0)
* [Sketch](https://www.dropbox.com/s/bz9w6u8mn742rjt/Base%20Photo%20Gallery.sketch?dl=0)

### Blocks and properties
* `Gallery`:
    * intro: (Block) See the `GalleryIntro` block.
    * introBackgroundImage: (URL/Optional) By default, the gallery displays a randomized "matrix" of images
      as a background. However, you can specify a single image here to use as the background.
    * slides: (Array) List of `GallerySlide` blocks.
* `GalleryIntro`: Introductory content for the gallery.
    * title (String|HTML)
    * description (HTML)
* `GallerySlide`: A single slide for the gallery.
    * slideImage: (Image Element)
    * slideInfo: (Block) See the `GallerySlideInfo` block.
* `GallerySlideInfo`: Extra info that describes the slide image.
    * title (HTML)
    * description (HTML)
    * attribution (HTML)
