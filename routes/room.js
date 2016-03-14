var express = require('express');
var router = express.Router();

var rooms = {
  "hello": {
    private: false,
    password: "creamy",
    capacity: 3
  }
}

router.post('/create', function (req, res) {
  // check if name is used

  // then
  rooms[req.body.Name] = {
    private: req.body.Private === "true",
    password: req.body.Password,
  }
  res.redirect('/room/' + req.body.Name)
})

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  var rid = req.params.id
  // TODO use rid to lookup connection information of peers
  // if rid does not match an available connection, send to lobby with message
  // if rid does match send proper information
  var room = rooms[rid]

  if (room == null) {
    res.render("error", { message: "Room doesn't exist", error:{}})

  } else {
    res.render('room', {
      title: rid + ' - Cream Room',
      roomId: rid,
      isAdmin: room.private,
    });
  }

});

router.get('/', function(req,res,next) {
  // redirect to the lobby
  res.redirect('/lobby')
})

module.exports = router;
