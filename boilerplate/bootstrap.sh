# variables
BASE_URL=https://raw.githubusercontent.com/perfectsense/brightspot-base/0.0.3
BOILERPLATE_DIR=boilerplate
SRC_DIR=src/main/webapp
ASSETS_DIR=$SRC_DIR/assets
SCRIPTS_DIR=$ASSETS_DIR/scripts
SPEC_DIR=spec
SPEC_PLUGINS_DIR=$SPEC_DIR/unit/plugins
STYLES_DIR=$ASSETS_DIR/styles
STYLES_VARIABLES_DIR=$STYLES_DIR/variables
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
dl .jshintrc

# download spec runner files
mkdir -p $SPEC_PLUGINS_DIR
dl $SPEC_DIR/karma.conf.js
dl $BOILERPLATE_DIR/$SPEC_PLUGINS_DIR/delete-me.spec.js $SPEC_PLUGINS_DIR/delete-me.spec.js

# download js files
mkdir -p $SCRIPTS_DIR
dl $SCRIPTS_DIR/config.js
dl $SCRIPTS_DIR/main.js

# download less files
mkdir -p $STYLES_VARIABLES_DIR
dl $STYLES_DIR/main.less
STYLES_VARIABLES_FILES=(
	borders.less
	bsp-list-promo.less
	colors.less
	gallery.less
	header.less
	misc.less
	mq-and-grid.less
	spacing.less
	typography.less
	variables.less
	z-index.less
)
for i in "${STYLES_VARIABLES_FILES[@]}"
do
	dl $STYLES_VARIABLES_DIR/$i
done 

# download styleguide files
mkdir styleguide
dl $STYLEGUIDE_DIR/index.html
dl $STYLEGUIDE_DIR/_head.js
dl $BOILERPLATE_DIR/$STYLEGUIDE_DIR/server.js $STYLEGUIDE_DIR/server.js

# create template directory structure
mkdir -p $TEMPLATE_DIR/common
mkdir -p $TEMPLATE_DIR/components