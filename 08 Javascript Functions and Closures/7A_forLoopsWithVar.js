/*
Asynch functions with for-loop using var
FOR-LOOPS in javascript using var variables
have caused many problems
*/

console.log("-----------")
for (var i = 0; i < 10; i++) { //function scope -->i reach 10 before callback
  setTimeout(function() {
    console.log(i);
  }, 1000);
}

/*
Compare to (ES6) using let variable
*/

console.log("-----------")
for (let i = 0; i < 10; i++) { //block scope --> wait callback
  setTimeout(function() {
    console.log(i);
  }, 1000);
}

//GUESS THE OUTPUT
