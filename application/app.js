const express = require("express");
const createError = require('http-errors');
const path = require('path');
const hbs = require("hbs");

// Routers
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const signinRouter = require('./routes/signin');
const searchRouter = require('./routes/search');
const ticketsRouter = require('./routes/tickets');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

// Serve files statically, bootstrap directories
app.use(express.static(path.join(__dirname, 'public')));

// Route bootstrap dependencies and serve statically
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery')));
app.use('/popper', express.static(path.join(__dirname, '/node_modules/popper')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap')));

// Connect routes
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/signin', signinRouter);
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
