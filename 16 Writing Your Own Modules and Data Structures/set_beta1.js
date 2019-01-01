/*
First attempt to implement a Set ADT.

The set is a container that stores elements in no particular order.
Items are not added if they are duplicates based on the === operator.
Remove will remove all items that match based on the === operator.

Here we seemed to have created an "object" set, not a class or type set.

What if we want to create something more like a "class" set.

Exercise: Modify code so that many instances of sets could
be created by clients with "new"
*/

let collection = []

function add(x){
  //add element x if no current element === x
  for(let i=0; i<collection.length; i++){
      if(x === collection[i]) return
  }
  collection.push(x)
}

function remove(x) {
    //remove any elements === x
    let foundItemsToRemove = false
    for(let i=0; i<collection.length; i++){
      if(x === collection[i]) foundItemsToRemove = true
    }
//clear collection and push back without argument x
    if(foundItemsToRemove){
       let temp = collection
       collection = []
       for(var i=0; i<temp.length; i++){
            if(x !== temp[i]) collection.push(temp[i])
       }
    }
}

function contains(x){
       //answer whether set contains element === x
        return collection.indexOf(x) > -1;
       };

exports.add = add
exports.remove = remove
exports.contains = contains
exports.toString = function(){return collection.toString()}
