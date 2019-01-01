
/*
Demonstration code to test Set ADT
*/

let set = require('./set_beta1.js')

set.add('Lou')
set.add('Sue')
set.add('John')
set.add('Lilly')
set.add('Sandra')

console.log(set.toString())

set.remove('Frank')
set.remove('Sue')

console.log(set.toString())

console.log("set contains 'Lou': " + set.contains('Lou'))
console.log("set contains 'Sue': " + set.contains('Sue'))
