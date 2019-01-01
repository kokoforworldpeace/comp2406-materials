/*
Attempt of implement Set ADT Module.
The set is a container that stores elements in no particular order.
Items are not added if they are duplicates based on the === operator.
Remove will remove all items that match based on the === operator.

Here we are taking advantage of javascript's special
mutator methods available for arrays.

There are still some problems though:
The "collection" member of set is
public and visible to clients of set objects.

Each instance of Set will have its own copy of the methods
add, remove, etc. (It is not a single copy associated with the class.)

Exercise: make collection private but the methods add, remove etc. public
*/


/*
  array.splice(index, n); will remove n items
  starting at index
  */


function Set(){
   this.collection = [] //use array to store elements
   this.add = add
   this.remove = remove
   this.contains = contains
   this.toString = function(){return this.collection.toString()}
}

function add(x){
  //add element x if no current element === x
  if(this.collection.indexOf(x) < 0) this.collection.push(x)
}

function remove(x) {
  //remove first occurrence of element === x

  let position = this.collection.indexOf(x)
  if(position > -1) this.collection.splice(position,1)
  /*
  array.splice(index, n); will remove n items
  starting at index
  */

}

function contains(x){
   //answer whether set contains element === x
   return this.collection.indexOf(x) > -1
}

module.exports  = Set
