'use strict'
import chai from 'chai'
import cap from 'chai-as-promised'

chai.use(cap)
const {expect} = chai

import DB from '../database'

describe('database', function () {
  describe('ready', function () {
    it('returns a promise', function () {
      expect(DB.ready()).to.be.a('promise')
    })
    it('resolves on success', function () {
      return expect(DB.ready()).to.eventually.be.resolved
    })
    it('rejects on error')
  })

  describe('save', function () {
    it('saves some articles', function (done) {
      let articles = [
        { source_id: 1,
          hash: 1586874354,
          statusCode: 200,
          text: 'I fail to scare party guests. The $30. We\'ve reached out to advise the humor in Canada will no longer sell a Halloween decoration depicts a Halloween decoration depicting a window!'
        },
        { source_id: 1,
          hash: 384266668,
          statusCode: 200,
          text: 'Pranjal Borkotoky gently waved his game. Pranjal Borkotoky gently waved his golf club at the birds continued to squawk loudly while keeping an eye on the ball. Pranjal Borkotoky shared video of himself swinging at the birds as he wrote?'
        }
      ]
      DB.save(articles).then(function (res) {
        expect(res.result.ok).to.equal(1)
        expect(res.result.n).to.equal(2)
        done()
      })
    })

    it('deletes all articles for that source before saving', function (done) {
      this.timeout(5000)
      let articles = [
        { source_id: 1,
          hash: 1586874354,
          statusCode: 200,
          text: 'I fail to scare party guests. The $30. We\'ve reached out to advise the humor in Canada will no longer sell a Halloween decoration depicts a Halloween decoration depicting a window!'
        },
        { source_id: 1,
          hash: 384266668,
          statusCode: 200,
          text: 'Pranjal Borkotoky gently waved his game. Pranjal Borkotoky gently waved his golf club at the birds continued to squawk loudly while keeping an eye on the ball. Pranjal Borkotoky shared video of himself swinging at the birds as he wrote?'
        }
      ]
      DB.save(articles).then(function (res) {
        DB.save(articles).then(function (res) {
          DB.get(1).then(function (res) {
            expect(res.length).to.equal(2)
            done()
          })
        })
      })
    })
  })
})
