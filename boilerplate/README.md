brightspot base boilerplate
===========================

Steps for bootstrapping a new project
-------------------------------------

1.	Create a Brightspot project following the instructions [here](http://www.brightspot.com/docs/2.4/get-started/installation#development-installation)
2.	Change directories to the project root, then run `bash <(curl -s https://raw.githubusercontent.com/perfectsense/brightspot-base/master/boilerplate/bootstrap.sh)`
3.	Edit the bower.json and package.json files to reflect your project name
4.	(@todo: pom.xml probably needs changes from the one that is generated from the instructions above, I had to copy the one from brightspot base)
5.	Run `mvn clean install` which will run bsp-grunt for the first time. You can see in the target directory where files are copied from Bower and Brightspot Base.