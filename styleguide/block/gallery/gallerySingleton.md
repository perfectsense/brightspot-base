## Gallery from singleton images

You can also display a single image embedded in other content (for example, an image in an article).
Clicking the image opens the modal carousel as usual. You can display just a single image, or you can associate multiple
images to be displayed in the same modal carousel.

### Blocks and properties
The singleton gallery uses the same properties as the normal gallery, but it does not display the intro block
or the list/tiles view. It has a couple additional properties:
* `Gallery`:
    * `singleton`: (Boolean) A flag to indicate this image is a singleton (and will not show intro, list view, or tile view)
    * `id`: (String/Optional) An id can be used to associate multiple singletons, so when the user clicks the singleton image,
    the modal carousel lets the user navigate between all the images that have the same id. If this is not specified
    then the modal carousel will show only the image that was clicked, and will not have navigation controls.
 
