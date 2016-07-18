'use strict'

var request = require('superagent')
, cheerio = require('cheerio')
, async = require('async')

function getXunLeiAccount (done) {
  var url = 'http://xlfans.com'
  getPage(url, function (err, ret) {
    if (err) {
      /* istanbul ignore next */
      return
    }
    var $ = cheerio.load(ret)
    , urls = []
    , accounts = []
    $('.label-important').each(function (idx, element) {
      var detailUrl = $(element).next().find('a').attr('href')
      if (detailUrl.length < 0) {
        /* istanbul ignore next */
        return
      }
      urls.push(detailUrl)
    })

    async.each(urls, function (detailUrl, next) {
      getPage(detailUrl, function (subErr, text) {
        if (subErr) {
          /* istanbul ignore next */
          console.error(subErr)
          // Ignore get sub page error.
          /* istanbul ignore next */
          return next()
        }
        $ = cheerio.load(text)
        $('p').each(function (idx, element) {
          var reg = /迅雷(会员帐号|白金账号)：([A-Za-z0-9_@._]+)密码：([A-Za-z0-9_]+)/g
          , info = $(element).text() || ''
          info = info.match(reg)
          if (!info) {
            return
          }
          info.forEach(function (item) {
            item = item.match(/迅雷(会员帐号|白金账号)：([A-Za-z0-9_@._]+)密码：([A-Za-z0-9_]+)/)

            var account = {
              username: item[2]
              , password: item[3]
              , type: item[1]
            }
            // TODO 检测会员账号是否可用
            accounts.push(account)
          })
        })

        next()
      })
    }, function (err) {
      if (done != null && typeof done === 'function') {
        done(err, accounts)
      }
    })
  })
}

function getPage (url, cb) {
  request
    .get(url)
    .set('User-agent', 'Mozilla/5.0')
    .end(function (err, res) {
      if (err || !res.ok) {
        /* istanbul ignore next */
        cb(err || 'failed')
      } else {
        cb(null, res.text)
      }
    })
}

module.exports = getXunLeiAccount
