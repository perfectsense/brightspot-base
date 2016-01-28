Brightspot Base
===============

A pattern, boilerplate, and collection of reusable components to jump-start user interface development for [Brightspot CMS](http://brightspot.com) projects.

What's included
---------------
*	Reusable [LESS CSS](http://lesscss.org/) (based on [Twitter Bootstrap](http://getbootstrap.com/)) and Javascript components with accompanying [Handlebars templates](http://handlebarsjs.com)
*	Preconfigured Grunt build which compiles LESS and transpiles Javascript [ECMAScript 6 modules](http://www.2ality.com/2014/09/es6-modules-final.html) using [SystemJS](https://github.com/systemjs/systemjs) and [Babel](https://babeljs.io/)
*	Preconfigured [Karma](http://karma-runner.github.io/)/[Jasmine](http://jasmine.github.io/) test runner
*	[Preconfigured component style guide](styleguide/) with a local [Express](http://expressjs.com) server which allows development of front end components without a running Brightspot instance

Writing Handlebar Templates
---------------------------
*   These notes should move into a "how to develop for Base" piece of documentation that we will get to soon. For now, please direct any questions at Tom Hoppe
*   We are including the handlebar templates that should transform a specific piece of JSON in the root of the object with a `_template` key. This allows the front and and back end "parent" renderers to render any kinds of children inside of themselves without have that information be hardcoded as a partial in the parent renderer. Best example is the bsp-gallery-module, where you'll note, we can include via JSON any component we want into a gallery slide
*   The above handlebar partial handling is done via the {{render this}} helper. This helper exists in our front end as well as back end handlebar code. It passes the JSON into the helper, which then picks out the `_template` value and uses it for rendering
*   It's important to note that the JAVA implementation of handlebars uses the mustache spec for lookups (https://github.com/jknack/handlebars.java#differences-between-handlebarsjava-and-handlebarsjs). This means that if we want to support null or empty values, we need to be explicit in specifying the scope of an attribute with `this.`. If you do NOT specify a `this.`, the JAVA handlebar renderer will look up the context stack for an attribute with the same name and use it instead.
*   Each handlebar template also has an options map `displayOptions` that can be used to provide information and keys from the JSON to the template. This map doesn't get treated with any `_template` and is available for use in conditionals or directly in the .hbs

Building
--------
Front End
*   To run and see Base itsef, run `npm install` and then `grunt`. This will install any node dependencies and then grunt will pull down any bower dependencies and compile CSS and transpile JS

How to use it in projects
-------------
*

Test runner
-----------
Run `karma start spec/karma.conf.js`

Running the local styleguide server
-----------------------------------
Run `npm run styleguide` from the root directory

The styleguide will then be accessible at http://localhost:3000. You can pass options to the styleguide to change host or port for running multiple styleguides.

`--port=XXXX` allows you to run multiple styleguides on your localhost

`--host=YOUR IP` allows you to access the styleguide via your http://YOURIP:3000 which can be accessed by others on the network or via a virtual machine for localized IE testing

System requirements
-------------------
*	[Java](https://java.com) and [Maven](https://maven.apache.org/). See [Brightspot documentation](http://www.brightspot.com/docs/3.0/overview/installation) for more specific information about which versions to install.
*	[NodeJS](https://nodejs.org)
*	Karma test runner (run `npm install -g karma` after NodeJS is installed)
