The Stack
---------

* Brightspot Styleguide
* HTML: Handlebars
* CSS: Less

The Name
--------

Based on BEM:

* Block: "A logically and functionally independent page component, the equivalent of a component in Web Components. A block encapsulates behavior (JavaScript), templates, styles (CSS), and other implementation technologies. Because blocks are independent, the can be re-used, and they facilitate the project development and support process."
* Element: "A constituent part of a block that can't be used outside of it."

Naming Rules
------------

Java-like:

* PascaleCase block names, e.g. ListPromo.
* Suffix block names with their parent names, e.g. ListPromo which extends Promo.
* camelCase element names, e.g. title.
* Prefix element names with their parent names (blocks and elements), separated by a dash, e.g. ListPromo-title, ListPromo-items-item.

Naming Example - Handlebars
---------------------------

.. code-block:: handlebars

    <div class="ListPromo">
        <div class="ListPromo-title">{{title}}</div>
        <ul class="ListPromo-items">
            {{#each items}}
                <li class="ListPromo-items-item">{{this}}</li>
            {{/each}}
        </ul>
        <div class="ListPromo-cta">{{cta}}</div>
    </div>

Names can be generated automatically via BEM helpers, which are explained later.

Naming Example - Less
---------------------

.. code-block:: less

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

Naming Example - Less Alternative
---------------------------------

.. code-block:: less

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

Only use this style when using Base blocks, not when creating them.

Organization
------------

* Handlebars, Less, and JavaScript files all together in the same directory, e.g. ArticleMain files in main.
* One block per file.
* As flat as possible by minimizing the number of nested directories.
* Logically group blocks, e.g. all promo blocks in promo.