Brightspot Base Styleguide
==========================

This style guide demonstrates different styles and configurations of
modules included in [Brightspot Base](http://www.github.com/perfectsense/brightspot-base).

Usage
-----

The styleguide lives outside of the [Brightspot](brightspot.com/) project source and is accessed through  an [Express](http://expressjs.com/) server. You can start the server by running the following command from the project's root directory:

`node styleguide/server.js`

This will start the server on [http://localhost:3000](http://localhost:3000).

Your project will need to have been built with [Maven](https://maven.apache.org/) once so the target directory will be generated, but after that you will only need to run the Maven build again if a new [Bower](http://bower.io/) dependency is added to the project.

The Maven build pulls files into the target directory in the following order:
1.	Bower modules
2.	Brightspot Base files
3.	Project files

The Express server looks in multiple directories to attempt to serve a file at a given path.

Example: if you delete `/assets/main.js` from your project, the build will have pulled main.js into the target directory from Brightspot Base and the styleguide will serve it from the target directory. But if you do not delete main.js from your project source, the styleguide will serve it from your source.

The same is also true for styleguide files. If you delete `index.html` from your project styleguide, the Brightspot Base index.html will be served instead.

Automating Validation
----------------

Run `grunt watch` in another terminal window to silently validate code as you save it.

Note: it may be a bit more efficient to use in browser compiling when actively developing JavaScript.
