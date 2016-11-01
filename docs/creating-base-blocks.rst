Creating Base Blocks
--------------------

Handlebars Example - Not Reusable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <div class="ListPromo">
        <div class="ListPromo-title">{{title}}</div>
        <ul class="ListPromo-items">
            {{#each items}}
                <li class="ListPromo-items-item">{{this}}</li>
            {{/each}}
        </ul>
        <div class="ListPromo-cta">{{cta}}</div>
    </div>

Handlebars - Reusability
~~~~~~~~~~~~~~~~~~~~~~~~

BEM helpers:

* defineBlock: Defines a block.
* blockName: Returns the current block name.
* defaultBlockBody: Marks the template as the default block body.
* block: Renders the named block.
* defineElement: Defines an element within a block.
* elementName: Returns the current element name.
* element: Renders the named element.

Handlebars Example - Reusable
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

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

Less Example - Parent
~~~~~~~~~~~~~~~~~~~~~

Promo.less

::

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

Less Example - Simple Extend
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ImagePromo.less

::

    .ImagePromo {
        &:extend(.Promo all);
    }

Less Example - Extend & Add
~~~~~~~~~~~~~~~~~~~~~~~~~~~

ListPromo.less

::

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