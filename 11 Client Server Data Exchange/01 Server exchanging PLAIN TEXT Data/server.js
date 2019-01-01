/*
(c) 2018 Louis D. Nel
Here we are prepared to receive a POST message from the client,
and acknowledge that, but still no attempt to extract the data or parse it

Use browser to view pages at http://localhost:3000/example1.html

When the blue cube is moved with the arrow keys, a HTTP POST message will be
sent to the server when the arrow key is released. The POST message will
contain a data string that has the location of the blue cube when the
arrow key was released.

Notice how the data is sent: as an object, but notice how it is
received: as a string containing "&" separators.
(i.e. it looks like the query parameters of a GET message URL.)

Notice we are attaching an event handler with the
callback to the request object to collect data that might
arrive in chunks.
Also an event handler to detect the end
of the request which then examines the HTTP verb and reacts to a POST or GET request.

GET requests are just being handled as requests to serve static files.
Still no attempt to route based on the URL part of the client request.
That is, we are assuming any GET request is for a static file and any POST
request handled by looking at the data provided.
*/

//Cntl+C to stop server

const http = require('http') //need to http
const fs = require('fs') //need to read static files
const url = require('url') //to parse url strings

const ROOT_DIR = 'html' //dir to serve static files from

var MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
};

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}

http.createServer(function(request, response) {

  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let receivedData = ''

  //attached event handlers to collect the message data
  request.on('data', function(chunk) {
    receivedData += chunk
    console.log('chunk : '+JSON.stringify(chunk));
  })

  //event handler for the end of the message
  request.on('end', function() {
    console.log('received data: ', receivedData)
    console.log('type: ', typeof receivedData)

    //MESSAGE ROUTING
    //if it is a POST request then echo back the data.
    if (request.method == "POST") {
      response.writeHead(200, {
        'Content-Type': MIME_TYPES['txt']
      })
      response.end('Data Received: ' + receivedData)
    }

    if (request.method == "GET") {
      //handle GET requests as static file requests
      let filePath = ROOT_DIR + urlObj.pathname
      if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

      fs.readFile(filePath, function(err, data) {
        if (err) {
          //report error to console
          console.log('ERROR: ' + JSON.stringify(err))
          //respond with not found 404 to client
          response.writeHead(404)
          response.end(JSON.stringify(err))
          return
        }
        response.writeHead(200, {
          'Content-Type': get_mime(filePath)
        })
        response.end(data)
      })
    }
  })

}).listen(3000)

console.log('Server Running at PORT 3000  CNTL-C to quit')
console.log('To Test')
console.log('http://localhost:3000/example1.html')
