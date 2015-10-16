/*
 *  The point of this module is to wrap around all our `console.x` calls so that
 *  we can centralize the control of how those are invoked.
 */

var term = require( 'terminal-kit' ).terminal;

function Logger(){

    // Prints the welcome message
    this.welcome = function() {
        term.blue("\nBrightsp");term.red( 'o' );term.blue("t");
        term.brightWhite(true);
        term(' : Front-End Dev Server');
        term('\n=================================\n');
        term.brightWhite(false);
    }

    this.success = function(msg) {
        term.green('(√) '+msg+'\n');
    }

    this.error = function(msg) {
        term.red('(x) '+msg+'\n');
    }
}

module.exports = exports = new Logger();
