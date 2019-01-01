/*
Javascript ES6 defines an export-import syntax
for defining and using modules

Node.js has thus far refused to implement it.
An explanation can be found here:
https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c

***NOT SUPPORTED IN NODE.JS V6.x.x or V8.x.x.
***Experimental support is being tested V9.x.x //We shall see
*/
import {PORT, startServer} from 'my_module2';
startServer(PORT);
