/*
  app.js
  This file sets up the server back-end with routes, view engine, static directories, and more. This file is NOT the entry point to the application. The entry point is index.js.
 */

const express = require('express');
const createError = require('http-errors');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const got = require('got');

// Initialize the app itself with express
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerHelper('if_eq', (a, b, options) => {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// Flash requires an express session to work
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Initialize passport, used for login and registration
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Initialize flash to view global messages
app.use(flash());

// Initialize global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Serve files statically, bootstrap directories
app.use(express.static(path.join(__dirname, 'public')));

// Route bootstrap dependencies and serve statically
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery')));
app.use('/popper', express.static(path.join(__dirname, '/node_modules/popper')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap')));

// Connect routes to the site, this must be after initializing flash and global variables
require('./models/router')(app);

// Google analytics
app.enable('trust proxy');
// The following environment variable is set by app.yaml when running on App
// Engine, but will need to be set manually when running locally. See README.md.
const {GA_TRACKING_ID} = process.env;

const trackEvent = (category, action, label, value) => {
  const data = {
    // API Version.
    v: '1',
    // Tracking ID / Property ID.
    tid: GA_TRACKING_ID,
    // Anonymous Client Identifier. Ideally, this should be a UUID that
    // is associated with particular user, device, or browser instance.
    cid: '555',
    // Event hit type.
    t: 'event',
    // Event category.
    ec: category,
    // Event action.
    ea: action,
    // Event label.
    el: label,
    // Event value.
    ev: value,
  };

  return got.post('http://www.google-analytics.com/collect', data);
};


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
