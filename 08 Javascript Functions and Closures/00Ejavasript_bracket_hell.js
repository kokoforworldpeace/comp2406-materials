/* Example of javascript functions


Much of Javascript's popularity has to do with its rich notion of functions.
These include:

1)Functions are objects (The can be treaded as data: assigned to variables, passed to and
returned from other functions.)

2)Functions support closures (They remember the scope in which they were defined).

However, the various forms of brackets
used with functions can be confusing.

Ex.1: f(){...}

Ex.2: f()

Ex.3: f(){...g(){...}...g()}

Ex.4: f(){...return g(){...}}

Ex.5: f.g()

Ex.6: f(g(){...}){...g()}

Ex.7: (f(){...})()

Ex.8: (f(){...}())

Ex.9: f()()

Ex.10: (f(){}())()

Ex.11: function f(){... f=function(){}}

/*
Exercise: Complete the following code file that explains
what each bracketing configuration means and provide an example of
its use (defintion and invocation).
*/

//Ex.1: f(){...}
//Brackets: how a function is defined.
//Example of Use:
var f = function() {
  console.log("Hello World")
} //definition
f() //invokation
console.log("\n");

//Ex.2: f()
//Brackets: how a function is invoked.
//Example of Use:
var f = function() {
  console.log("Hello World")
} //definition
f() //invokation
console.log("\n");

//Ex.3: f(){...g(){...}...g()}
var f = function () {
  console.log("hi1");
  function g() {
    console.log("hi2");
  }
  g()
}
f()
console.log("\n");

//Ex.4: f(){...return g(){...}}
var f = function(){
  console.log("hi1");
  return function g(){ //f()=g()="hi2"
    return "hi2"
  }()//call immediately
}
console.log(f())
console.log("\n");

//Ex.5: f.g()
var f = {
   g: function (){
    console.log("hi2");
  }

}
f.g() //f is object, then call g attribute which is a function
console.log("\n");

//Ex.6: f(g(){...}){...g()}
let add  = function(x,y){
  return x+y
}

var f = function(g){

  return g(1,2)
}
console.log(f(add)); //pass function as parameter
console.log("\n");

// Ex.7: (f(){...})()
(function f() {
  console.log("hi1");
})() //self-invoking function

console.log("\n");

// Ex.8: (f(){...}())
console.log(function f(){return "hi1"}()) //self-invoking statement : f="hi1"
console.log("\n");

//Ex.9: f()()
var f = (function () {console.log("hi1")}())

f()()
