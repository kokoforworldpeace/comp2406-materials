
/*
This example requires that your install the 'colour' module using command:
>npm install colour

This example illustrates that it is fundamentally unsafe in javascript
to use a FOR-IN loop to loop through the characters of a string.
It is also unsage to use a FOR-IN loop to  loop through the elements
of a javascript array.

In both cases always use a for(let i=0; i<x.length; i++){...}
or the newer ES6 FOR-OF loop
*/


const fs = require('fs')
const colour = require('colour')  //npm install colour

let str = "One Day My Prince Will Come"
let testStr1 = ""
let testStr2 = ""

//Using FOR-IN Loop -look at keys
for(let c in str) {testStr1 += c + " "}
console.log(testStr1.yellow)

//Using FOR-IN Loop -look at values
console.log("")
for(let c in str) {testStr1 += str[c]}
console.log(testStr1.blue)

//Using Traditional FOR Loop -safe for strings
for(let i = 0; i<str.length; i++) {testStr2 += str[i]}

console.log("")
console.log(testStr2.green)

//Using a ES6 FOR-OF -safe for strings
let testStr3 = "";
for(let c of str) {testStr3 += c}

console.log("")
console.log(testStr2.red)
