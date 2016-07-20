## Gallery

For the styleguide, choose the "Gallery" theme in the theme dropdown (top right of the page) to view sample styles.

### Requirements
* [Jira Ticket and Requirements](https://perfectsense.atlassian.net/browse/BSP-1571)
* Designs: [Zeplin](https://zpl.io/Z11ulFh), [PNG](https://www.dropbox.com/sh/n1ljua526dyo6l3/AAB43ovSiTFXz4LxKuIARrGfa?dl=0), [Sketch](https://www.dropbox.com/s/bz9w6u8mn742rjt/Base%20Photo%20Gallery.sketch?dl=0)

### Blocks and properties
* `Gallery`:
    * `intro`: (Block) A single `GalleryIntro` block.
    * `introBackgroundImage`: (URL/Optional) By default, the gallery displays a randomized matrix of images
      as a background. However, you can specify a single image here to use as the background. This URL will
      be placed in the `data-gallery-intro-background-image` HTML parameter and used by the JavaScript.
    * `slides`: (Array) List of `GallerySlide` blocks.
    * `modal` (HTML) Placeholder for the gallery modal, including additional properties for adding controls to the modal.
* `GalleryIntro`: Introductory content for the gallery.
    * `title` (String|HTML)
    * `titleShort` (String|HTML) Optional short version of the title.
    * `description` (HTML)
    * `descriptionShort` (HTML) Optional short version of the description.
* `GallerySlide`: A single slide for the gallery.
    * `media`
        * `mediaContent`: (Image Element) Image or other content for the slide.
        * `mediaControls` (HTML) Controls to overlay on top of the media.
            * `mediaControlsZoom` (HTML) Control to zoom the image (display the modal)
    * info: (HTML) Descriptive content for the image. By default contains infoTitle, infoDescription, infoAttribution.
        * `infoTitle` (HTML) Title for the image.
        * `infoTitleShort` (HTML) Optional short title for the image.
        * `infoDescription` (HTML) Description for the image.
        * `infoDescriptionShort` (HTML) Optional short description for the image.
        * `infoAttribution` (HTML) Attribution for the image.
