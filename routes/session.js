var express = require('express');
var router = express.Router();
var database = require('../lib/database')

router.post('/', function (req, res, next) {
  req.session.name = req.body.name
  res.render('session', { session: req.session })
})

/* GET users listing */
router.get('/', function(req, res, next) {
  res.render('session', { session: req.session })
})

module.exports = router;
