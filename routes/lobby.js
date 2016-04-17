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
        rooms: rooms,
        team_name: 'The Cream Stream Dream Team',
        team_members: ['Cole Lawrence', 'Matt Pierzynski', 'Kory Rekowski', 'David Robinson', 'Cameron Yuan']
      })
    }
  })
})



module.exports = router
