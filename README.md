# Brightspot Base

---

### Stack

* HTML: [Handlebars](http://handlebarsjs.com/)
* CSS: [Less](http://lesscss.org/)

---

### Naming

* Based on [BEM](https://en.bem.info/).
* PascaleCase _block_ names, e.g. `ListPromo`.
* Suffix _block_ names with their parent names, e.g. `ListPromo` which extends `Promo`.
* camelCase _element_ names, e.g. `title`.
* Prefix _element_ names with their _block_ names, e.g. `ListPromo-title`.

---

### Naming Examples

Handlebars (typically automated via BEM helpers explained later):

```hbs
<div class="ListPromo">
    <div class="ListPromo-title">{{title}}</div>
</div>
```

Less:

```less
.ListPromo {
    &-title {
        font-size: 2em;
    }
}
```

---

### Files

* Handlebars, Less, and JavaScript files mixed in together.
* One _block_ per file.
* Flat as possible.
* Logically group _blocks_, e.g. all promo _blocks_ in [`promo`](src/main/webapp/base/promo).

---

### Handlebars

BEM helpers available:

* `defineBlock`: Defines a _block_.
* `blockName`: Returns the current _block_ name.
* `defaultBlockBody`: Marks the template as the default _block_ body.
* `block`: Renders the named _block_.
* `defineElement`: Defines an _element_ within a _block_.
* `elementName`: Returns the current _element_ name.
* `element`: Renders the named _element_.

---

### Handlebars Example

This template can be used directly.

```hbs
{{#defineBlock "ListPromo"}}
    {{#defineElement "title"}}
        <div class="{{elementName}}">{{this}}</div>
    {{/defineElement}}

    {{#defineElement "items"}}
        <ul class="{{elementName}}">
            {{#each this}}
                <li class="{{elementName}}-item">{{this}}</li>
            {{/each}}
        </ul>
    {{/defineElement}}

    {{#defineElement "cta"}}
        <div class="{{elementName}}">{{this}}</div>
    {{/defineElement}}

    <div class="{{blockName}}">
        {{#defaultBlockBody}}
            {{element "title"}}
            {{element "items"}}
            {{element "cta"}}
        {{/defaultBlockBody}}
    </div>
{{/defineBlock}}
```

---

### Handlebars Example - Reuse

To create two versions of `ListPromo`, wide and narrow:

`WideListPromo`:

```hbs
{{block "base/promo/ListPromo" name="WideListPromo"}}
```

```less
.WideListPromo {
    &-title { ... }
}
```

`NarrowListPromo`:

```hbs
{{block "base/promo/ListPromo" name="NarrowListPromo"}}
```

```less
.NarrowListPromo {
    &-title { ... }
}
```

---

### Handlebars Example - Reorder

To move `cta` in between `title` and `items`:

```hbs
{{#block "base/promo/ListPromo" name="MyListPromo"}}
    {{element "title"}}
    {{element "cta"}}
    {{element "items"}}
{{/block}}
```

---

### Handlebars Example - Add

To add `subTitle` below `title`:

```hbs
{{#block "base/promo/ListPromo" name="MyListPromo"}}
    {{element "title"}}

    {{#with subTitle}}
        <div class="MyListPromo-subTitle">{{this}}</div>
    {{/with}}

    {{element "items"}}
    {{element "cta"}}
{{/block}}
```

---

### Less

* One class per HTML element.
* Data attributes as _modifiers_, e.g. `<div class="ListPromo" data-theme="special">`

---

### Less Example

```less
.Promo {
    &-title {
        &:extend(.Promo-title all);
        font-size: 2em;
    }

    &-cta {
        &:extend(.Promo-cta all);
        border: 5px solid black;
    }
}
```

```less
.ImagePromo {
    &:extend(.Promo all);
}
```

```less
.ListPromo {
    &:extend(.Promo all);

    &-items {
        list-style: none;
        padding: 0;

        &-item {
            margin-top: .5em;
        }
    }
}
```

---

### Less Example - Change All

Change all promo titles to `3em`:

```less
.Promo-title {
    font-size: 3em;
}
```

---

### Less Example - Change One

Change just list promo titles to `3em`:

```less
.ListPromo-title {
    font-size: 3em;
}
```
