'use strict'

const request = require('request')
const cheerio = require('cheerio')
const EchoMunge = require('echomunge')
const url = require('url')
let $list
let $article
let db
process.setMaxListeners(0)

function hashCode (str) {
  var hash = 0
  var i
  var chr
  var len
  if (str.length === 0) return hash
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

// let source = {
//   id: 1,
//   url: 'http://www.nytimes.com/column/trilobites',
//   li: '.theme-summary',
//   link: '.story-link',
//   text: '.story-body-text',
//   depth: 1
// }

// let source = {
//   id: 1,
//   url: 'http://abcnews.go.com/Weird',
//   li: '.ffl_obj',
//   link: '#h_default a',
//   text: '.article-copy',
//   depth: 1
// }

let source = {
  id: 1,
  url: 'http://www.upi.com/Odd_News/',
  li: '.upi_item',
  title: '',
  link: 'a',
  text: '#article',
  depth: 1
}

function scrape (source) {
  let mungeReady = []
  let promise = new Promise(function (resolve, reject) {
    request(source.url, function (err, res, body) {
      if (err || !body) {
        reject(err)
      }
      $list = cheerio.load(body)

      $list(source.li).each(function (i, e) {
        let $this = $list(this)
        let storyLink = $list(source.link, $this).attr('href')
        storyLink = url.parse(storyLink)
        if (storyLink.host == null) {
          storyLink = url.resolve(source.url, storyLink.path)
        } else {
          storyLink = storyLink.href
        }
        mungeReady.push(munge(source, storyLink))
      })
      Promise.all(mungeReady)
        .then((data) => resolve(data))
        .catch((e) => reject(e))
    })
  })
  return promise
}

function munge (source, storyLink) {
  let promise = new Promise(function (resolve, reject) {
    request(storyLink, function (err, res, body) {
      if (err || !body) {
        reject(err)
      }
      $article = cheerio.load(body)
      let articleText = $article(source.text).not('embed, script').text()
      let articleData = {
        source_id: source.id,
        hash: hashCode(articleText.slice(0, 40)),
        statusCode: res.statusCode
      }
      db = new EchoMunge()
      db.recordText(articleText)
      articleData.text = db.makeText({ maxLength: 500, terminate: true }) + ' ' + db.makeText({ maxLength: 200, terminate: true }) + ' ' + db.makeText({ maxLength: 600, terminate: true })
      resolve(articleData)
    })
  })
  return promise
}

if (require.main === module) {
  scrape(source).then(function (data) {
    console.log(data)
  })
} else {
  module.exports = {scrape, hashCode}
}
