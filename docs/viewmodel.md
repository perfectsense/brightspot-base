# ViewModel

The viewmodel can be described as the entire JSON data structure used by the template(s) for a given view/url. For front-end development viewmodels can be constructed by creating `.json` files in the `/styleguide` directory of the project.

Viewmodel data loaded in the styleguide is resolved for a particular component path by loading the `index.json` file by default.

## Macros

The styleguide supports a set of macros which allow us to expand into more data prior to our viewmodel's generation phase before it is rendered by the template. Below are macros you can use in your viewmodel JSON.

### _dataUrl
A path to a `.json` viewmodel file _(must be relative to root of project)_

```json
"_dataUrl": "/components/bsp-article/article-standalone.json"
```

To avoid having to duplicate JSON data you can refer to generic sets of data. Another common way to think of the behavior is an `include`. When the viewmodel is generated, the server will substitute the `_dataUrl` node with the JSON data found at the provided path.

### _template

A path to a handlebars partial/template _(must be relative to root of project)_

```json
"_template" : "layouts/two-col"
```

Used to link the JSON data that the `_template` node is defined in as the context for that template when `{{ render this }}` is used in conjunction.

### _repeat

Will repeat an object and its properties from `0 to n` times in an array. Can be used to scaffold fake data without repeating yourself.

**Example values**

```json
3, 1-10, 0-2
```

```json
[{"_repeat":"0-1000", "title":"A sample title"}]
```

### date

Expands into a randomly selected Date string

`{{date()}}`

```json
"lastPublished": "{{date()}}"
```

### word

Expands into a randomly generated word.

`{{word(count)}}`

```json
"title": "{{word(2)}}"
```

* The `count` param allows you to control how many words are returned. _Defaults to 1_.

### sentence

Expands into a randomly generated sentence.

`{{sentence(wordCount)}}`

```json
"title": "{{sentence()}}"
```

* The `wordCount` param allows you to control how many words are in the sentence. _Defaults to 5_.

### paragraph

Expands into a randomly generated paragraph.

`{{paragraph(amount)}}`

```json
"summary": "{{paragraph()}}"
```

* The `amount` param allows you to control how many paragraphs are generated. _Defaults to 1_.

### color

Expands into a randomly generated color.

`{{color(format, threshold)}}`

```json
"backgroundColor": "{{color('rgb', 120)}}"
```

* The `format` param allow you to pass ("hex", "shorthex", "rgb"). _Defaults to "rgb"_.
* The `threshold` param allows you to specify a color cap _(does not work unless "rgb" format is used)_.
