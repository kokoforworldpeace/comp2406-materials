/*
Demonstration code to test Set ADT
*/

var Set = require('./set_beta2.js')
var set = new Set()

/*
exports=function Set() {
  this.collection = []
  this.add = add
  this.remove = remove
  this.contains = contains
  this.toString = function() {
    return this.collection.toString()
  }
}
*/

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

console.log(set.collection)  //Violation of encapsulation BAD!
