/*
example of simple module
*/

var theObj = require('obj') //search node_nodules folder for obj.json
console.log('in bar2.js:')
console.log(theObj)
module.exports = function () {
    console.log('hello from the file system!')
}
