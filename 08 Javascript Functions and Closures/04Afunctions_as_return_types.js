/* Example of javascript functions

Functions can be created from within other functions
and returned as data (function) objects
*/


function make(n){
   var initial = n
   return function(x){return x + initial} //make(n) = x+n
}

var add100 = make(100)

console.log(add100(8)) //108
console.log(add100(20)) //120

function cal(x) {
  let base = x;
  let add = function (y){
    return x+y;
  }
  return add; //cal = function add = x+y
}

let result = cal(100)//result = function add = 100+y
console.log(result);
