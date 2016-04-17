var express = require('express')
var router = express.Router()
var database = require('../lib/database')

router.get('/:slug', function(req, res, next) {
  var slug = req.params.slug
  // TODO use slug to lookup connection information of peers

  database.Room
  .findOne({ slug: slug })
  .exec((error, roomDoc) => {

    if (roomDoc == null) {
      res.render("error", { message: "Room doesn't exist", error:{}})

    } else if (roomDoc.private) {
      res.redirect("/room/login/" + roomDoc.slug)

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
  .findOne({ slug: slug })
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

module.exports = router