# ViewModel

The viewmodel can be described as the entire JSON data structure used by the template(s) for a given view/url. For front-end development viewmodels can be constructed by creating `.json` files in the `/styleguide` directory of the project.

Viewmodel data loaded in the styleguide is resolved for a particular component path by loading the `index.json` file by default.

## Macros

The styleguide supports a set of macros which allow us to expand into more data prior to our viewmodel's generation phase before it is rendered by the template. Below are macros you can use in your viewmodel JSON.

Macro Name | Values | Example | Expand functionality
------------ | ------------
_dataUrl | path to a `.json` viewmodel file _(must be relative to root of project)_ | ```"_dataUrl": "/components/bsp-article/article-standalone.json"``` | To avoid having to duplicate JSON data you can refer to generic sets of data. Another common way to think of the behavior is an `include`. When the viewmodel is generated, the server will substitute the `_dataUrl` node with the JSON data found at the provided path.
_template | path to a handlebars partial/template _(must be relative to root of project)_ | ```"_template" : "layouts/two-col-main-left-fixed-right"``` | Used to link the JSON data that the `_template` node is defined in as the context for that template when `{{ render this }}` is used in conjunction.
_repeat | `3`, `1-10`, `0-2` | ```[{"_repeat":"0-1000", "title":"A sample title"}]``` | Will repeat and object and its properties from `0 to n` times in an array. Can be used to scaffold fake data without repeating yourself.
date | `{{date()}}` | ```"lastPublished": "{{date()}}"``` | Expands into a randomly selected Date string
word | `{{word(count)}}` | ```"title": "{{word()}}"``` | Expands into a randomly generated word. `count` param allows you to control how many words are returned. Default is 1.
sentence | `{{sentence(wordCount)}}` | ```"title": "{{sentence()}}"``` | Expands into a randomly generated sentence. `wordCount` param allows you to control how many words are in the sentence. Default is 5.
paragraph | `{{paragraph(amount)}}` | ```"summary": "{{paragraph()}}"``` | Expands into a randomly generated paragraph. `amount` param allows you to control how many paragraphs are generated. Default is 1.
color | `{{color(format, threshold)}}` | ```"backgroundColor": "{{color()}}"``` | Expands into a randomly generated color. `format` param allow you to pass "hex", "shorthex", "rgb". Default is "rgb". `threshold` param allows you to specify a color cap _(does not work unless "rgb" format is used)_.
