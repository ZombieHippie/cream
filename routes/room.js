var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.send('Welcome to ' + req.params.id + '!');
});

router.get('/', function(req,res,next) {
  // redirect to the lobby
  res.redirect('/lobby')
})

module.exports = router;
