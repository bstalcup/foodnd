var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  response = {message: "Welcome to the FOODND API", status: "success"}
  res.json(response);
});

/****************       USERS API          ***************/

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

router.get('/users/current', function(req, res, next) {
  res.json({'user': req.session.user});
});

router.post('/users/login', function(req, res, next) {
  if(req.body.username == undefined || req.body.password == undefined) {
    res.json({status:"error", message: "Not all required fields filled in", error_code:9001});
  } else {
    mysql = req.app.get('db');
    mysql.query('select user_id, user_name from users where user_name like \'' + req.body.username + '\' and user_pwd like password(\'' + req.body.password + '\');', function(err, rows, fields){
      if(err) {
	res.json({status: 'error', message: 'SQL Error, try again', error_code: 9004, information: err});
        return;
      }
      if(rows[0] == undefined) {
        res.json({status: 'error', message: 'Username or password incorrect'});
      } else {
        console.log(rows[0])
        req.session.user = rows[0];
        res.json({status: 'success', message: 'User successfully logged in'});
      }
    });
  }
});

router.post('/users/logout', function(req, res, next) {
  if(req.session.user){
    req.session.user = null;
    res.json({status: 'success', message: 'User successfully logged out'});
  } else {
    res.json({status: 'error', message: 'No user logged in'});
  }
})

router.post('/users/create', function(req, res, next) {
  if(req.body.username == undefined || req.body.password == undefined || req.body.confirm == undefined) {
    res.json({status:"error", message: "Not all reqired fields filled in", error_code: 9001});
  } else {
    if(req.body.password != req.body.confirm) {
      res.json({status:"error", message: "Passwords don't match", error_code: 9002});
      return;
    }
    mysql = req.app.get('db')
    mysql.query('select * from users where user_name like \'' + req.body.username + '\';', function(err, rows, fields){
      if(err) {
        res.json({status: "error", information: err, message:"SQL Error, try again", error_code: 9004});
	return;
      }
      if(rows[0] != undefined) {
        res.json({status:"error", message: "Username already exists", error_code: 9003})
        return;
      } else {
        query = 'insert into users (user_name, user_pwd) values (\'' + req.body.username + '\', password(\'' + req.body.password + '\'));'
        mysql.query('insert into users (user_name, user_pwd) values (\'' + req.body.username + '\', password(\'' + req.body.password + '\'));', function(err, response) {
        if(err) {
          res.json({status: "error", information: err, message:"SQL Error, try again", error_code: 9004, 'query': query});
        } else {
	  mysql.query('SELECT `AUTO_INCREMENT` from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA = \'foodnd\' and TABLE_NAME = \'users\';', function(err, rows, fields){
            if (err) {
              res.json({status: "error", information: err, message:"SQL Error, try again", error_code: 9004, 'query': query});
            } else {
              res.json({status: "success", message: "Username created", "user_id": rows[0]['AUTO_INCREMENT']-1, "response": response});
            }
          });
          //req.session.user = userId;
          }
        });
      }
    });
  }
});



