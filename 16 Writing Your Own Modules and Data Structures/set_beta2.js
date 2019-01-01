/*
Attempt of implemement Set ADT Module.
The set is a container that stores elements in no particularorder.
Items are not added if they are duplicates based on the === operator.
Remove will remove all items that match based on the === operator.

Exercise: Modify the code to take advantage of javascript's
          accessor and mutator methods for arrays instead of the
          for loops currently used.

Also notice each set object will have its own copy of method functions
How can you make it so that they all share the same method implementations?
*/

function Set() {
  this.collection = []
  this.add = add
  this.remove = remove
  this.contains = contains
  this.toString = function() {
    return this.collection.toString()
  }
}

function add(x) {
  //add element x if no current element === x
  for (let i = 0; i < this.collection.length; i++) {
    if (x === this.collection[i]) return
  }
  this.collection.push(x)
}

function remove(x) {
  //remove any elements === x
  let foundItemsToRemove = false
  for (let i = 0; i < this.collection.length; i++) {
    if (x === this.collection[i]) foundItemsToRemove = true
  }

  if (foundItemsToRemove) {
    let temp = this.collection
    this.collection = []
    for (let i = 0; i < temp.length; i++) {
      if (x !== temp[i]) this.collection.push(temp[i])
    }
  }
}

function contains(x) {
  //answer whether set contains element === x
  return this.collection.indexOf(x) > -1
}

module.exports = Set
