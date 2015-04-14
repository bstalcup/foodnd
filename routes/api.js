var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  response = {message: "Welcome to the FOODND API", status: "success"}
  res.json(response);
});

router.get('/users', function(req, res, next) {
  mysql = req.app.get('db');
  mysql.query('select * from users;', function(err, rows, fields){
    if (err) {
      res.json({status:"error", response: err});
    } else {
      res.json({status:"success", users: rows})
    }
  });
});

router.get('/users/:userid', function(req, res, next) {
  mysql = req.app.get('db');
  mysql.query('select * from users where userId = \'' + req.params.userid + '\';', function(err, rows, fields) {
    if (err) {
      res.json({status:"error", message: err});
    } else {
      if (rows[0] == undefined) {
        res.json({status:"error", message: "Not existing user with that ID"})
      }
      res.json({status:"success", user: rows[0]});
    }
  });
});

router.post('/users/login', function(req, res, next) {
  if(req.body.username == undefined || req.body.password == undefined) {
    res.json({status:"error", message: "Not all required fields filled in"});
  } else {
    mysql = req.app.get('db');
    mysql.query('select userId, name from users where name like \'' + req.body.username + '\' and password like password(\'' + req.body.password + '\');', function(err, rows, fields){
      if(rows[0] == undefined) {
        res.json({status: 'error', message: 'Username or password incorrect'});
      } else {
        req.session.user = rows[0];
        res.json({status: 'success', message: 'User successfully logged in'});
        
      }
    });
  }
});

router.get('/user/current', function(req, res, next) {
  res.json({'user': req.session.user});
});

router.post('/users/create', function(req, res, next) {
  if(req.body.username == undefined || req.body.password == undefined) {
    res.json({status:"error", message: "Not all reqired fields filled in"});
  } else {
    mysql = req.app.get('db')
    mysql.query('select * from users where name like \'' + req.body.username + '\';', function(err, rows, fields){
      if(rows[0] != undefined) {
        res.json({status:"error", message: "Username already exists"})
      } else {
        var userId = makeid();
        mysql.query('insert into users (name, password, userId) values (\'' + req.body.username + '\', password(\'' + req.body.password + '\'), \''+ userId +'\');', function(err, response) {
        if(err) {
          res.json({status: "error", message: err, "userid": userId});
        } else {
          req.session.user = userId;
          res.json({status: "success", message: "Username created", "userId": userId, "response": response});
          }
        });
      }
    });
  }
});

function makeid()
{
    var text = "";
    var possible = "0123456789abcdef";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = router;
