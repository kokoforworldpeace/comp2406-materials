/*
Javascript ES6 defines an export-import syntax
for defining and using modules

***NOT SUPPORTED IN NODE.JS V6.x.x or V8.x.x.
***Experimental support is being tested V9.x.x //We shall see
*/
import {PORT, startServer} from 'my_module';
startServer(PORT);
