var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// npm i mongoose --save
var mongoose = require('mongoose');

mongoose.connect('mongodb://id215:pw215@1.234.5.158:37017/db215')
var db = mongoose.connection;
db.once('open', function(){
  console.log('mongdb 열결됨');
});


require('./routes/chat'); // rest apt가 아님 url 불필요
//require('./routes/cron'); // rest apt가 아님 url 불필요

// routes 등록
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bookRouter = require('./routes/book');
var memberRouter = require('./routes/member');
var itemRouter = require('./routes/item');
var uploadRouter = require('./routes/upload');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/book', bookRouter);
app.use('/member', memberRouter);
app.use('/item', itemRouter);
app.use('/upload', uploadRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
