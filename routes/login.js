var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user == undefined) {
    res.render('login', { title: 'Login' });
  } else {
    res.redirect('/home');
  }
});

module.exports = router;
