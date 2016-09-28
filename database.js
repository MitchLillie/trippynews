const { MongoClient } = require('mongodb')
const fs = require('fs')
const {user, password} = JSON.parse(fs.readFileSync('secret.json'))

// Connection URL
var url = 'mongodb://' + user + ':' + password + '@ds041586.mlab.com:41586/trippynews_articles'

let DB = (function () {
  let db = {}

  db.ready = function () {
    let promise = new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw new Error(err)
        console.log('Connected successfully to server')

        db.close()
      })
    })
    return promise
  }

  db.save = function (data) {
    let promise = new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw new Error(err)

        let collection = db.collection('articles')
        if (typeof data[0] !== 'object') {
          let single = Object.assign({}, data)
          data = []
          data.push(single)
        }
        collection.insertMany(data, function (err, result) {
          if (err) throw new Error(err)
          resolve(result)
        })
      })
    })
    return promise
  }
  return db
})()

module.exports = DB
