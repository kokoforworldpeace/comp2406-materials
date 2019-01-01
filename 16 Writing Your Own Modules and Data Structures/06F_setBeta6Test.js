/*
Demonstration code to test Set ADT
*/

var Set = require('./set_beta6.js')
var set = new Set()

set.add('Lou')
set.add('Sue')
set.add('John')
set.add('Lilly')
set.add('Sandra')
// set.collection.push('Ringo') //VIOLATION OF ENCAPSULATION -BAD!

set.remove('Frank')
set.remove('Sue')

console.log(set.toString())
console.log("set contains 'Lou': " + set.contains('Lou'))
console.log("set contains 'Sue': " + set.contains('Sue'))
