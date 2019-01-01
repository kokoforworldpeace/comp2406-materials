/*
(c) 2016 Louis D. Nel

Basic connect server using connect middleware and SQLite database.
Here we query the database to find song details that a user
can request through a query like http://localhost:3000/find?title=Love

*******************************************************************
Here we use JADE to generate the HTML for the response pages
Jade views are rendered by the response objects. A capability that
comes from registering a 'view engine' with the express app.

The JADE templates merge data provided in the form of a javascript objects
with simple white-space-indented tags to represent HTML.
The combination is 'rendered' and sent to the client.
************************************************************************
This is an Express 4.x application.
Here we use a routes module. We put our route handling code in
a separate module that is required by the main app.

We use the exported route functions in the 'use' and 'get'
routes. Notes 'use' calls functions that invoke next() whereas our
get and post routes send responses to the client.

*/

//Cntl+C to stop server (in Windows CMD console)

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var  app = express(); //create express middleware dispatcher


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true; //to generate pretty view-source code in browser

//read routes modules
var routes = require('./routes/index');

function methodLogger(request, response, next){
		   console.log("");
		   console.log("================================");
		   console.log("Console Logger:");
		   console.log("METHOD: " + request.method);
		   console.log("URL:" + request.url);
		   next(); //call next middleware registered
}
function headerLogger(request, response, next){
		   console.log("Headers:")
           for(k in request.headers) console.log(k);
		   next(); //call next middleware registered
}


//register middleware with dispatcher
//ORDER MATTERS HERE
app.use(routes.authenticate); //authenticate user
app.use(favicon());
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.get('/index.html', routes.index);
app.get('/songs', routes.find);
app.get('/users', routes.users);
app.get('/song/*', routes.songDetails);

//create http-express server
http.createServer(app).listen(3000);

console.log(`Server listening on port: 3000 CNTL:-C to stop`)
console.log(`To Test:`)
console.log('user: ldnel password: secret')
console.log('http://localhost:3000/index.html')
console.log('http://localhost:3000/users')
console.log('http://localhost:3000/songs?title=Love')
console.log('http://localhost:3000/song/372')
