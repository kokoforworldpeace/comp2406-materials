/*
Javascript ES6 provides a built in Set container
See description here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

Fully supported in most browsers (2018) except IE

*/
let s = new Set()
s.add("Lou").add("Sue").add("Anne")
console.log("size: " + s.size) //3
console.log("set contains 'Lou': " +  s.has("Lou")) //true
console.log(s.values()) //SetIterator { 'Lou', 'Sue', 'Anne' }
console.log(typeof s) //object

for (let key of s.values()) // insertion order
    console.log(key)

for (let key in s) // object keys seem not be be exposed
    console.log(key)

//callback function style iteration
s.forEach(function(element){
   console.log("ELEMENT: " + element)
})

//Set() //NOT ALLOWED without NEW
