const { MongoClient } = require('mongodb')

// Connection URL
var url = 'mongodb://client:' + process.argv[2] + '@ds041586.mlab.com:41586/trippynews_articles'

// Use connect method to connect to the server
MongoClient.connect(url, function (err, db) {
  if (err) throw new Error(err)
  console.log('Connected successfully to server')

  db.close()
})
