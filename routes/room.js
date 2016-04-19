var express = require('express');
var router = express.Router();
var database = require('../lib/database')

router.post('/create', function (req, res, next) {
  // check if name is used
  var name = req.body.Name
  var slug = name
    .replace(/\W+/g, '-')
    .replace(/^\-|\-$/g, '')
    .toLowerCase()

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
    } else if(parseInt(req.body.Capacity) < 2 || parseInt(req.body.Capacity) > 6 || req.body.Capacity == ''){
      // Makes sure the capacity size is not less than 2 or greater than 6.
      // Also makes sure the capacity size isn't left empty or has spaces.
      return res.render("error", {
        message: "'" + req.body.Capacity + "' is an invalid input for capacity. Please enter a capacity between 2 and 6.",
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

      roomDoc.setPassword(password || "", (error, doc) => {
        if (error) return next(error)

        // Save the doc into the database
        doc.save((error) => {
          if (error) return next(error)

          // not always necessary to have req.app.locals.host except for this // functionality
          res.redirect('/r/' + slug)
        })
      })

    }
  })

})

/* GET users listing */
router.get('/login/:slug', function(req, res, next) {
  var slug = req.params.slug

  database.Room
  .findOne({ slug: slug })
  .exec((error, roomDoc) => {
    if (error) return next(error)

    if (roomDoc == null) {
      res.render("error", { message: "Room doesn't exist", error:{}})

    } else {
      res.render('login', {
        title: roomDoc.name + ' - Cream Room',
        room: roomDoc,
        is_private: roomDoc.private,
      });
    }
  })

})

router.get('/', function(req,res,next) {
  // redirect to the lobby
  res.redirect('/lobby')
})

module.exports = router;
