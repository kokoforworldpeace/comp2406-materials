/*
   Re-assigning module.exports
*/
//module2.js
module.exports = {"a":  10};
exports.b = 20; //still refers to old module.exports object
