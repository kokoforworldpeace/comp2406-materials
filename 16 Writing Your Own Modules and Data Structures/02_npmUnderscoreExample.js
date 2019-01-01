/*
Code example using the npm underscore.js module
which is installed from npm online registry using commandline:

npm install underscore

To learn about the underscore module visit:
http://npmjs.org/
also
http://underscorejs.org/

Underscore provide functional-style (think callback functions)
utilities for iterating over collections

Using an _ seems an odd choice for variable in node.js
sever-side code but that is because traditionally in the browser
a global variable by that name is used.
*/


//array.prototype.fileter, array.prototype.forEach


var _ = require('underscore')
_.each([1,2,3], function(num){
   console.log("underscore.js says: " + (num*10));
})

[1,2,3].forEach(num => {
   console.log("arry.forEach says: " + (num*10));
});

var arr = [1, 10,50,200,900,90,40]
let arr1 = arr.filter(e=>{return e>40})
console.log(arr1)
var results = _.filter(arr, function(item){
    return item > 40 })
console.log( results)


/*
OUTPUT:
underscore.js says: 10
underscore.js says: 20
underscore.js says: 30
[ 50, 200, 900, 90 ]
*/
