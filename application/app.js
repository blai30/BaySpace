const express = require('express');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Routers
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const usersRouter = require('./routes/users');
const searchRouter = require('./routes/search');
const ticketsRouter = require('./routes/tickets');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

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

// Connect routes
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/tickets', ticketsRouter);

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
