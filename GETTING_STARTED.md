_In Progress_

# Getting Started with Brightspot Base

_TODO: Summary Text goes here?_

_INPROGRESS: Index goes here_

* File locations
  * Brightspot Base Project Files
  * Your Project Files
* Starting Your Project
  * Site Structure
  * Variables
  * Setting Typography
  * Grid & Media Queries


----
## Location, Location, Location

Brightspot Base consists of templates (handlebars), styles (less), js libraries, and data to drive the templates (json).

There will be two sets of files you'll need to reference/refer to in developing your project:

1. Brightspot Base Project Files
2. Your Project Files

### Brightspot Base Project Files
* **Handlebar Templates** are located at **[/src/main/webapp/render/common](https://github.com/perfectsense/brightspot-base/tree/master/src/main/webapp/render/common)** and are divided into 
 * layouts
 * elements
 * components
 * common
* **Styles** are located at **[/src/main/webapp/assets/styles](https://github.com/perfectsense/brightspot-base/tree/master/src/main/webapp/assets/styles)** and are divided into
 * variables
 * elements
 * components
 * mix-ins
* **JavaScript** is located at **[/src/main/webapp/assets/scripts](https://github.com/perfectsense/brightspot-base/tree/master/src/main/webapp/assets/scripts)**
* **Test Data** and style guide files are located in **[/styleguide](https://github.com/perfectsense/brightspot-base/tree/master/styleguide)** -- this includes both the test data and the index files that help to generate and document the style guide.

###YOUR Project Files
* **Handlebar Templates** On some occasions, it will be necessary to create templates specific to your project or modify a brightspot base template to fit the needs of your project. These templates will be placed in your project under **/src/main/webapp/render**
* **Styles** should be placed in the same structure inside your projects **/src/main/webapp/assets/styles** directory. 
* **JavaScript** should likewise be place in your projects **/src/main/webapp/assets/styles** directory.
* **Test Data** To override brightspot base test data (Including rendering templates), you will put your json files in your projects **/styleguide** directory mimicking the folder structure in brightspot base.

----
##Starting Development
Depending on the project there may be very little alterations needed to base or there may be a significant number of changes.

###Site Structure and Variables
1. **Copy main.less from Brightspot Base into your project in /src/main/webapp/assets/styles** You will add any project specific styles here and you will remove the styles associated with any brightspot base components you do not need for your project.
1. 

###Set Typography
1. Default font stacks and font sizes are provided in Brightspot Base in **/src/main/webapp/assets/variables/typography.less**
1. Font styles are set in **/src/main/webapp/assets/elements/bsp-typography.less** with the mixin used being located in **/src/main/webapp/assets/mixins/typography.less** 
1. Update/Add Variables for Typography
  * Smaller projects can probably get away with the addition of a project specific variable file to override the base variables (i.e.: [reference to internal project omitted])
  * Larger projects should copy the typography variables file into their project and edit as needed.
1. Repeat for elements files if needed.
1. Update/modify project files as necessary to support project style guide typography

###Set-up Grid & Media Queries
