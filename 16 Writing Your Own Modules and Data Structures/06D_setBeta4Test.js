/*
Demonstration code to test Set ADT
*/


//use var delcare in exports function(constructor)  make it private       



var Set = require('./set_beta4.js')
var set = new Set()

set.add('Lou')
set.add('Sue')
set.add('John')
set.add('Lilly')
set.add('Sandra')
set.collection.push('Ringo') //NOT DESIRABLE THAT WE CAN DO THIS
//COLLECTION IS A PUBLIC MEMBER OF SET


set.remove('Frank')
set.remove('Sue')

console.log(set.toString())
console.log("set contains 'Lou': " + set.contains('Lou'))
console.log("set contains 'Sue': " + set.contains('Sue'))
