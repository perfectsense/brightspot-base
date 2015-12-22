### Additional features:
* Defining fields within each of the `services` will override the corresponding field in the parent data. For example:

```
"services": [
    {
        "_template": "/assets/templates/base/elements/social-share-item",
        "name": "facebook",
        "caption": "This value overrides the 'caption' value as defined in the parent data"
    },
    {
        "_template": "/assets/templates/base/elements/social-share-item",
        "name": "twitter",
        "title": "This value overrides the 'title' value as defined in the parent data"
    }
    ...
]
```

This gives the developer the ability to define the following specific values per service provider:
* title
* caption
* description

More information can be found in the plugin's documentation here: [Brightspot JS Share](https://github.com/perfectsense/brightspot-js-share)
