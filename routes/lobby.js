var express = require('express')
var router = express.Router()
var database = require('../database')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('lobby', {
    title: 'Cream Stream lobby',
    rooms: database.rooms
  })
})



module.exports = router
