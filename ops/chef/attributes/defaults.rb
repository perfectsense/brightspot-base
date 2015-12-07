
default['brightspot']['project'] = 'brightspot-base'
default['brightspot']['project_git_repo'] = 'git@github.com:perfectsense/brightspot-base.git'
default['brightspot']['rootDomain'] = 'brightspot-base.internal'
default['brightspot']['fqdn'] = ''
default['brightspot']['aliases'] = []
default['brightspot']['default_redirector'] = true
default['brightspot']['version'] = 3.0

default['jenkins']['fqdn'] = 'jenkins.brightspot-base.psdops.com'

env_secrets = Chef::EncryptedDataBagItem.load("passwords-#{node.chef_environment}", "brightspot")
default['mod-dims']['secret'] = env_secrets['dims_secret']

default['brightspot']['backup_bucket'] = 'brightspot-base-ops'

if node.chef_environment == 'production' or node.chef_environment == 'qa'
  default['brightspot']['context.xml']['dari/debugUsername'] = 'debug'
  default['brightspot']['context.xml']['dari/debugPassword'] = env_secrets['debug_password']
end

default['brightspot']['context.xml']['dari/defaultStorage'] = 's3'
default['brightspot']['context.xml']['dari/storage/s3/bucket'] = 'brightspot-base-brightspot'
default['brightspot']['context.xml']['dari/storage/s3/class'] = 'com.psddev.dari.util.AmazonStorageItem'
default['brightspot']['context.xml']['dari/storage/s3/baseUrl'] = 'http://brightspot-base-brightspot.s3.amazonaws.com'
default['brightspot']['context.xml']['dari/storage/s3/access'] = env_secrets['aws_access']
default['brightspot']['context.xml']['dari/storage/s3/secret'] = env_secrets['aws_secret']

default['brightspot']['context.xml']['dari/defaultImageEditor'] = 'dims'
default['brightspot']['context.xml']['dari/imageEditor/dims/baseUrl'] = '/dims4/default'
default['brightspot']['context.xml']['dari/imageEditor/dims/sharedSecret'] = env_secrets['dims_secret']
default['brightspot']['context.xml']['dari/imageEditor/dims/useLegacyThumbnail'] = false
default['brightspot']['context.xml']['dari/imageEditor/dims/quality'] = 90

default['brightspot']['context.xml']['cookieSecret'] = 'b54e1502aaef0b1ae0989200fb7c9ca8'

default['java']['jdk8_url'] = "http://perfectsense-ops.s3.amazonaws.com/jdk/jdk-8u60-linux-x64.tar.gz"
default['java']['jdk8_checksum'] = 'ebe51554d2f6c617a4ae8fc9a8742276e65af01bd273e96848b262b3c05424e5'
default['java']['jdk8_version'] = '1.8.0_60'
