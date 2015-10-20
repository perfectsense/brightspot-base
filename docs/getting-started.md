# Getting Started with Brightspot Base

<!---
* File locations
  * Brightspot Base Project Files
  * Your Project Files
* Starting Your Project
  * Site Structure
  * Variables
  * Setting Typography
  * Grid & Media Queries
--->

* [Boostrapping into a Brightspot project](#bootstrapping)
* [Source File Types and Paths](#overview-of-brightspot-base-source-files)
* [Overriding Source Files](#overriding-files)

## Developing Brightspot Base directly

If you're interested in contributing directly to the Base library and don't need to install it into a Brightspot project, please [refer to this guide](/docs/developing-base.md#contributing)

## Including Brightspot Base in your project

### Bootstrapping

1.	Create a Brightspot project following the instructions [here](http://www.brightspot.com/docs/2.4/get-started/installation#development-installation). When running the archetype as described in the instructions, make sure you're at least using a Brightspot version >= 3.1. You can confirm this by looking setting the  `-DarchetypeVersion=2.4-SNAPSHOT` to at least `-DarchetypeVersion=3.1-SNAPSHOT`.
2.	Next, you prime your project for Base by adhering to some directory conventions that are used for the styleguide, front-end build tool configs and test specs. All of those can be scaffolded and copied in for you by running our bootstrapper shell command. First, change directories to your project root, then run:
```shell
bash <(curl -s https://raw.githubusercontent.com/perfectsense/brightspot-base/master/boilerplate/bootstrap.sh)
```
Here's an example of what a Brightspot project directory looks like initially... (step #1)

  ![Pre-Base](/docs/images/bsp-dir-pre-base.png)

 ...and after bootstrapping Base (step #2)

 ![Pre-Base](/docs/images/bsp-dir-post-base.png)
3.	Update the `bower.json` and `package.json` files to reflect your project name
4.	Run `mvn clean install` which will run the bsp-grunt task for the first time and copy all the necessary files into your target directory.
5. From here, you'll probably want to start [exploring the styleguide](/docs/styleguide.md) included with Base.

## Location, Location, Location

### Overview of Brightspot Base Source Files

**Base** itself is installed via `npm` into your project as `node_modules/brightspot-base`.

Base consists of:
- Templates (Handlebars)
- Styles (Less)
- Javascripts (ES6)
- Data (JSON)

You can find the following directories located relative to the Base node module:

* **Handlebar Templates** are located within **[src/main/webapp/render/](https://github.com/perfectsense/brightspot-base/tree/master/src/main/webapp/render/)** and are divided into
 * `common/`
 * `components/`
 * `elements/`
 * `layouts/`
* **Styles** are located within **[src/main/webapp/assets/styles/](https://github.com/perfectsense/brightspot-base/tree/master/src/main/webapp/assets/styles/)** and are divided into
 * `components/`
 * `elements/`
 * `mix-ins/`
 * `utilities/`
 * `variables/`
 * `main.less` (The entrypoint LESS importer)
* **JavaScripts** are located within **[src/main/webapp/assets/scripts/](https://github.com/perfectsense/brightspot-base/tree/master/src/main/webapp/assets/scripts/)** and are divided into
 * `plugins/`
 * `config.js` (The global SystemJS config)
 * `main.js` (The entrypoint JS)
* **Styleguide Data** is located within **[styleguide](https://github.com/perfectsense/brightspot-base/tree/master/styleguide)** To learn more details on the styleguide JSON data, [refer to this document](/docs/styleguide.md).
* **Styleguide Stylesheets** are located within **[styleguide](https://github.com/perfectsense/brightspot-base/tree/master/styleguide)** (Coming soon...)
* **Styleguide node modules** are located within **[src/main/node](https://github.com/perfectsense/brightspot-base/tree/master/src/main/node/)**. To learn more details on the styleguide node modules, [refer to this document](/docs/styleguide.md).

## Development using Brightspot Base

Ideally, your project would require very little alterations and use Brightspot Base as-is. This would allow you to simply re-assign variables in the Less files and choose to import only the things you need. On other occasions however, it may be necessary to create templates specific to your project, write a template completely differently, redefine Less or use different data in the styleguide.

To understand how to accomplish those workflows, there are two sets of directories that you'll need to reference/refer to:

1. Brightspot Base Project Files
2. Your Project Files

### Overriding files

When included in a Brightspot project, all the Base project files live under the `node_modules` directory (details are in the previous section titled "**Overview of Brightspot Base Source Files**"). In order to override a specific Base file in your project, you simply create the same path structure and filename in your Brightspot project.

For example, lets say you wanted to redefine the Base image template for your project. Currently, the Base `image.hbs` template is located here:
```shell
/node_modules/brightspot-base/src/main/webapp/render/common/image.hbs
```
In your project root, if you create a file named `image.hbs` and saved it to a correlating path like so:
```shell
/src/main/webapp/render/common/image.hbs
```
As a result, that template would be used instead of the Base template. This is the same pattern for all the asset files used in Base.

### Resource Precedence

To provide developers a way to easily override, Base looks to resolve resources within your Brightspot project in the following order:
1. `/src/main/webapp/render/`
2. `/target/.../src/main/webapp/render/`
3. `/node_modules/brightspot-base/src/main/webapp/render/`

More details specific to how the Styleguide works with overrides are covered in the [Styleguide docs](/docs/styleguide.md#resource-precedence).

### Next steps

[Read more about developing for Base](/docs/developing-base.md)
