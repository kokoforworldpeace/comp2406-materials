/*
Attempt of implement Set ADT Module.
The set is a container that stores elements in no particular order.
Items are not added if they are duplicates based on the === operator.
Remove will remove all items that match based on the === operator.


Here we create a single copy of the method functions
that are inherited by each instance of new Set().

However our collection is exposed and public again.

Exercise: make collection private but the methods add, remove etc. public
*/

function Set(){
   this.collection = []; //use array to store elements
}

Set.prototype.add = function (x) {
  //add element x if no current element === x
  if(this.collection.indexOf(x) < 0) this.collection.push(x)
}

Set.prototype.remove = function (x){
  //remove first occurrence of element === x

  let position = this.collection.indexOf(x)
  if(position > -1) this.collection.splice(position,1)
  /*
  array.splice(index, n); will remove n items
  starting at index
  */
}

Set.prototype.contains = function (x){
   //answer whether set contains element === x
   return this.collection.indexOf(x) > -1
}

Set.prototype.toString = function(){
	return this.collection.toString()
}

module.exports  = Set;
