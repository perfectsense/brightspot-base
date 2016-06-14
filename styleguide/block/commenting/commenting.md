## Commenting

[Requirements](https://perfectsense.atlassian.net/wiki/display/BSP/Commenting)

### Blocks and properties
* `Commenting`: The outer container block
    * `id: String`: The unique Id of the commenting block. Useful for anchoring down to this element on the page.
    * `showComments: Boolean (default false)`: Determines the initial visible state of the comment thread.
* `Comment`: The block that represents a comment within the thread
* `CommentEntry`: The block that captures a user's comment before they submit
