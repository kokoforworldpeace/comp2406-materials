/*
(c) 2018 Louis D. Nel
Basic express server with middleware, SQLite database, and Handlebars template rendering.

The server allows client to find chord progressions of songs in
its SQLite database. The database provided has chord progressions
of some 1200 popular jazz standards.

****************************************************************************
Here we use server-side templating using the Handlebars template engine
to generate the HTML for the response pages to send to the client.
Handlebars is a popular templating format/engine.
Other popular ones include: PUG (formarly Jade), EJS, Liquid, Mustache.
Handlebar views are rendered from data obtained from the SQLite database.

The template engine merges data provided in the form of a javascript object
with html represented in the .hbs handlebars template files.
The combination is 'rendered' and sent to the client as .html.
*****************************************************************************

*/

const http = require('http')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')

const  app = express() //create express middleware dispatcher

const PORT = process.env.PORT || 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs') //use hbs handlebars wrapper

app.locals.pretty = true //to generate pretty view-source code in browser

//read routes modules
var routes = require('./routes/index')

//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
app.use(routes.authenticate) //authenticate user
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
//app.use(methodLogger);
//routes
app.get('/index.html', routes.index)
app.get('/songs', routes.find)
app.get('/users', routes.users)
app.get('/song/*', routes.songDetails)

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('user: ldnel password: secret')
		console.log('http://localhost:3000/index.html')
		console.log('http://localhost:3000/users')
		console.log('http://localhost:3000/songs?title=Love')
		console.log('http://localhost:3000/song/372')
	}
})