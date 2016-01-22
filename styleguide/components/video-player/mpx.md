### ThePlatform's MPX player

[PDK Docs](http://help.theplatform.com/display/pdk/)

### Dev Note:
In order to render a video player that can be scaled to the size of its container, the `src` must contain `/embed/select/` between the "PlayerPID" and the video's "assetID"
So, a URL like this:

    http://player.theplatform.com/p/1X3jUC/yh5o5S5hrJ4c/vxF7_26USdi6?form=html

Should be:

    http://player.theplatform.com/p/1X3jUC/yh5o5S5hrJ4c/embed/select/vxF7_26USdi6?form=html
