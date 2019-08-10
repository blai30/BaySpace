/*
  router.js
 */

const express = require('express');

const router = express.Router({
  mergeParams: true
});

module.exports = (app) => {
  app.use('/', require('../routes/index'));
  app.use('/about', require('../routes/about'));
  app.use('/users', require('../routes/users'));
  app.use('/search', require('../routes/search'));
  app.use('/post', require('../routes/post'));
  app.use('/map', require('../routes/map'));
  app.use('/tickets', require('../routes/tickets'));
};
