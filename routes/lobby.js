var express = require('express')
var router = express.Router()
var database = require('../lib/database')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("SORT BY", req.query.sort)
  database.Room
  .find()
  .sort('-creationDate')
  .exec((error, rooms) => {
    if (error) {
      next(error)
    } else {
      res.render('lobby', {
        title: 'Cream Stream lobby',
        rooms: rooms
      })
    }
  })
})



module.exports = router