router.get('/users/:userid', function(req, res, next) {
  mysql = req.app.get('db');
  mysql.query('select * from users where user_id = ' + req.params.userid + ';', function(err, rows, fields) {
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

/***************      COMMENTS API         ***************/


router.post('/comments', function(req, res, next){
  if(req.body.software_id == undefined) {
    res.json({status:"error", message: "Please specify a particular software", error_code: 9001});
  } else if(req.body.rank == undefined) {
    res.json({status:"error", message: "Please include a ranking of the software", error_code: 9002});
  } else if(req.body.text == undefined || req.body.text == "") {
    res.json({status:"error", message: "Please include text in the comment", error_code: 9003});
  } else if(req.session.user == undefined) {
    res.json({status:"error", message: "User must be logged in to comment", error_code: 9004});
  } else if(String(req.body.text).length > 150) {
    res.json({status:"error", message: "Comment too long.", error_code: 9005})
  } else {
    if(req.session.user.user_id == undefined) {
      res.json({status:"error", message: "User must be logged in to comment", error_code: 9004});
      return;
    }
    mysql = req.app.get('db');
    query = 'select * from comment where user_id = ' + req.session.user.user_id + ' and s_id = ' + req.body.software_id + ';';
    mysql.query( query, function(err, rows, fields) {
      if (err) {
        res.json({status: "error", information: err, message:"SQL Error, try again", error_code: 9006, 'query': query});
      } else {
        if(rows[0] == undefined) {
          query = 'insert into comment (user_id, com_text, com_time, com_rank, s_id) values (' + req.session.user.user_id + ', \'' + req.body.text + '\', \'' + String(Date()) + '\', ' + req.body.rank + ', ' + req.body.software_id + ');'
          mysql.query(query, function(err, response){
            if (err) {
              res.json({status: "error", information: err, message:"SQL Error, try again", error_code: 9006, 'query': query});
            } else {
              mysql.query('SELECT `AUTO_INCREMENT` from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA = \'foodnd\' and TABLE_NAME = \'comment\';', function(err, rows, fields){
                if (err) {
                  res.json({status: "error", information: err, message:"SQL Error, try again", error_code: 9004, 'query': query});
                } else {
                  res.json({status: "success", message: "Comment created", "comment_id": rows[0]['AUTO_INCREMENT']-1, "response": response});
                }
              });
	    }	
          });
        } else {
          //update comment?
          res.json({status: "error", message: "Comment already exists for that user", error_code: 9007});
        }
      }
    })
  }

});

/****************       VOTES API          ***************/

//router.post('/comments', function(req, res, next){

//create a vote
router.post('/comments/:commentid/vote', function(req, res, next){
  if ( req.body.rank == undefined ) {
    res.json({status: "error", message: "Must include rank in the vote", error_code: "9001"});
  } else if ( req.session.user == undefined ) {
    res.json({status: "error", message: "User must be logged in", error_code: 9002});
  } else {
    mysql = req.app.get('db');
    query = 'select * from vote where user_id = ' + req.session.user.user_id + ' and com_id = ' + req.params.commentid + ';';
    mysql.query(query, function(err, rows, fields){
      if ( err ) {
        res.json({status: "error", message: "SQL Error, try again", error_code: 9003, "query": query});
      } else {
        if ( rows[0] == undefined ) { 
          query = "insert into vote (com_id, user_id, rank) values (" + req.params.commentid + ", " + req.session.user.user_id + ", " + req.body.rank + ")";
          mysql.query(query, function(err, response){
            if ( err ) {
              res.json({status: "error", message: "SQL Error, try again", error_code: 9003, "query": query});
            } else {
              query = 'SELECT `AUTO_INCREMENT` from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA = \'foodnd\' and TABLE_NAME = \'vote\';';
              mysql.query(query, function(err, rows, fields){
                if ( err ) {
                  res.json({status: "error", message: "SQL Error, try again", error_code: 9003, "query": query});
                } else {
                  res.json({status:"success", "vote_id": rows[0]['AUTO_INCREMENT']-1, message: "Vote created"});
                }
              });  
            }
          });
        } else {
          //update vote?
          res.json({status: "error", message: "vote already exists", error_code: 9004});
        }
      }
    })
  }
});

//search
//
//

router.get('/search/software/', function(req, res, next){
  if(req.query.query == undefined || req.query.query == "") {
    res.json({status: "error", message: "Please include a search string", query: req.query});
  } else {
    var search = req.query.query;
    var search = search.replace(/\W/g, '');
    mysql = req.app.get('db');
    query = 'select s_name, s_shortname from software where s_name like \'' + search + '%\';'
    mysql.query(query, function(err, rows, fields){
      if ( err ) {
        res.json({status: error, message: "SQL error, try again.", error_code: 9002});
      } else if (rows[0] != undefined) {
        var results = []
        var information = [];
        for ( i in rows ) {
          information.push({"value": rows[i]["s_name"], data: '/software/' + rows[i]['s_shortname']});
          results.push(rows[i]["s_name"]);
        }
        res.json({status: "success", "suggestions": information, "results": results}); 
      } else {
        query = 'select s_name, s_shortname from software where s_name like \'%' + search + '%\';'
        mysql.query(query, function(err, rows, fields){
          if ( err ) {
            res.json({status: error, message: "SQL error, try again.", error_code: 9002});
          } else {
            var information = [];
            var results = [];
            for ( i in rows ) {
              information.push({"name": rows[i]["s_name"], url: '/software/' + rows[i]['s_shortname']});
              results.push(rows[i]["s_name"]);
            }
            res.json({status: "success", "information": information, suggestions: results, "results": results}); 
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
