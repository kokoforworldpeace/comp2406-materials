
/*
Example of ASYNCHRONOUS file read.
Function readFile does not block (wait) for the file to be read.

Instead its argument function(err,data) will be called once the file has been read.
function(err,data) is the "call back" function that will be called when readFile's task is done.

Notice "DONE" gets written to the console before the file contents. Make
sure you understand why that is.
*/


const fs = require('fs')

fs.readFile('songs/sister_golden_hair.txt', function(err, data) {
  if(err) throw err
  let array = data.toString().split("\n")
  for(let line of array) { console.log(line) }
})

console.log("DONE")
