/*
Demonstration code to test Set ADT
*/
var Set = require('./Set_ES6.js')
var set = new Set()

set.add('Lou')
set.add('Sue')
set.add('John')
set.add('Lilly')
set.add('Sandra')
set.collection.push('Ringo') //VIOLATION OF ENCAPSULATION -BAD!

set.remove('Frank')
set.remove('Sue')

console.log(set.toString())
console.log("set contains 'Lou': " + set.contains('Lou'))
console.log("set contains 'Sue': " + set.contains('Sue'))
console.log(set.collection)

var set2 = new Set()
set2.add('Bert')
set2.add('Ernie')

console.log(set.toString()) //we can have two copies of sets that are distinct
console.log(set2.toString())
//console.log(Set()); not legal because classes cannot be invoked <== GOOD
