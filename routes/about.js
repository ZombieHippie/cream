var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about', {
    title: 'About Us',
    team_name: 'The Cream Stream Dream Team',
    team_members: ['Cole Lawrence','Matt Pierzynski','Kory Rekowski','David Robinson','Cameron Yuan']
  })
});

module.exports = router;
