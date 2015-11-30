#!/bin/bash

USAGE="$0 [-l] -p <brightspot-chef repo path>"
while getopts ":lp:" OPT ; do
    case ${OPT} in 
        l) LOCAL=1
            ;;
        p) BRIGHTSPOT_CHEF_REPO=${OPTARG}
            ;;
        h) echo "${USAGE}"
            exit 0
            ;;
    esac
done

if [ -z "${BRIGHTSPOT_CHEF_REPO}" ]; then
    echo ${USAGE}
    exit 1
fi

if [ ! -z "${LOCAL}" ]; then
   export BRIGHTSPOT_CHEF=$BRIGHTSPOT_CHEF_REPO
   echo "Using local brightspot-chef repo."
fi

berks update

cd ${BRIGHTSPOT_CHEF_REPO} && git fetch && cd -

PREVIOUS_REV=`git diff | grep -A3 -m 2 git@github.com | grep revision | head -1 | cut -d ":" -f 2 | tr -d ' '`
NEW_REV=`git diff | grep -A3 -m 2 git@github.com | grep revision | tail -1 | cut -d ":" -f 2 | tr -d ' '`

if [ "$PREVIOUS_REV" = "$NEW_REV" ]; then
    LOG=`git -C $BRIGHTSPOT_CHEF_REPO diff`
else 
    RANGE="${PREVIOUS_REV:0:8}...${NEW_REV:0:8}"
    LOG=`git -C $BRIGHTSPOT_CHEF_REPO log $RANGE --pretty=format:'%Cred%h%Creset - %s %C(bold blue)<%an>%Creset' --abbrev-commit`
fi

if [ ! -z "${LOCAL}" ]; then
  echo "default['brightspot_chef']['revision'] = 'HEAD'" > attributes/revision.rb
else
  echo "default['brightspot_chef']['revision'] = '${NEW_REV}'" > attributes/revision.rb
fi

if [ -z "$LOG" ]; then
    echo "No updates."
elif [ ! -z "${LOCAL}" ]; then
    echo ""
    echo "${LOG}"
    echo ""
elif [ -z "${LOCAL}" ]; then
    echo "==== BEGIN COMMIT MESSAGE ===="
    echo "Updating cookbooks."
    echo ""
    echo "${LOG}"
    echo ""
    echo "https://github.com/perfectsense/brightspot-chef/compare/${RANGE}"
    echo "==== END COMMIT MESSAGE ===="
fi
