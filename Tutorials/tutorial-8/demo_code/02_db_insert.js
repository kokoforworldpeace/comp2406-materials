/*
(c) 2018 Louis D. Nel

Demonstration code to access MongoDB database from Node.js application:

Prerequisites:

1)You must have mongodb server running. It should have a database called "dbSongs" which contains a collection named "Songs".

2)You must have installed the npm module: mongodb (in the dependencies
section of the package.json file)
by executing the command:

npm install
*/


const MongoClient = require('mongodb').MongoClient
const DB_URL = 'mongodb://localhost:27017'
const db_name = 'dbSongs'

MongoClient.connect(DB_URL, {
  useNewUrlParser: true
}, function(err, client) {
  if (err) {
    console.log(`FAILED TO CONNECTED TO: ${DB_URL}`)
  } else {
    console.log(`CONNECTED TO: ${DB_URL}`)
    const col = client.db(db_name).collection('Songs')

    col.insert({
      title: "Happy Birthday",
      composer: "Anonymous"
    }, 
    function(err, result) {
      console.log(result)
      client.close()
    })
  }
})
