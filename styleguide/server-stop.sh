SCRIPT_DIR=$( dirname "${BASH_SOURCE[0]}" )
MANIFEST=$SCRIPT_DIR/server.manifest
if [ -f $MANIFEST ]; then
	SERVER_PID=$( cat ${MANIFEST} )
	kill -9 $SERVER_PID
	rm -rf $MANIFEST
	echo "Exited server"
else 
	echo "No server manifest found, exiting."
	exit 1
fi