'use strict'

const request = require('request')
const cheerio = require('cheerio')
const echoMungeWeb = require('echomunge-web')
const EchoMunge = require('echomunge')
const url = require('url')
let $list
let $article
let db

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

request(source.url, function (err, res, body) {
  if (err) {
    throw new Error(err)
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
    console.log('storyLink: ', storyLink)
    request(storyLink, function (err, res, body) {
      if (err) {
        throw new Error(err)
      }
      $article = cheerio.load(body)
      db = new EchoMunge()
      db.recordText($article(source.text).not('embed, script').text())
      console.log('==========')
      let str = db.makeText({ maxLength: 500, terminate: true }) + ' ' + db.makeText({ maxLength: 200, terminate: true }) + ' ' + db.makeText({ maxLength: 600, terminate: true })
      console.log(str)
    })
  })
})
