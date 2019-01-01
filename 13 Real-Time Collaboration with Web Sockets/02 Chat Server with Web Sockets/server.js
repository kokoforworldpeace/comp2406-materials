/*
(c) 2018 Louis D. Nel
Example of node as a basic "static" server created with node.js and
only its internal modules: http, url, and fs.

The npm module ws is used to implement a simple websocket chat service.

To run this app first execute
npm install
to install npm modules listed in package.json file

/*
Use several browser instances to visit http://localhost:3000/chatClient.html
and have them chat with each other
*/

const http = require('http') //need to http
const fs = require('fs') //need to read static files
const url = require('url') //to parse url strings
const WebSocketServer = require('ws').Server //npm module ws

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

function broadcast(msg) {
  //wss --> Web Socket Server
  wss.clients.forEach(function(client) { //client == WebSocket object
    client.send(msg) // msg == data
    /*websocket.send(data[, options][, callback])
1.data {Any} The data to send.
2.options {Object}
compress {Boolean} Specifies whether data should be compressed or not. Defaults to true when permessage-deflate is enabled.
binary {Boolean} Specifies whether data should be sent as a binary or not. Default is autodetected.
mask {Boolean} Specifies whether data should be masked or not. Defaults to true when websocket is not a server client.
fin {Boolean} Specifies whether data is the last fragment of a message or not. Defaults to true.
3.callback {Function} An optional callback which is invoked when data is written out.
Send data through the connection.
    */
  })
  // console.log(wss); wss.clients: Set {}
}

const server = http.createServer(function(request, response) {
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let filePath = ROOT_DIR + urlObj.pathname
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/chatClient.html'

if (request.method=='GET') {
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

//Create web socket server and events to process
const wss = new WebSocketServer({
  server: server
})
//server on
wss.on('connection', function(ws) {
  console.log('Client connected')
  //socket on
  ws.on('message', function(msg) { //MessageEvent triggers anounymous function
    /*websocket.onmessage
{Function}
An event listener to be called when a message is received from the server.
The listener receives a MessageEvent named "message".
    */
    console.log('Message: ' + msg)
    broadcast(msg)
  })
})

server.listen(3000)

console.log('Server Running at port 3000  CNTL-C to quit')
console.log('To Test:')
console.log('Open several browsers to: http://localhost:3000/chatClient.html')
