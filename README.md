---

# Brightspot Base

---

### Stack

* [Brightspot Styleguide](https://github.com/perfectsense/brightspot-styleguide)
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

Java-like:

* PascaleCase _block_ names, e.g. `ListPromo`.
* Suffix _block_ names with their parent names, e.g. `ListPromo` which extends
  `Promo`.
* camelCase _element_ names, e.g. `title`.
* Prefix _element_ names with their parent names (_blocks_ and _elements_),
  separated by a dash, e.g. `ListPromo-title`, `ListPromo-items-item`.

---

### Naming Example - Handlebars

```hbs
<div class="ListPromo">
    <div class="ListPromo-title">{{title}}</div>
    <ul class="ListPromo-items">
        {{#each items}}
            <li class="ListPromo-items-item">{{this}}</li>
        {{/each}}
    </ul>
    <div class="ListPromo-cta">{{cta}}</div>
</div>
```

Names can be generated automatically via BEM helpers, which are
explained later.

---

### Naming Example - Less 

```less
.ListPromo {
    border: solid 1px black;
    padding: 1em;
    
    &-title {
        font-size: 2em;
    }
    
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

### Naming Example - Less Alternative

```less
.ListPromo {
    border: solid 1px black;
    padding: 1em;
}

.ListPromo-title {
    font-size: 2em;
}

.ListPromo-items {
    list-style: none;
    padding: 0;
}

.ListPromo-items-item {
    margin-top: .5em;
}
```

Only use this style when using Base blocks, not when creating them.

---

### Organization

* Handlebars, Less, and JavaScript files all together in the same directory,
  e.g. `ArticleMain` files in [`main`](src/main/webapp/base/main).
* One _block_ per file.
* Flat as possible by minimizing the number of nested directories.
* Logically group _blocks_, e.g. all promo _blocks_ in
  [`promo`](src/main/webapp/base/promo).

---

# Usage

---

### Usage Example

To use [`ListPromo`](src/main/webapp/base/promo/ListPromo.hbs) as is, specify
it directly in the Styleguide example JSON:

```json
{
    "_template": "base/promo/ListPromo",
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

### Usage Example - Copy

To create a wide version of `ListPromo` named `WideListPromo`, use the
`{{block}}` helper and pass the `name` argument:

`WideListPromo.hbs`

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

---

### Usage Example - Reorder

To move the `cta` _element_ in between the `title` _element_ and the `items`
_element_, use the `{{element}}` helper:

`CtaFirstListPromo.hbs`

```hbs
{{#block "base/promo/ListPromo" name="CtaFirstListPromo"}}
    {{element "title"}}
    {{element "cta"}}
    {{element "items"}}
{{/block}}
```

HTML output:

```html
<div class="CtaFirstListPromo">
    <div class="CtaFirstListPromo-title">...</div>
    <div class="CtaFirstListPromo-cta">...</div>
    <ul class="CtaFirstListPromo-items">...</ul>
</div>
```

---

### Usage Example - Add

To add the `subTitle` _element_ below the `title` _element_:

`SubTitledListPromo.hbs`

```hbs
{{#block "base/promo/ListPromo" name="SubTitledListPromo"}}
    {{element "title"}}
    {{#with subTitle}}
        <div class="{{blockName}}-subTitle">{{this}}</div>
    {{/with}}
    {{element "items"}}
    {{element "cta"}}
{{/block}}
```

HTML output:

```html
<div class="SubTitledListPromo">
    <div class="SubTitledListPromo-title">...</div>
    <div class="SubTitledListPromo-subTitle">...</div>
    <ul class="SubTitledListPromo-items">...</ul>
    <div class="SubTitledListPromo-cta">...</div>
</div>
```

---

### Usage Example - Style All

Change all promo titles to `3em`:

`All.less`

```less
@import 'base/promo/Promo';
@import 'promo/Promo';
@import 'base/promo/ImagePromo';
@import 'base/promo/ListPromo';
```

`promo/Promo.less`

```less
.Promo-title {
    font-size: 3em;
}

```

---

### Usage Example - Style One

Change just list promo titles to `3em`:

`All.less`

```less
@import 'base/promo/Promo';
@import 'base/promo/ImagePromo';
@import 'base/promo/ListPromo';
@import 'promo/ListPromo';
```

`promo/ListPromo.less`

```less
.ListPromo-title {
    font-size: 3em;
}
```

---

# Creating Base Blocks

---

### Handlebars Example - Not Reusable

```hbs
<div class="ListPromo">
    <div class="ListPromo-title">{{title}}</div>
    <ul class="ListPromo-items">
        {{#each items}}
            <li class="ListPromo-items-item">{{this}}</li>
        {{/each}}
    </ul>
    <div class="ListPromo-cta">{{cta}}</div>
</div>
```
---

### Handlebars - Reusability

BEM helpers:

* `defineBlock`: Defines a _block_.
* `blockName`: Returns the current _block_ name.
* `defaultBlockBody`: Marks the template as the default _block_ body.
* `block`: Renders the named _block_.
* `defineElement`: Defines an _element_ within a _block_.
* `elementName`: Returns the current _element_ name.
* `element`: Renders the named _element_.

---

### Handlebars Example - Reusable

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

### Less Example - Parent

`Promo.less`

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

---

### Less Example - Simple Extend

`ImagePromo.less`

```less
.ImagePromo {
    &:extend(.Promo all);
}
```

---

### Less Example - Extend & Add

`ListPromo.less`

```less
.ListPromo {
    &:extend(.Promo all);

    &-items {
        &:extend(.ListPromo-items all);
        list-style: none;
        padding: 0;

        &-item {
            &:extend(.ListPromo-items-item all);
            margin-top: .5em;
        }
    }
}
```
