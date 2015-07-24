var server = require('../node_modules/brightspot-base/src/main/node/brightspot-fe-dev-server');
var path = require('path');

server.listen({
	projectDir: path.resolve(__dirname, '..')
});