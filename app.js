var express = require('express');
var fs = require('fs');
var constants = require('constants')

var privateKey = fs.readFileSync('food-key.pem', 'utf8')
var certificate = fs.readFileSync('23d1b9b749b4f6fc.crt', 'utf8')
var credentials = {secureProtocol: 'SSLv23_method', secureOptions: constants.SSL_OP_NO_SSLv3, key: privateKey, cert: certificate};

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var util = require('util');
var http = require('http');
var https = require('https');
var passport = require('passport'), 
  LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'foodnd'
});

connection.connect();


var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var login = require('./routes/login');
var home = require('./routes/home');
var software = require('./routes/software');

var app = express();

app.set('db', connection);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'FOODND', resave: true, saveUninitialized: true}));

res = {db: connection}

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
app.use('/login', login);
app.use('/home', home);
app.use('/software', software);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/

// error handlers

app.use(function(req, res, next){
  res.status(404);

  if (req.accepts('html')) {
    var data = {url: req.url};
    if ( req.session.user != undefined ) {
      data['user'] = req.session.user;
    }
    res.render('404', data);
    return;
  }

  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
//module.exports = app;
