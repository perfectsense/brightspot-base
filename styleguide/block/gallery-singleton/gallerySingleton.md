## Gallery singleton image

You can display a single image embedded in other content (for example, an image in an article), and still get
the gallery experience. Clicking the image opens the modal carousel as usual.  The modal can display just a single
image, or you can associate multiple gallery singletons to be displayed in the same modal carousel (by specifying the
same id for each gallery singleton).

In this demonstration, the first image opens by itself. The second and third images are associated, so if you open the
modal carousel you can navigate between those two slides.

### Blocks and properties
The singleton gallery uses the same properties as the main gallery, but it does not display the intro block
or the list/tiles view. It has a couple additional properties:
* `Gallery`:
    * `singleton`: (Boolean) A flag to indicate this image is a singleton (and will not show intro, list view, or tile view)
    * `id`: (String/Optional) An id can be used to associate multiple singletons, so when the user clicks the singleton image,
    the modal carousel lets the user navigate between all the images that have the same id. If this is not specified
    then the modal carousel will show only the image that was clicked, and will not have navigation controls.
 
