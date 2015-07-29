Brightspot Base
===============

A pattern, boilerplate, and collection of reusable components to jump-start user interface development for [Brightspot CMS](http://brightspot.com) projects.

What's included
---------------
*	Reusable LESS and Javascript components with accompanying [Handlebars templates](http://handlebarsjs.com)
*	Preconfigured Grunt build which compiles [LESS CSS](http://lesscss.org/) and transpiles Javascript [ECMAScript 6 modules](http://www.2ality.com/2014/09/es6-modules-final.html) using [SystemJS](https://github.com/systemjs/systemjs) and [Babel](https://babeljs.io/)
*	Preconfigured [Karma](http://karma-runner.github.io/)/[Jasmine](http://jasmine.github.io/) test runner
*	[Preconfigured component style guide](styleguide/) with a local [Express](http://expressjs.com) server which allows development of front end components without a running Brightspot instance

How to use it
-------------
*	[Bootstrap Brightspot Base](boilerplate/) into a new or existing Brightspot project
*	Override configuration, styles, scripts and templates to customize your project's appearance
*	Test front end components using the [styleguide](styleguide/) prior to integrating them into Brightspot

Building
--------
In most projects, you can run `mvn clean install` to generate a target directory. The target directory is needed by the styleguide server, as it combines files from [Bower](http://bower.io/), Brightspot Base and your project source.

For front end development done in the styleguide, Maven will only need to run again if new Bower or [NPM](https://www.npmjs.com) dependencies are added.

System requirements
-------------------
*	[Java](https://java.com) and [Maven](https://maven.apache.org/). See [Brightspot documentation](http://www.brightspot.com/docs/3.0/overview/installation) for more specific information about which versions to install.
*	[NodeJS](https://nodejs.org)