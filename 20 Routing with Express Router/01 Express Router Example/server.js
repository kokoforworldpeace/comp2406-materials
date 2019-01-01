/*
(c) 2018 Louis D. Nel
This Example illustrates mounting express routes using the
express.Router() object.
This is a very typical way to "mount" routes when building an
express.js application. Mounting means to associate the
routes with specific url prefixes.

Example is based on the express documentation:
https://expressjs.com/en/guide/routing.html

Testing:
http://localhost:3000/
http://localhost:3000/index.html
http://localhost:3000/birds
http://localhost:3000/birds/about
http://localhost:3000/cats
http://localhost:3000/birds/about
*/

const http = require('http')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const hbs = require('hbs') //we need this to do partials

//Routers
const index = require('./routes/index')
const birds = require('./routes/birds')
const cats = require('./routes/cats')

const  app = express() //create express middleware dispatcher
const PORT = process.env.PORT || 3000
let siteCounter = 1 //site visit counter rendered in page footer

// view engine setup
hbs.registerPartials(__dirname + '/views/partials') //tell hbs where to find the partials
//register a handlebars helper function
hbs.registerHelper('counter', function(label){
	return `${label} ${siteCounter++}`
})
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs') //use hbs handlebars view engine

app.locals.pretty = true //to generate pretty view-source code in browser

//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))

//mount routes
app.use('/', index)
app.use('/birds', birds)
app.use('/cats', cats)

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test: http://localhost:3000/`)
		console.log(`To Test: http://localhost:3000/index.html`)
		console.log(`To Test: http://localhost:3000/birds`)
		console.log(`To Test: http://localhost:3000/birds/about`)
		console.log(`To Test: http://localhost:3000/cats`)
		console.log(`To Test: http://localhost:3000/birds/about`)
	}
})
