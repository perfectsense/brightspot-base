NODE=$( dirname .. )/node/node
SERVER=$( dirname "${BASH_SOURCE[0]}" )/server.js
$NODE $SERVER "$@" &>/dev/null &
SERVER_PID=$!
echo $SERVER_PID > $( dirname "${BASH_SOURCE[0]}" )/server.manifest
echo "Server started"