
const url = require('url')
const sqlite3 = require('sqlite3').verbose() //verbose provides more detailed stack trace
const db = new sqlite3.Database('data/db_1200iRealSongs')

db.serialize(function(){
	  //make sure a couple of users exist in the database.
	  //user: ldnel password: secret
	  //user: frank password: secret2
      var sqlString = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT)"
      db.run(sqlString)
      sqlString = "INSERT OR REPLACE INTO users VALUES ('ldnel', 'secret')"
      db.run(sqlString)
      sqlString = "INSERT OR REPLACE INTO users VALUES ('d', 'd')"
      db.run(sqlString)
  })

exports.authenticate = function (request, response, next){
    /*
	Middleware to do BASIC http 401 authentication
	*/
    let auth = request.headers.authorization;
	// auth is a base64 representation of (username:password)
	//so we will need to decode the base64
	if(!auth){
 	 	//note here the setHeader must be before the writeHead
		response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
        response.writeHead(401, {'Content-Type': 'text/html'})
		console.log('No authorization found, send 401.')
 		response.end()
	}
	else{
	    console.log("Authorization Header: " + auth)
        //decode authorization header
		// Split on a space, the original auth
		//looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
        let tmp = auth.split(' ')

		// create a buffer and tell it the data coming in is base64
        let buf = new Buffer(tmp[1], 'base64')

        // read it back out as a string
        //should look like 'ldnel:secret'
		let plain_auth = buf.toString()
        console.log("Decoded Authorization ", plain_auth)

        //extract the userid and password as separate strings
        let credentials = plain_auth.split(':')      // split on a ':'
        let username = credentials[0]
        let password = credentials[1]
        console.log("User: ", username)
        console.log("Password: ", password)

		let authorized = false;
		//check database users table for user
		db.all("SELECT userid, password FROM users", function(err, rows){
		for(let i=0; i<rows.length; i++){
		      if(rows[i].userid == username & rows[i].password == password) authorized = true;
		}
		if(authorized == false){
 	 	   //we had an authorization header by the user:password is not valid
		   response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
           response.writeHead(401, {'Content-Type': 'text/html'})
		   console.log('No authorization found, send 401.')
 		   response.end()
		}
        else
		  next()
		});
	}

	//notice no call to next()

}
function addHeader(request, response){
        // about.html
        let title = 'COMP 2406:'
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.write('<!DOCTYPE html>')
        response.write('<html><head><title>About</title></head>' + '<body>')
        response.write('<h1>' +  title + '</h1>')
		    response.write('<hr>')
}

function addFooter(request, response){
 		response.write('<hr>')
		response.write('<h3>' +  'Carleton University' + '</h3>')
		response.write('<h3>' +  'School of Computer Science' + '</h3>')
    response.write('</body></html>')

}



exports.index = function (request, response){
        // index.html
       addHeader(request, response)
       response.write(`<p>RENDERED WITHOUT TEMPLATES</p>`)
       addFooter(request, response)
       response.end()

}

function parseURL(request, response){
	let parseQuery = true //parseQueryStringIfTrue
    let slashHost = true //slashDenoteHostIfTrue
    let urlObj = url.parse(request.url, parseQuery , slashHost )
    console.log('path:')
    console.log(urlObj.path)
    console.log('query:')
    console.log(urlObj.query)
	return urlObj

}

exports.users = function(request, response){
        // users.html
		db.all("SELECT userid, password FROM users", function(err, rows){
      addHeader(request, response)
      response.write(`<h1>Users:</h1>`)
      for(let row of rows) {
        console.log(row)
        response.write(`<p>user: ${row.userid} password: ${row.password}</p>`)
      }
      addFooter(request, response)
      response.end()
		})

}

exports.find = function (request, response){
    // songs?title=Girl
		console.log("RUNNING FIND SONGS")

		let urlObj = parseURL(request, response)
		let sql = "SELECT id, title FROM songs"

        if(urlObj.query['title']) {
		    console.log("finding title: " + urlObj.query['title'])
		    sql = "SELECT id, title FROM songs WHERE title LIKE '%" +
			          urlObj.query['title'] + "%'"
		}

		db.all(sql, function(err, rows){
         console.log('ROWS: ' + typeof rows)
         addHeader(request, response)
         for(let row of rows) {
           //console.log(`<p><a href= 'song/${row.id}'>${row.id} ${row.title}</a></p>`)
           response.write(`<p><a href= 'song/${row.id}'>${row.id} ${row.title}</a></p>`)
         }
         addFooter(request, response)
         response.end()
 		});
}
exports.songDetails = function(request, response){

	    let urlObj = parseURL(request, response)
        let songID = urlObj.path //expected form: /song/235
		songID = songID.substring(songID.lastIndexOf("/")+1, songID.length)

		let sql = "SELECT id, title, composer, key, bars FROM songs WHERE id=" + songID
        console.log("GET SONG DETAILS: " + songID )

		db.all(sql, function(err, rows){
        console.log('Song Data')
        addHeader(request, response)
        for(let row of rows) {
          console.log(row)
          response.write(`<h1>Songs Details:</h1>`)
          response.write(`<h1>${row.id}: ${row.title} composer: ${row.composer}</h1>`)
          response.write(`<p>${row.bars}</p>`)
        }
        addFooter(request, response)
        response.end()
		})
}
exports.table=function(request,response){
            // console.log(tables);

        db.all("select name from sqlite_master where type='table'", function (err, tables) {

        addHeader(request, response)
        response.write(`<h1>Tables:</h1>`)
        for(let tb of tables) {
          console.log(tb)
          response.write(`<p>${JSON.stringify(tb)}</p>`)
        }
        addFooter(request, response)
        response.end()
          })
}
