var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet');

var generatedPageRouter = require('./routes/generatedPageRouter');
var imageRouter = require('./routes/imageRouter');

var configProvider = require('./lib/configProvider');
var generators = require('./lib/generators');


const configFilePath = '../config/app-config.json';

// init app 
// - prepare data

const config = configProvider.init(configFilePath);
generators.init();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "cdn.ampproject.org"],
      "img-src": ["'self'", "obrazky.localhost:3000"],
    },
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', imageRouter);
app.use('/', generatedPageRouter);

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
