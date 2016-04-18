## Commenting

[Requirements](https://perfectsense.atlassian.net/wiki/display/BSP/Commenting)

### Blocks and properties
* `Commenting`: The outer container block
    * `id: String`: The unique Id of the commenting block. Useful for anchoring down to this element on the page.
    * `expandComments: Boolean (default false)`: Determines the initial expanded state of the comment thread.
* `Comment`: The block that represents a comment within the thread
    * `id: String`: The unique Id of the comment block. Used to associate a parent comment with a reply.
    * `parentId: String`: The unique Id of a parent comment block. Used to associate a reply back to the parent. This assigns a `data-in-reply-to` attribute hook.
    * `isStaff: Boolean (default false)`: Designates this comment to be a "staff" type and sets a `data-by-staff` attribute hook.
    * `threadDepth: String (default "0")`: Used to express indentation level, this assigns a `data-thread-depth` attribute hook.
* `CommentEntry`: The block that captures a user's comment before they submit
    * `replaceWithResponse: Boolean (default false)`: Used to express inline reply, this assigns a `data-replace-with-response` attribute hook, which designates that block to be replaced with the subsequent server response.
* `CommentingSignIn`: A block for the user to start the authentication process
