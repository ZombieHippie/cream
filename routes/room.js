var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  var rid = req.params.id
  res.render('room', {
    title: rid + ' - Cream Room',
    roomId: rid,
    isAdmin: true
  });
});

router.get('/', function(req,res,next) {
  // redirect to the lobby
  res.redirect('/lobby')
})

module.exports = router;
