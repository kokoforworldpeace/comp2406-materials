/*
Another Example of javascript function IIFE
*/

(function() {
  function initialize() {
    console.log("...initializing")
  }

  function run() {
    console.log("...running")
  }
  initialize()
  return run //function = run
}() // function () = run() --> ...running
)() //execute object  = initialize() --> initializing
//...initializing
//...running

//function "selfie" that initializes and starts an application
