Usage
-----

Usage Example
~~~~~~~~~~~~~

To use ListPromo as is, specify it directly in the Styleguide example JSON:

::

    {
        "_template": "ListPromo",
        "title": "foo", 
        "items": [ "bar" ],
        "cta": "qux"
    }

HTML output:

::

    <div class="ListPromo">
        <div class="ListPromo-title">foo</div>
        <ul class="ListPromo-items">
            <li>bar</li>
        </ul>
        <div class="ListPromo-cta">qux</div>
    </div>

Usage Example - Copy
~~~~~~~~~~~~~~~~~~~~

To create a wide version of ListPromo named WideListPromo, use the {{block}} helper and pass the name argument:

WideListPromo.hbs

::

    {{block "base/promo/ListPromo" name="WideListPromo"}}
    
HTML output:

::

    <div class="WideListPromo">
        <div class="WideListPromo-title">...</div>
        <ul class="WideListPromo-items">...</ul>
        <div class="WideListPromo-cta">...</div>
    </div>

Usage Example - Reorder
~~~~~~~~~~~~~~~~~~~~~~~

To move the cta element in between the title element and the items element, use the {{element}} helper:

CtaFirstListPromo.hbs

::

    {{#block "base/promo/ListPromo" name="CtaFirstListPromo"}}
        {{element "title"}}
        {{element "cta"}}
        {{element "items"}}
    {{/block}}

HTML output:

::

    <div class="CtaFirstListPromo">
        <div class="CtaFirstListPromo-title">...</div>
        <div class="CtaFirstListPromo-cta">...</div>
        <ul class="CtaFirstListPromo-items">...</ul>
    </div>

Usage Example - Add
~~~~~~~~~~~~~~~~~~~

To add the subTitle element below the title element:

SubTitledListPromo.hbs

::

    {{#block "base/promo/ListPromo" name="SubTitledListPromo"}}
        {{element "title"}}
        {{#with subTitle}}
            <div class="{{blockName}}-subTitle">{{this}}</div>
        {{/with}}
        {{element "items"}}
        {{element "cta"}}
    {{/block}}

HTML output:

::

    <div class="SubTitledListPromo">
        <div class="SubTitledListPromo-title">...</div>
        <div class="SubTitledListPromo-subTitle">...</div>
        <ul class="SubTitledListPromo-items">...</ul>
        <div class="SubTitledListPromo-cta">...</div>
    </div>

Usage Example - Style All
~~~~~~~~~~~~~~~~~~~~~~~~~

Change all promo titles to 3em:

All.less

::

    @import 'base/promo/Promo';
    @import 'promo/Promo';
    @import 'base/promo/ImagePromo';
    @import 'base/promo/ListPromo';

promo/Promo.less

::

    .Promo-title {
        font-size: 3em;
    }

Usage Example - Style One
~~~~~~~~~~~~~~~~~~~~~~~~~

Change just list promo titles to 3em:

All.less

::

    @import 'base/promo/Promo';
    @import 'base/promo/ImagePromo';
    @import 'base/promo/ListPromo';
    @import 'promo/ListPromo';

promo/ListPromo.less

::

    .ListPromo-title {
        font-size: 3em;
    }
