/*
Attempt of implement Set ADT Module.
The set is a container that stores elements in no particular order.
Items are not added if they are duplicates based on the === operator.
Remove will remove all items that match based on the === operator.

There is still a problem though: the collection member of set is
public and visible to clients of set objects.
Exercise: make collection private but the methods add, remove etc. public

HERE we attempt to remedy the encapsulation problem by
making collection a "var" instead (a private property of Set)
which makes it private, but a property of the Set function object
so now the methods don't have access to it
*/

function Set(){
   var collection = []; //Make private var
   this.add = add;
   this.remove = remove;
   this.contains = contains;
   this.toString = function(){return collection.toString()};
}

function add(x){
  //add element x if no current element === x
  //ERROR WON'T COMPILE BECAUSE collection is not a property of this
  if(this.collection.indexOf(x) < 0) this.collection.push(x);

 //ERROR WON'T COMPILE because collection is not in the scope of this add() function
  if(collection.indexOf(x) < 0) collection.push(x);
}

function remove(x) {
  //remove first occurrence of element === x

  var position = this.collection.indexOf(x);
  if(position > -1) this.collection.splice(position,1);

}

function contains(x){
   //answer whether set contains element === x
   return this.collection.indexOf(x) > -1;
}

module.exports  = Set;
