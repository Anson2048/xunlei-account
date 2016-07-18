#!/usr/bin/env node

var xunleiAccount = require('./index.js')

xunleiAccount(function (err, ret) {
  if (err) {
    console.error(err)
  }
  ret.forEach(function (item) {
    console.log(item.type, item.username, item.password)
  })
  process.exit()
})
