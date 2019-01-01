/*
(c) 2018 Louis D. Nel
Example of http static server
built using express.js, but not using
the express 'static'  module yet.
That is, we are building the static server as we've done
earlier in the course but just using express middleware instead.


Testing: Use browser to view pages at:
http://localhost:3000/01hello.html
http://localhost:3000/02index.html
http://localhost:3000/03table.html
http://localhost:3000/04internalCSS.html
http://localhost:3000/05externalCSS.html
http://localhost:3000/06form.html
*/

//Cntl+C to stop server

const express = require('express')
const path = require('path')
const fs = require('fs')

const ROOT_DIR = 'html' //dir to serve static files from

const app = express()

app.use(function(request, response, next) {
  console.log(`Request URL: ${request.url}`)
  console.log(`Request date: ${new Date()}`)
  next()//!!!move to next app.use/ in order from top to bottom
})

app.use(function(request, response, next) {
  const filepath = path.join(__dirname, ROOT_DIR, request.url)
  console.log(`requested file: ${filepath}`)
  fs.stat(filepath, function(err, fileInfo) {
    if (err) {
      next()
      return
    }
    if (fileInfo.isFile()) {
      //here we make use of the .sendFile() function that express adds
      //to the request object (something not avialable in node.js by itself)
      response.sendFile(filepath)
    } else {
      next()
    }
  })
})

//error case will run if no middleware above
//handles the request
app.use(function(request, response) {
  response.status(404)
  response.send(`File not found`)
})

app.listen(3000, function() {
  console.log(`Static Server listening on PORT 3000, CNTL-C to Quit`)
  console.log(`To Test`)
  console.log(`http://localhost:3000/01hello.html`)
  console.log(`http://localhost:3000/02index.html`)
  console.log(`http://localhost:3000/03table.html`)
  console.log(`http://localhost:3000/04internalCSS.html`)
  console.log(`http://localhost:3000/05externalCSS.html`)
  console.log(`http://localhost:3000/06form.html`)
})
