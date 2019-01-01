/*
example of simple module
*/
module.exports = function () { 
    console.log('hello from the module.exports system!'); 
}
exports = function () { 
    console.log('hello from the exports system!'); 
}
