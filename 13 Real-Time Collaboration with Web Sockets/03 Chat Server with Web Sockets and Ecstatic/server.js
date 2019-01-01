/*
(c) Louis D. Nel
Websocket based Chat Server
Uses npm module ecstatic to help implement static server portion

Meant to illustrate how using indivdual npm modules can help solve
problems and simplify your code.

Before you run this app first execute
>npm install
to install npm modules dependencies listed in package.json file

Then launch this server:
node chatServer.js

Then open several browsers to: http://localhost:3000/chatClient.html

*/

const http = require('http')
//npm modules (need to install these first)
const WebSocketServer = require('ws').Server //npm module to provide web sockets
const ecStatic = require('ecstatic') //npm module provide convenient static file server service

const ROOT_DIR = 'html' //dir to serve static files from

//static file server based on npm module ecstatic
const server = http.createServer(ecStatic({
  root: __dirname + '/' + ROOT_DIR
}))

const wss = new WebSocketServer({
  server: server
})





wss.on('connection', function(ws) {
  console.log('Client connected')
  ws.on('message', function(msg) {
    console.log('Message: ' + msg)
    broadcast(msg)
  })


  ws.send('Connected to Server')
})

function broadcast(msg) {
  //send msg to all connected client sockets
  wss.clients.forEach(function(client) {
    client.send(msg)
  })
}



// io.on('connection', function(socket) {
//   socket.emit('serverSays', 'You are connected to CHAT SERVER')
//   socket.on('clientSays', function(data) {
//     console.log('RECEIVED: ' + data)
//     //to broadcast message to everyone including sender:


//     io.emit('serverSays', data) //broadcast to everyone including sender
//     //alternatively to broadcast to everyone except the sender
//     //socket.broadcast.emit('serverSays', data)
//   })
// })









server.listen(3000)
console.log('Server Running at port 3000  CNTL-C to quit')
console.log('To Test:')
console.log('Open several browsers to: http://localhost:3000/chatClient.html')
