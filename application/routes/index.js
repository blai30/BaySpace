const express = require('express');

const router = express.Router();

// Routes index.hbs page to / or /index (main page)
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'CSC 648 Team 05'
  });
});

module.exports = router;
