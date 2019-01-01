var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//1.set views file directory
app.set('view engine', 'jade');//2.set view engine(html template)

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));//set console log format: colored dev option
app.use(bodyParser.json());//only parse json
app.use(bodyParser.urlencoded({ extended: false }));// parsing the URL-encoded data with the querystring library
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//serve static files in public directory

app.use('/', routes);//self-defined routes middleware

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);//move to next middleware
});

// error handlers

if (app.get('env') === 'development') {//process.env.NODE_ENV
    // development error handler
    // will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
    app.locals.pretty = true;
} else {
    // production error handler
    // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
            message: err.message,
            error: {}
	});
    });
}

module.exports = app;
