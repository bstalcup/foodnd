var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user == undefined) {
    res.redirect('/login')
  } else {
    res.render('home', { title: "Home", user: req.session.user });
  }
});

module.exports = router;
