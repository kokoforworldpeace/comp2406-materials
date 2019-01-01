/*
(c) 2018 Louis D. Nel
Here we a prepared to receive a POST message from the client as a
JSON object,
and acknowledge that, but in this example the server sends it back
as MIME type "application/json".
(Expecting that the client code will provide the client with a javascript
object automatically parsed because of the application/json MIME type).

The client will show an alert when it gets the JSON object back from the sever
*/

/*
Use browser to view pages at http://localhost:3000/example1.html

When the blue cube is moved with the arrow keys, a POST message will be
sent to the server when the arrow key is released. The POST message will
contain a data string which is the location of the blue cube when the
arrow key was released.

Notice how the data is received and sent as JSON strings
*/

//Cntl+C to stop server (in Windows CMD console)

const http = require('http')//need to http
const fs = require('fs') //need to read static files
const url = require('url') //to parse url strings

const ROOT_DIR = 'html' //dir to serve static files from

const MIME_TYPES = {
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
}

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
  })

  //event handler for the end of the message
  request.on('end', function() {
    console.log('received data: ', receivedData)
    console.log('type: ', typeof receivedData)

    //MESSAGE ROUTING
    //if it is a POST request then echo back the data.
    if (request.method == "POST") {
      let dataObj = JSON.parse(receivedData); //DATA IS PARSED AS JSON STRING
      console.log('received data object: ', dataObj)
      console.log('type: ', typeof dataObj)
      //HERE WE CREATE A JSON STRING BUT SEND IT AS MIME TYPE 'application/json'
      response.writeHead(200, {
        'Content-Type': MIME_TYPES['json']
      })
      response.end(JSON.stringify(dataObj))
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
          return;
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
