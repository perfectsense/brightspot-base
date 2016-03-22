# Brightspot Base

---

### Stack

* HTML: [Handlebars](http://handlebarsjs.com/)
* CSS: [Less](http://lesscss.org/)

---

### Naming

Based on [BEM](https://en.bem.info/):

* Block: "A logically and functionally independent page component, the
  equivalent of a component in Web Components. A block encapsulates behavior
  (JavaScript), templates, styles (CSS), and other implementation technologies.
  Blocks being independent allows for their re-use, as well as facilitating the
  project development and support process."
* Element: "A constituent part of a block that can't be used outside of it."

---

### Naming Rules

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

* Handlebars, Less, and JavaScript files all together in the same directory,
  e.g. `ArticleMain` files in [`main`](src/main/webapp/base/main).
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

### Handlebars Example - Use

To use `ListPromo` as is:

Styleguide example JSON:

```json
{
    "_template": "ListPromo",
    "title": "foo", 
    "items": [ "bar" ],
    "cta": "qux"
}
```

HTML output:

```html
<div class="ListPromo">
    <div class="ListPromo-title">foo</div>
    <ul class="ListPromo-items">
        <li>bar</li>
    </ul>
    <div class="ListPromo-cta">qux</div>
</div>
```

---

### Handlebars Example - Reuse

To create two versions of `ListPromo`, wide and narrow:

`WideListPromo.hbs`:

```hbs
{{block "base/promo/ListPromo" name="WideListPromo"}}
```

HTML output:

```html
<div class="WideListPromo">
    <div class="WideListPromo-title">...</div>
    <ul class="WideListPromo-items">...</ul>
    <div class="WideListPromo-cta">...</div>
</div>
```

`WideListPromo.less`:

```less
.WideListPromo {
    &:extend(.ListPromo all);
    &-title { ... }
}
```

`NarrowListPromo.hbs`:

```hbs
{{block "base/promo/ListPromo" name="NarrowListPromo"}}
```

HTML output:

```html
<div class="NarrowListPromo">
    <div class="NarrowListPromo-title">...</div>
    <ul class="NarrowListPromo-items">...</ul>
    <div class="NarrowListPromo-cta">...</div>
</div>
```

`NarrowListPromo.less`:

```less
.NarrowListPromo {
    &-title { ... }
}
```

---

### Handlebars Example - Reorder

To move `cta` in between `title` and `items`:

`MyListPromo.hbs`:

```hbs
{{#block "base/promo/ListPromo" name="MyListPromo"}}
    {{element "title"}}
    {{element "cta"}}
    {{element "items"}}
{{/block}}
```

HTML output:

```html
<div class="MyListPromo">
    <div class="MyListPromo-title">...</div>
    <div class="MyListPromo-cta">...</div>
    <ul class="MyListPromo-items">...</ul>
</div>
```

---

### Handlebars Example - Add

To add `subTitle` below `title`:

`MyListPromo.hbs`:

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

HTML output:

```html
<div class="MyListPromo">
    <div class="MyListPromo-title">...</div>
    <div class="MyListPromo-subTitle">...</div>
    <ul class="MyListPromo-items">...</ul>
    <div class="MyListPromo-cta">...</div>
</div>
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
