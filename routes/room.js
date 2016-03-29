var express = require('express');
var router = express.Router();
var database = require('../database')


router.post('/create', function (req, res) {
  // check if name is used
  req.body.Name = req.body.Name.replace(/\W+/g, '-')
  if (database.rooms[req.body.Name] != null) {
    return res.render("error", {
      message: "Sorry there is already a room with the name: '" + req.body.Name + "'",
      error: {}
    })
  }

  // then
  database.rooms[req.body.Name] = {
    private: req.body.Private === "true",
    password: req.body.Password,
    capacity: parseInt(req.body.Capacity),
    peers: []
  }
  res.redirect('/room/' + req.body.Name)
})

/* GET users listing */
router.get('/login/:id', function(req, res, next) {
  var rid = req.params.id
  // TODO use rid to lookup connection information of peers
  // if rid does not match an available connection, send to lobby with message
  // if rid does match send proper information
  var room = database.rooms[rid]

  if (room == null) {
    res.render("error", { message: "Room doesn't exist", error:{}})
  } else {
    res.render('login', {
      title: rid + ' - Cream Room',
      room_id: rid,
      is_private: room.private,
    });
  }

});

router.get('/:id', function(req, res, next) {
  var rid = req.params.id
  // TODO use rid to lookup connection information of peers
  // if rid does not match an available connection, send to lobby with message
  // if rid does match send proper information
  var room = database.rooms[rid]

  if (room == null) {
    res.render("error", { message: "Room doesn't exist", error:{}})
  } else if (room.private) {
    res.redirect("/room/login/" + rid)
  } else {
    res.render('room', {
      title: rid + ' - Cream Room',
      room_id: rid,
      is_private: room.private,
    });
  }

});

/* POST */
router.post('/:id', function(req, res, next) {
  var rid = req.params.id
  var password = req.body.Password
  console.log(password)
  // TODO use rid to lookup connection information of peers
  // if rid does not match an available connection, send to lobby with message
  // if rid does match send proper information
  var room = database.rooms[rid]

  if (room == null) {
    res.render("error", { message: "Room doesn't exist", error:{}})
  } else if (password != room.password) {
    res.redirect("/room/login/" + rid + "?message=Password is incorrect!")
  } else {
    res.render('room', {
      title: rid + ' - Cream Room',
      room_id: rid,
      is_private: room.private,
    });
  }

})

router.get('/', function(req,res,next) {
  // redirect to the lobby
  res.redirect('/lobby')
})

module.exports = router;
