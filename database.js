const { MongoClient } = require('mongodb')
const fs = require('fs')
const {user, password} = JSON.parse(fs.readFileSync('secret.json'))

// Connection URL
var url = 'mongodb://' + user + ':' + password + '@ds041586.mlab.com:41586/trippynews_articles'

// Use connect method to connect to the server
MongoClient.connect(url, function (err, db) {
  if (err) throw new Error(err)
  console.log('Connected successfully to server')

  db.close()
})
