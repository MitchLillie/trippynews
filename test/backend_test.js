import { expect } from 'chai'
import { scrape } from '../backend'
process.setMaxListeners(0)

describe('backend', function () {
  describe('crawl', function () {
    it('scrapes sites for data', function (done) {
      this.timeout(10000)
      let source = {
        id: 1,
        url: 'http://www.nytimes.com/column/trilobites',
        li: '.theme-summary',
        link: '.story-link',
        text: '.story-body-text',
        depth: 1
      }
      scrape(source).then((data) => {
        console.log('data: ', data)
        done()
      }).catch((e) => {
        throw new Error(e)
      })
    })
  })
})
