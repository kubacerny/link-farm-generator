var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

require('dotenv').config()
const { auth, requiresAuth } = require('express-openid-connect');

// Auth0
//    * session store is in a cookie
//    * /login redirects user to auth0, 
//    * AuthO after successful login to /admin and filling up authToken and saves it to a session store
//    * /logout screen will clean session store through Auth0 and then redirects to logout url
const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.OAUTH_ISSUER,
  secret: process.env.OAUTH_SECRET,
  routes: {
    callback: '/callback'
  }
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));
app.use(cookieParser());

app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "cdn.ampproject.org"],
      "img-src": ["'self'"]
    },
  }
}));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(auth0Config));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/admin', requiresAuth(), adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
