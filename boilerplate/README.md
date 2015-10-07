Brightspot Base Boilerplate
===========================

Steps for bootstrapping a new project
-------------------------------------

1.	Create a Brightspot project following the instructions [here](http://www.brightspot.com/docs/2.4/get-started/installation#development-installation). When running the archetype as described in the instructions, change `-DarchetypeVersion=2.4-SNAPSHOT` to at least `-DarchetypeVersion=3.1-SNAPSHOT`.
2.	Change directories to the project root, then run `bash <(curl -s https://raw.githubusercontent.com/perfectsense/brightspot-base/master/boilerplate/bootstrap.sh)`
3.	Edit the bower.json and package.json files to reflect your project name
4.	Run `mvn clean install` which will run bsp-grunt for the first time. You can see in the target directory where files are copied from Bower and Brightspot Base.
5.  From here, you can start adding CSS/JS/HBS
6.  For CSS, you can either create new/override CSS files and compile them into your main.less (component-name-projectName.less), or overwrite the base CSS files by creating the same path/name file in your repo
7.  For JS, you can pull in plugins via bower, or write your own project specific plugins/utilities
8.  For Handlebar Templates, you can add new .hbs files into your /render folder or overwrite the base .hbs files by creating the same path/name file in your repo
