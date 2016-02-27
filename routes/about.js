var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Team members: David, Cole, Matt, Cory, Cameron');
});

module.exports = router;
