/*
Attempt of implement Set ADT Module.
The set is a container that stores elements in no particular order.
Items are not added if they are duplicates based on the === operator.
Remove will remove all items that match based on the === operator.

ES6 supports a "class" construct which is "syntactic sugar" for
a special function object.

class definitions are NOT hoisted like function definitions are.

This looks a bit more clean but does expose the properties of this
as public ---DISAPPOINTING!

Syntatic "sugar" for the previous example done with ES5
*/

class Set {
  //let collection = []  //NOT ALLOWED WITH CLASSES
  constructor() {
    this.collection = []
  }
  add(x) {
    //add element x if no current element === x
    if (this.collection.indexOf(x) < 0) this.collection.push(x)
  }

  remove(x) {
    //remove first occurence of element === x
    let position = this.collection.indexOf(x)
    if (position > -1) this.collection.splice(position, 1)
  }

  contains(x) {
    //answer whether set contains element === x
    return this.collection.indexOf(x) > -1
  }

  toString() {
    return this.collection.toString()
  }
}

module.exports = Set
