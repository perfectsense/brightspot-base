#!/bin/sh

PROJECT=brightspot-base
ACCOUNT=$PROJECT
DATABAG_SECRET_KEY_PATH=$HOME/.chef/chef-solo-databag.key

USAGE="$0 -s <databag secret key path> <base|dev|qa|frontend|backend|gateway> <env>"
while getopts ":s:a:" OPT ; do
    case ${OPT} in
        a) ACCOUNT=${OPTARG}
            ;;
        s) DATABAG_SECRET_KEY_PATH=${OPTARG}
            ;;
        h) echo "${USAGE}"
            exit 0
            ;;
    esac
done

shift $((OPTIND-1))

CREDENTIALS=""
IAM_PROFILE=$(curl -f -m 1 -s http://169.254.169.254/latest/meta-data/iam/security-credentials/) || true
if [ "${IAM_PROFILE}" != "" ] ; then
    CREDENTIALS=$(curl -f -m 1 -s http://169.254.169.254/latest/meta-data/iam/security-credentials/${IAM_PROFILE}) || true
fi
USING_IAM=false

if [ "$CREDENTIALS" = "" ]; then
    export AWS_ACCESS_KEY=`cat $HOME/.aws/credentials | grep "\[$ACCOUNT\]" -A2 | grep aws_access_key_id | cut -d '=' -f 2 | sed -e 's/ //g'`
    export AWS_SECRET_KEY=`cat $HOME/.aws/credentials | grep "\[$ACCOUNT\]" -A2 | grep aws_secret_access_key | cut -d '=' -f 2 | sed -e 's/ //g'`
else
    USING_IAM=true
fi

if [ -z "$AWS_ACCESS_KEY" ] && [ "$USING_IAM" = "false" ]; then
    echo "Credentials for '$ACCOUNT' not found in $HOME/.aws/credentials"
    exit 1
fi

if [ ! -e "$DATABAG_SECRET_KEY_PATH" ]; then
    echo "Chef Solo data bag secret not found at $HOME/.chef/chef-solo-databag.key"
    exit 1
fi

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "${USAGE}"

    exit 1
fi

if [ -z "$BUILD_NUMBER" ]; then
    export BUILD_NUMBER=`date +%s`
fi

IMAGE_FILE=$1
ENVIRONMENT=$2
shift 2

unset BRIGHTSPOT_CHEF

PACKER_FILE=packer.json
if [ "$IMAGE_FILE" = "gateway" ] || [ "$IMAGE_FILE" = "base" ]; then
    PACKER_FILE=packer-base.json
elif [ "$IMAGE_FILE" = "frontend" ]; then
    PACKER_FILE=packer-frontend.json
fi

rm -rf cookbooks/ && cd ../chef && berks vendor ../packer/cookbooks && cd - && \
    packer build $@ -var "databag_secret_path=$DATABAG_SECRET_KEY_PATH" \
        -var "environment=$ENVIRONMENT" \
        -var-file=${IMAGE_FILE}.json $PACKER_FILE
