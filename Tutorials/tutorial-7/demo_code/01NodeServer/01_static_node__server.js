/*
Example of node-based "static" server created with node.js and
only its internal modules: http, url, and fs.

Here our node server does not try to analyse the url to route the requests,
it simply servers whatever files that happen to be in the ROOT_DIR directory.
It does however replace a path of '/' with '/index.html'.

The server looks a the file extension of the requested file
to decide on the appropriate MIME type to return to the client.
*/

/*
Use browser to view pages at http://localhost:3000/index.html or
other files
*/

const http = require('http'); //need to http
const fs = require('fs'); //need to read static files
const url = require('url'); //to parse url strings

const ROOT_DIR = 'public'; //dir to serve static files from
const PORT = process.env.PORT || 3000
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

}).listen(PORT)

console.log('Server Listening on: ' + PORT + ' CNTL-C to quit')
console.log('To Test')
console.log('http://localhost:3000/greeting.html')
console.log('http://localhost:3000/index.html')
console.log('http://localhost:3000/table.html')
console.log('http://localhost:3000/table_css_internal.html')
console.log('http://localhost:3000/table_css_external.html')
