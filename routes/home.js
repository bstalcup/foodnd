var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user == undefined) {
    res.redirect('/login')
  } else {
    data = {user: req.session.user};
    query = 'select software.s_name as software, software.s_shortname as link, comment.com_id, if(sum(vote.rank) is null, 0, sum(vote.rank)) as score, com_rank as rank, user_name, com_text as text from users left join comment on users.user_id = comment.user_id left outer join vote on comment.com_id = vote.com_id left join software on software.s_id = comment.s_id where users.user_id = ' +  req.session.user.user_id + ' group by com_id;'
    mysql = req.app.get('db');
    mysql.query(query, function(err, rows, fields){
      if ( err ) {
        res.render('home', { title: "ERROR", error: err, user: {user_name: "ERROR"}});
        console.log(err);
      } else {
        data['comments'] = rows;
        query = 'select com_id, rank from vote where user_id = ' + req.session.user.user_id + ';'
        mysql.query(query, function(err, rows, fields){
          if ( err ) {
            res.render('home', { title: "ERROR", error: err, user: {user_name: "ERROR"}});
          } else {
            for(i in rows){
              for(j in data.comments){
                if(rows[i].com_id == data.comments[j].com_id) {
                  data.comments[j].voted = rows[i].rank;
                }
              }
            }
            res.render('home', data);
          }
        });
       // res.render('home', { title: "Home", user: req.session.user, comments: rows });
      }
    }); 
//      res.render('home', { title: "Home", user: req.session.user });
  }
});

module.exports = router;
