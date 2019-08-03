/*
  about.js
  This is the back-end of the about page for the app.
 */

const express = require('express');

const router = express.Router();

// Routes about.hbs page to /about
router.get('/', (req, res, next) => {
  res.render('about', {
    title: 'About Team 05'
  });
});

module.exports = router;
