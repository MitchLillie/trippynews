'use strict'

const request = require('request')
const cheerio = require('cheerio')
const EchoMunge = require('echomunge')
const url = require('url')
const fs = require('fs')
const moment = require('moment')
moment.locale('en')
let $list
let $article
const { pixabay_api } = JSON.parse(fs.readFileSync('secret.json'))

let {sources} = JSON.parse(fs.readFileSync('sources.json'))
sources = sources.map((e, i) => {
  e.id = i + 1
  return e
})

let source = {
  id: 1,
  'url': 'http://www.upi.com/Odd_News/',
  'li': '.upi_item',
  'src': '#ph1 img',
  'backup_src': '.st_text_c img',
  'dateline_divider': ' -- ',
  'link': 'a',
  'text': '#article',
  'date': '.meta.grey',
  date_divider: /\|\W+/,
  date_parser: '--MMM-D--YYYY----h-mm-a'
}

const DB = require('./database')

// process.setMaxListeners(0)

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

function scrape (source) {
  let mungeReady = []
  let promise = new Promise(function (resolve, reject) {
    let j = request.jar()
    request({url: source.url, jar: j}, function (err, res, body) {
      if (err || !body) {
        reject(err)
      }
      $list = cheerio.load(body)

      $list(source.li).each(function (i, e) {
        if (i < 10) {
          let $this = $list(this)
          let storyLink = $list(source.link, $this).attr('href')
          storyLink = url.parse(storyLink)
          if (storyLink.host == null) {
            storyLink = url.resolve(source.url, storyLink.path)
          } else {
            storyLink = storyLink.href
          }
          mungeReady.push(munge(source, storyLink))
        }
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
    let j = request.jar()
    request({url: storyLink, jar: j}, function (err, res, body) {
      if (err || !body) {
        reject(err)
      }
      $article = cheerio.load(body)
      let articleText = $article(source.text).not('embed, script').text()
      if (source.dateline_divider) {
        articleText = articleText.split(source.dateline_divider).slice(1).join(source.dateline_divider)
      }
      let articleSrc = $article(source.src).attr('src') ? $article(source.src).attr('src') : $article(source.backup_src).attr('src')
      let articleData = {
        source_id: source.id,
        date: parseDate($article(source.date).clone().children().remove().end().text().replace(/[\n\t]/g, ``), source),
        src: articleSrc,
        href: storyLink,
        statusCode: res.statusCode,
        text: makeText(articleText)
      }
      let imagePromise = new Promise(function (resolve, reject) {
        if (typeof articleSrc === 'undefined' || !articleSrc) {
          let url = imageFromText(articleData.text)
          console.log("url: ", url)
          request(url, function (err, res, body) {
            if (err || !body) {
              // don't care
              resolve()
            }
            body = JSON.parse(body)
            if (body.totalHits > 0) {
              articleData.src = body.hits[0].webformatURL
            }
            resolve()
          })
        } else {
          resolve()
        }
      })
      imagePromise.then(function () {
        resolve(articleData)
      })
    })
  })
  return promise
}

if (require.main === module) {
  let sourcesReady = []
  sources.forEach(function (source, i) {
    sourcesReady.push(scrape(source))
  })
  Promise.all(sourcesReady)
    .then(data => {
      data = [].concat.apply([], data)
      DB.save(data).then(num => {
        console.log('added ', num.result.n, 'records')
        process.exit()
      })
      .catch((e) => { throw new Error(e) })
    })
    .catch((e) => { throw new Error(e) })
  //
  // scrape(source).then(function (data) {
  //   // console.log("data: ", data)
  //   DB.save(data).then(function (num) {
  //     console.log('added ', num.result.n, 'records')
  //     process.exit()
  //   }).catch((e) => { throw new Error(e) })
  // }).catch((e) => { throw new Error(e) })
} else {
  module.exports = {scrape, hashCode, parseDate}
}

function makeText (articleText) {
  let textStore = new EchoMunge()
  textStore.recordText(articleText)
  let text = ''
  let sentence = textStore.makeText({ maxLength: 100, terminate: true })

  while (true) {
    if (sentence.length > 3 && typeof sentence !== 'undefined') {
      text += (sentence + ' ')
    }
    sentence = textStore.makeText({ maxLength: ((Math.random() * 1000) + 150), terminate: true })
    if (text.length + (Math.random() * 1000) > 1500) {
      return text
    }
  }
}

function parseDate (string, source) {
  // string = "By Ben Hooper  Contact the Author   |  	Oct. 6, 2016 at 9:13 AM"
  // console.log("string1: ", string)
  if (source.date_divider) {
    string = string.slice(string.search(source.date_divider) + 1)
  }
  string = string.trim()
  // string = "  	Oct. 6, 2016 at 9:13 AM"
  // source.date_parser = "MMM-D--YYYY----h-mm-a"
  let m = moment(string, source.date_parser).unix()
  // console.log("m: ", m)
  return m
}

let usedTerms = []
function imageFromText (text) {
  var term = pickWord(text)
  while (term.length < 3 && usedTerms.indexOf(term) < 0) {
    term = pickWord(text)
  }
  usedTerms.push(term)
  return 'https://pixabay.com/api/?key=' + pixabay_api + '&q=' + encodeURI(term) + '&image_type=photo'
}

function pickWord (text) {
  return text.replace(/[^\w\s]/g, ``).split(' ')[Math.floor(Math.random() * 10)]
}
