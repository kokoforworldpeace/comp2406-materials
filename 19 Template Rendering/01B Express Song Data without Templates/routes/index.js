
const url = require('url')
const fs = require('fs')
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
      sqlString = "INSERT OR REPLACE INTO users VALUES ('frank', 'secret2')"
      db.run(sqlString)
  })

exports.authenticate = function (request, response, next){
    /*
	Middleware to do BASIC http 401 authentication
	*/
    let auth = request.headers.authorization
	// auth is a base64 representation of (username:password)
	//so we will need to decode the base64
	if(!auth){
 	 	//note here the setHeader must be before the writeHead
		response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
        response.writeHead(401, {'Content-Type': 'text/html'})
		console.log('No authorization found, send 401.')
 		response.end();
	}
	else{
	    console.log("Authorization Header: " + auth)
        //decode authorization header
		// Split on a space, the original auth
		//looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
        var tmp = auth.split(' ')

		// create a buffer and tell it the data coming in is base64
        var buf = new Buffer(tmp[1], 'base64')

        // read it back out as a string
        //should look like 'ldnel:secret'
		var plain_auth = buf.toString()
        console.log("Decoded Authorization ", plain_auth)

        //extract the userid and password as separate strings
        var credentials = plain_auth.split(':')      // split on a ':'
        var username = credentials[0]
        var password = credentials[1]
        console.log("User: ", username)
        console.log("Password: ", password)

		var authorized = false
		//check database users table for user
		db.all("SELECT userid, password FROM users", function(err, rows){
		for(var i=0; i<rows.length; i++){
		      if(rows[i].userid == username & rows[i].password == password) authorized = true
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
		})
	}

	//notice no call to next()

}

function handleError(response, err){
	//report file reading error to console and client
    console.log('ERROR: ' + JSON.stringify(err))
	//respond with not found 404 to client
    response.writeHead(404)
    response.end(JSON.stringify(err))
}

/*
CAN YOU FIND A BETTER WAY TO HANDLE THE NEXT THREE CUT AND PASTE FUNCTIONS:
*/

function send_find_data(request, response, rows){
	/*
	This code assembles the response from two partial .html files
	with the data placed between the two parts
	This CLUMSY approach is done here to motivivate the need for
	template rendering. Here we use basic node.js file reading to
	simulate placing data within a file.
	*/
  //notice navigation to parent directory:
	var headerFilePath = __dirname + '/../views/header.html'
	var footerFilePath = __dirname + '/../views/footer.html'
  fs.readFile(headerFilePath, function(err,data){
     if(err){ handleError(response, err); return;}
     response.writeHead(200, {'Content-Type': 'text/html'})
     response.write(data)

      //INSERT DATA
      for(let row of rows) {
        response.write(`<p><a href= 'song/${row.id}'>${row.id} ${row.title}</a></p>`)
      }

	   fs.readFile(footerFilePath, function(err,data){
         if(err){ handleError(response, err); return;}
         response.write(data)
	       response.end()
       })
     })
}

function send_song_details(request, response, rows){
	/*
	This code assembles the response from two partial .html files
	with the data placed between the two parts
	This CLUMSY approach is done here to motivivate the need for
	template rendering. Here we use basic node.js file reading to
	simulate placing data within a file.
	*/
  //notice navigation to parent directory:
	var headerFilePath = __dirname + '/../views/header.html'
	var footerFilePath = __dirname + '/../views/footer.html'
  fs.readFile(headerFilePath, function(err,data){
     if(err){ handleError(response, err); return;}
     response.writeHead(200, {'Content-Type': 'text/html'})
     response.write(data)

      //INSERT DATA
      for(let row of rows) {
        console.log(row)
        response.write(`<h1>Songs Details:</h1>`)
        response.write(`<h1>${row.id}: ${row.title} composer: ${row.composer}</h1>`)
        response.write(`<p>${row.bars}</p>`)
      }

	   fs.readFile(footerFilePath, function(err,data){
         if(err){ handleError(response, err); return;}
         response.write(data)
	       response.end()
       })
     })
}

function send_users(request, response, rows){
	/*
	This code assembles the response from two partial .html files
	with the data placed between the two parts
	This CLUMSY approach is done here to motivivate the need for
	template rendering. Here we use basic node.js file reading to
	simulate placing data within a file.
	*/
  //notice navigation to parent directory:
	var headerFilePath = __dirname + '/../views/header.html'
	var footerFilePath = __dirname + '/../views/footer.html'
  fs.readFile(headerFilePath, function(err,data){
     if(err){ handleError(response, err); return;}
     response.writeHead(200, {'Content-Type': 'text/html'})
     response.write(data)

      //INSERT DATA
      for(let row of rows) {
        console.log(row)
        response.write(`<p>user: ${row.userid} password: ${row.password}</p>`)
      }

	   fs.readFile(footerFilePath, function(err,data){
         if(err){ handleError(response, err); return;}
         response.write(data)
	       response.end()
       })
     })
}


exports.index = function (request, response){
        // index.html
        //notice navigation to parent directory:
      	var headerFilePath = __dirname + '/../views/header.html'
      	var footerFilePath = __dirname + '/../views/footer.html'
        fs.readFile(headerFilePath, function(err,data){
           if(err){ handleError(response, err); return;}
           response.writeHead(200, {'Content-Type': 'text/html'})
           response.write(data)

            //INSERT DATA -no data to insert

      	   fs.readFile(footerFilePath, function(err,data){
               if(err){ handleError(response, err); return;}
               response.write(data)
      	       response.end()
             })
          })
}

function parseURL(request, response){
	var parseQuery = true //parseQueryStringIfTrue
    var slashHost = true //slashDenoteHostIfTrue
    var urlObj = url.parse(request.url, parseQuery , slashHost )
    console.log('path:')
    console.log(urlObj.path)
    console.log('query:')
    console.log(urlObj.query)
	return urlObj

}

exports.users = function(request, response){
        // /send_users
		db.all("SELECT userid, password FROM users", function(err, rows){
      send_users(request, response, rows)
		})

}

exports.find = function (request, response){
        // /songs?title=Girl
		console.log("RUNNING FIND SONGS")

		var urlObj = parseURL(request, response);
		var sql = "SELECT id, title FROM songs";

        if(urlObj.query['title']) {
		    console.log("finding title: " + urlObj.query['title']);
		    sql = "SELECT id, title FROM songs WHERE title LIKE '%" +
			          urlObj.query['title'] + "%'";
		}

		db.all(sql, function(err, rows){
         console.log('ROWS: ' + typeof rows)
         send_find_data(request, response, rows)
 		})
}
exports.songDetails = function(request, response){
     // /song/235
	    var urlObj = parseURL(request, response)
        var songID = urlObj.path
		songID = songID.substring(songID.lastIndexOf("/")+1, songID.length)

		var sql = "SELECT id, title, composer, key, bars FROM songs WHERE id=" + songID
        console.log("GET SONG DETAILS: " + songID )

		db.all(sql, function(err, rows){
        console.log('Song Details Data')
        send_song_details(request, response, rows)
		})
}
