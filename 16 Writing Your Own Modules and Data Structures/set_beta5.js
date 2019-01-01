/*
Attempt of implement Set ADT Module.
The set is a container that stores elements in no particular order.
Items are not added if they are duplicates based on the === operator.
Remove will remove all items that match based on the === operator.

This time we fix the encapsulation problem.
The "collection" variable is private to the scope of Set() function

This "class" still has an issue in that each instance
of Set created with new Set has its own copy of the
method functions. What if we wanted something more related
to java class-defined methods shared by each instance
*/

function Set(){

   //this collection = []; //WOULD MAKE collection PUBLIC
   var collection = [] //PRIVATE VARIABLE OF Set

   this.add = function(x){
      //add element x if no current element === x
      if(collection.indexOf(x) < 0) collection.push(x)
      }

   this.remove = function(x) {
      //remove first occurence of element === x
      var position = collection.indexOf(x);
      if(position > -1) collection.splice(position,1)
      }

   this.contains = function(x){
       //answer whether set contains element === x
       return collection.indexOf(x) > -1
       }

   this.toString = function(){return collection.toString()}
}

module.exports = Set
