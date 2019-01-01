var fs = require("fs");
var Console = require('console').Console;
var logFilename = process.argv[2];
var logStream;

// Note: this doesn't catch all errors, see
// https://www.joyent.com/developers/node/design/errors

try {
    logStream = fs.createWriteStream(logFilename);
} catch(e) {
    logStream = process.stdout;
}

var myConsole = new Console(logStream);

myConsole.log("This will be written to a file, unless there was a problem!");
