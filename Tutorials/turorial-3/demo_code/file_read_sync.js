
/*
Example of a SYNCHRONOUS file read.
the readFileSync() function blocks (waits) and only returns once the file is read.

See
http://nodejs.org/api/fs.html
and more specifically: http://nodejs.org/api/fs.html#fs_fs_readfilesync_filename_options

Notice "DONE" gets written to the console after the file contents. Make sure you
understande why that is.
*/

const fs = require('fs')

const array = fs.readFileSync('songs/sister_golden_hair.txt').toString().split("\n")

for(let line of array) {
    console.log(line)
}
console.log("DONE")
