import { expect } from 'chai'
import { scrape, hashCode, parseDate } from '../backend'
process.setMaxListeners(0)

describe('backend', function () {
  describe('crawl', function () {
    it('gets some data from a source', function (done) {
      this.timeout(10000)
      let source = {
        id: 1,
        url: 'http://www.upi.com/Odd_News/',
        li: '.upi_item',
        title: '',
        link: 'a',
        text: '#article',
        depth: 1
      }
      scrape(source).then((data) => {
        expect(data).to.be.an('array')
        expect(data[2]).to.have.property('source_id')
          .that.is.a('number')
        expect(data[2]).to.have.property('hash')
          .that.is.a('number')
        expect(data[2]).to.have.property('statusCode')
          .that.is.a('number')
        expect(data[2]).to.have.property('text')
          .that.is.a('string')
        done()
      }).catch((e) => {
        throw new Error(e)
      })
    })

    it('repeatedly calculates a hash code based on the article text', function () {
      var text = 'NINGBO, China, Sept. 23 (UPI) -- Doctors'
      var a = hashCode(text)
      var b = hashCode(text)
      expect(a).to.equal(b)
    })

    it('calculates a date correctly', function () {
      var source = {
        date_divider: /\|\W+/,
        date_parser: 'MMM-D--YYYY----h-mm-a'
      }
      var string = 'By Eric DuVall     |  Oct. 7, 2016 at 1:28 PM'
      var date = parseDate(string, source)
      console.log("date.parsingFlags(): ", date.parsingFlags())
      expect(date).to.be.an.object
      expect(date.isValid()).to.be.true
    })
  })
})
