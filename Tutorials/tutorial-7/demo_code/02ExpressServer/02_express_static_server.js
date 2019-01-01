/*
Example of a "static server implemented with the express framework
and express.js static Middleware.

PREREQUISITES:
install express module using the package.json file with command:
>npm install

TO TEST:
Use browser to view pages at http://localhost:3000/index.html.
*/
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
const ROOT_DIR = '/public' //root directory for our static pages

//Middleware
app.use(express.static(__dirname + ROOT_DIR)) //provide static server

//Routes
//catch all requests an log them using app.all route
app.all('*', function(req, res, next) {
  console.log('-------------------------------')
  console.log('req.path: ', req.path)
  console.log('serving:' + __dirname + ROOT_DIR + req.path)
  next() //allow next route or middleware to run
})

//start server
app.listen(PORT, err => {
  if (err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT} CNTL-C to Quit`)
    console.log('To Test')
    console.log('http://localhost:3000/greeting.html')
    console.log('http://localhost:3000/index.html')
    console.log('http://localhost:3000/table.html')
    console.log('http://localhost:3000/table_css_internal.html')
    console.log('http://localhost:3000/table_css_external.html')
  }
})
