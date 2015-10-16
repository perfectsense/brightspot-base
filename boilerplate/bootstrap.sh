# variables
BASE_URL=https://raw.githubusercontent.com/perfectsense/brightspot-base/master/
BOILERPLATE_DIR=boilerplate
SRC_DIR=src/main/webapp
ASSETS_DIR=$SRC_DIR/assets
SCRIPTS_DIR=$ASSETS_DIR/scripts
SPEC_DIR=spec
SPEC_PLUGINS_DIR=$SPEC_DIR/unit/plugins
STYLES_DIR=$ASSETS_DIR/styles
STYLEGUIDE_DIR=styleguide
TEMPLATE_DIR=$SRC_DIR/render

# download a file
# if one arg provided, will download src to same local relative path
# passing a second arg will override the relative destination
dl() {
    if [ ! -z "$2" ]
        then
            curl $BASE_URL/$1 > ./$2
        else
            curl $BASE_URL/$1 > ./$1
    fi
}

# download build files
CONFIG_FILES=( bower.json Gruntfile.js package.json )
for i in "${CONFIG_FILES[@]}"
do
    dl $BOILERPLATE_DIR/$i $i
done

# download ignore, jshint, editorconfig and browser list for the prefixer
dl .jshintrc
dl .gitignore
dl .editorconfig
dl browserslist

# download spec runner files
mkdir -p $SPEC_PLUGINS_DIR
dl $SPEC_DIR/karma.conf.js
dl $BOILERPLATE_DIR/$SPEC_PLUGINS_DIR/delete-me.spec.js $SPEC_PLUGINS_DIR/delete-me.spec.js

# download js files
mkdir -p $SCRIPTS_DIR
dl $SCRIPTS_DIR/config.js
dl $SCRIPTS_DIR/main.js

# download less files
mkdir -p $STYLES_DIR
dl $STYLES_DIR/main.less

# download styleguide files
mkdir styleguide
dl $STYLEGUIDE_DIR/index.html
dl $STYLEGUIDE_DIR/README.md
dl $STYLEGUIDE_DIR/server.js
dl $STYLEGUIDE_DIR/server-start.sh
dl $STYLEGUIDE_DIR/server-stop.sh

# create template directory structure
mkdir -p $TEMPLATE_DIR/common
mkdir -p $TEMPLATE_DIR/components
