/*
(c) 2018 Louis D. Nel

Demonstration code to access MongoDB database from Node.js application:

Prerequisites:

1)You must have mongodb server running. It should have a database called "dbSongs"
that contains a collection named "Songs" containing individual song data.

2)You must have installed the npm module: mongodb (in the dependencies
section of the package.json file)
by executing the command:

npm install
*/


const MongoClient = require('mongodb').MongoClient
const DB_URL = 'mongodb://localhost:27017'
const db_name = 'dbSongs'


MongoClient.connect(DB_URL, { useNewUrlParser: true }, function(err, client){
   if(err) console.log(`FAILED TO CONNECTED TO: ${DB_URL}`)
   else{
      console.log(`CONNECTED TO: ${DB_URL}`)
      const col = client.db(db_name).collection('Songs')
      col.find({}).toArray(function(err, items){
        //console.log(items)
        for(let song of items) {
          console.log(song)
        }
        client.close()
      })
   }
})
