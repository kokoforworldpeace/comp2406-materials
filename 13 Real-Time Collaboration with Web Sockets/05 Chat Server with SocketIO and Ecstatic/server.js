/*
(c) 2018 Louis D. Nel
Simple socket.io based chat server.

Based on:
https://socket.io
see in particular:
https://socket.io/docs/
https://socket.io/get-started/chat/

Uses npm module 'ecstatic' to serve static files.

Before you run this app first execute
>npm install
to install npm modules dependencies listed in package.json file
Then launch this server:
>node server.js

To test open several browsers to: http://localhost:3000/chatClient.html

*/
const http = require('http')
const ecStatic = require('ecstatic') //npm module provide convenient static file server service

const PORT = process.env.PORT || 3000 //useful if you want to specify port through environment variable

const ROOT_DIR = 'html' //dir to serve static files from

//static file server based on npm module ecstatic
const server = http.createServer(ecStatic({
  root: __dirname + '/' + ROOT_DIR
}))
const io = require('socket.io')(server) //wrap server app in npm socket.io capability

server.listen(PORT) //start server listening on PORT







io.on('connection', function(socket) {
  socket.emit('serverSays', 'You are connected to CHAT SERVER')
  socket.on('clientSays', function(data) {
    console.log('RECEIVED: ' + data)
    //to broadcast message to everyone including sender:
    io.emit('serverSays', data) //broadcast to everyone including sender
    //alternatively to broadcast to everyone except the sender
    //socket.broadcast.emit('serverSays', data)
  })
})

console.log(`Server Running at port ${PORT}  CNTL-C to quit`)
console.log(`To Test:`)
console.log(`Open several browsers to: http://localhost:3000/chatClient.html`)
