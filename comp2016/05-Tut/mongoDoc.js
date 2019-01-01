const MongoClient = require('mongodb').MongoClient;
const test = require('assert');
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'test';
// Connect using MongoClient
MongoClient.connect(url, function(err, client) {
  // Create a collection we want to drop later
  const col = client.db(dbName).collection('createIndexExample1');
  // Insert a bunch of documents
  col.insertMany([{a:1, b:1}
    , {a:2, b:2}, {a:3, b:3}
    , {a:4, b:4}], {w:1}, function(err, result) {
    test.equal(null, err);
    // Show that duplicate records got dropped
    
    client.close();

  });
});