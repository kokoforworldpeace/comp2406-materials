/*
Javascript ES6 provides a "deconstructor" assignment
It extracts, or deconstructs, the exported items into
individual variables.
*/

const {PORT, startServer} = require('./my_module1')
console.log(`PORT: ${PORT}`)
startServer(PORT);
