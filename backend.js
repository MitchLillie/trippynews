'use strict'

const request = require('request')
const cheerio = require('cheerio')
const echoMungeWeb = require('echomunge-web')
const EchoMunge = require('echomunge')
let $list
let $article
let db

request('http://www.nytimes.com/column/trilobites', function (err, res, body) {
  if (err) {
    throw new Error(err)
  }
  $list = cheerio.load(body)
  $list('.theme-summary').each(function (i, e) {
    let $this = $list(this)
    let storyLink = $list('.story-link', $this).attr('href')
    request(storyLink, function (err, res, body) {
      if (err) {
        throw new Error(err)
      }
      $article = cheerio.load(body)
      db = new EchoMunge()
      db.recordText($article('.story-body-text').text())
      console.log('==========')
      let str = db.makeText({ maxLength: 500, terminate: true }) + ' ' + db.makeText({ maxLength: 200, terminate: true }) + ' ' + db.makeText({ maxLength: 600, terminate: true })
      console.log(str)
    })
    // console.log('l: ', l)
    // echoMungeWeb(l, function (err, db) {
    //   if (err) throw err
    //   for (var i = 0; i < 100; i++) {
    //     console.log(db.makeText({ maxLength: 500, terminate: true }))
    //   }
    // })
    // let title = $('.headline', $this).text()
    // let txt = $('.summary', $this).text()
    // summaryTool.summarize(title, txt, function (err, summary) {
    //   if (err) {
    //     throw new Error(err)
    //   }
    //   console.log('summary: ', summary)
    //   console.log('Original Length ' + (title.length + txt.length))
    //   console.log('Summary Length ' + summary.length)
    //   console.log('Summary Ratio: ' + (100 - (100 * (summary.length / (title.length + txt.length)))))
    // })
  })
})
