/*
  about.js
  This is the back-end of the about page for the app.
 */

const express = require('express');

const router = express.Router();

const title = 'About Team 05';

// Routes about.hbs page to /about
router.get('/', (req, res, next) => {
  res.render('about', {
    title: title
  });
});

module.exports = router;
