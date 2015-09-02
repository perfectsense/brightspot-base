Brightspot Base
===============

A pattern, boilerplate, and collection of reusable components to jump-start user interface development for [Brightspot CMS](http://brightspot.com) projects.

What's included
---------------
*	Reusable [LESS CSS](http://lesscss.org/) (based on [Twitter Bootstrap](http://getbootstrap.com/)) and Javascript components with accompanying [Handlebars templates](http://handlebarsjs.com)
*	Preconfigured Grunt build which compiles LESS and transpiles Javascript [ECMAScript 6 modules](http://www.2ality.com/2014/09/es6-modules-final.html) using [SystemJS](https://github.com/systemjs/systemjs) and [Babel](https://babeljs.io/)
*	Preconfigured [Karma](http://karma-runner.github.io/)/[Jasmine](http://jasmine.github.io/) test runner
*	[Preconfigured component style guide](styleguide/) with a local [Express](http://expressjs.com) server which allows development of front end components without a running Brightspot instance

How to use it
-------------
*   TODO: Add here was needs to be added to git ignore
*	[Bootstrap Brightspot Base](boilerplate/) into a new or existing Brightspot project (if the UI has not been built yet)
*	Override configuration, styles, scripts and templates to customize your project's appearance
*	Change the name in bower.json and package.json to your project name
*	Test front end components using the [styleguide](styleguide/) prior to integrating them into Brightspot

Writing Handlebar Templates
---------------------------
*   These notes should move into a "how to develop for Base" piece of documentation that we will get to soon. For now, please direct any questions at Tom Hoppe
*   We are including the handlebar templates that should transform a specific piece of JSON in the root of the object with a `_template` key. This allows the front and and back end "parent" renderers to render any kinds of children inside of themselves without have that information be hardcoded as a partial in the parent renderer. Best example is the bsp-gallery-module, where you'll note, we can include via JSON any component we want into a gallery slide
*   The above handlebar partial handling is done via the {{render this}} helper. This helper exists in our front end as well as back end handlebar code. It passes the JSON into the helper, which then picks out the `_template` value and uses it for rendering
*   It's important to note that the JAVA implementation of handlebars uses the mustache spec for lookups (https://github.com/jknack/handlebars.java#differences-between-handlebarsjava-and-handlebarsjs). This means that if we want to support null or empty values, we need to be explicit in specifying the scope of an attribute with `this.`. If you do NOT specify a `this.`, the JAVA handlebar renderer will look up the context stack for an attribute with the same name and use it instead. 

Building
--------
In most projects, you can run `mvn clean install` to generate a target directory. The target directory is needed by the styleguide server, as it combines files from [Bower](http://bower.io/), Brightspot Base and your project source.

For front end development done in the styleguide, Maven will only need to run again if new Bower or [NPM](https://www.npmjs.com) dependencies are added.

Test runner
-----------
Run `karma start spec/karma.conf.js`

Running the local styleguide server
-----------------------------------
Run `node styleguide/server.js` from the project root directory.

The styleguide will then be accessible at http://localhost:3000.

See the README in [the styleguide](styleguide/) for more detail.

System requirements
-------------------
*	[Java](https://java.com) and [Maven](https://maven.apache.org/). See [Brightspot documentation](http://www.brightspot.com/docs/3.0/overview/installation) for more specific information about which versions to install.
*	[NodeJS](https://nodejs.org)
*	Karma test runner (run `npm install -g karma` after NodeJS is installed)
