
Example adapted from:
Mario Casciaro "Node.js Design Patterns" Packt
Chapter 8: Messaging and Integration Patterns

This sample demonstrates how to implement a basic chat application in Node.js
using "raw" Web Sockets. It uses two npm modules added to node.js:
the ecstatic.js modules to provide a convenient static file server and these ws.js
web sockets module to provide web sockets capability.

(As a programming exercise can you change the code to not need ecstatic and just uses
our own static server code we have been using thus far.)

To run first install the dependencies in package.json by executing:
  >npm install

Then run:
  >node server.js

To try the application open several browser instances at the address:
  http://localhost:3000/chatClient.html

Then chat with each other.
