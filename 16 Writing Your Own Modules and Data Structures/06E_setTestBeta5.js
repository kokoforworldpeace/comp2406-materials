/*
Demonstration code to test Set ADT
*/
var Set = require('./set_beta5.js')
var set = new Set()

set.add('Lou')
set.add('Sue')
set.add('John')
set.add('Lilly')
set.add('Sandra')

// set.collection.push('Ringo') //not work same


set.remove('Frank')
set.remove('Sue')

console.log(set.toString())
console.log(set.contains('Lou'))
console.log(set.contains('Anne'))

var set2 = new Set()
set2.add('Bert')
set2.add('Ernie')

console.log(set.toString()) //we can have two copies of sets that are distinct
console.log(set2.toString())
console.log(set.collection) //undefined GOOD!
console.log(Set()) //Unfortunately legal because functions CAN be invoked.
console.log(global.add.toString())   //function(x){...}  <==NOT GOOD WE MESSED WITH THE GLOBAL OBJECT
