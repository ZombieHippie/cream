var express = require('express');
var router = express.Router();
var database = require('../database')


router.post('/create', function (req, res, next) {
  // check if name is used
  var name = req.body.Name
  var slug = name.replace(/\W+/g, '-')

  database.Room
  .findOne({ slug: slug })
  .exec((error, doc) => {
    if (error) return next(error)

    // Make sure room with this name does not exist
    if (doc != null) {
      return res.render("error", {
        message: "Sorry there is already a room with the name: '" + req.body.Name + "'",
        error: {}
      })
    } else {
      // then
      var password = req.body.Password
      var roomDoc = new database.Room({
        slug: slug,
        name: name,
        private: req.body.Private === "true",
        capacity: parseInt(req.body.Capacity),
        creationDate: new Date(),
      })

      roomDoc.setPassword(password, (error, doc) => {
        if (error) return next(error)

        // Save the doc into the database
        doc.save((error) => {
          if (error) return next(error)

          res.redirect('/room/' + req.body.Name)
        })
      })

    }
  })

})

/* GET users listing */
router.get('/login/:slug', function(req, res, next) {
  var slug = req.params.slug
  
  database.Room
  .find({ slug: slug })
  .exec((error, roomDoc) => {
    if (error) return next(error)

    if (roomDoc == null) {
      res.render("error", { message: "Room doesn't exist", error:{}})
    
    } else {
      res.render('login', {
        title: roomDoc.name + ' - Cream Room',
        room_id: roomDoc.slug,
        is_private: roomDoc.private,
      });
    }
  })

});

router.get('/:slug', function(req, res, next) {
  var slug = req.params.slug
  // TODO use slug to lookup connection information of peers
  
  database.Room
  .find({ slug: slug })
  .exec((error, roomDoc) => {

    if (roomDoc == null) {
      res.render("error", { message: "Room doesn't exist", error:{}})

    } else if (roomDoc.private) {
      res.redirect("/room/login/" + rid)

    } else {
      res.render('room', {
        title: roomDoc.name + ' - Cream Room',
        room_id: roomDoc.slug,
        is_private: roomDoc.private,
      })
    }
  })

});

/* POST */
router.post('/:slug', function(req, res, next) {
  var slug = req.params.slug
  var password = req.body.Password
  // TODO use slug to lookup connection information of peers
  
  database.Room
  .find({ slug: slug })
  .exec((error, roomDoc) => {
    if (roomDoc == null) {
      res.render("error", { message: "Room doesn't exist", error:{}})

    } else {
      roomDoc.verifyPassword(
        password,
        (error, passValid) => {
          if (error) return next(error)

          if (!passValid) {
            res.redirect("/room/login/" + slug + "?message=Password is incorrect!")

          } else {
            res.render('room', {
              title: roomDoc.name + ' - Cream Room',
              room_id: roomDoc.slug,
              is_private: roomDoc.private,
            })
          }
        }
      )
    }
  })
  
})

router.get('/', function(req,res,next) {
  // redirect to the lobby
  res.redirect('/lobby')
})

module.exports = router;
