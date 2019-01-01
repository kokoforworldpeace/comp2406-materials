/*
 Example showing exports vs module.exports in the required module
*/



/*
new -->
   1.create new object with class.prototype and class.constructor as another prototype
  2. call the constrctor to form new attributes 
  3. return an object with new attributes and prototype


*/


//module.exports function(constructor) with prototype functions
//like to export a class




var Calculator = require("./Calculator") //or "./Calculator.js"


//var Calculator = function(aPercentage){
    // this.taxRate = aPercentage;
// }
var taxCalculator = new Calculator(13) //our first use of "new"
//var tipCalculator = new Calculator(15);

var itemPrice = 200; //$200.00

console.log(`amount: $${itemPrice}`)  //ES6 template string
console.log("tax:    $" + taxCalculator.calcTax(itemPrice)) //ES5 string concatenation
console.log("total:  $" + taxCalculator.calcTotal(itemPrice))
